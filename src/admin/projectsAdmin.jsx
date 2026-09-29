import { useEffect, useRef, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import {
  Edit3,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { db, storage } from "../firebase/firebase";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  projectUrl: "",
  technologies: "",
  order: 1,
  featured: true,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [oldImageUrl, setOldImageUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [projectsLoading, setProjectsLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const fileInputRef = useRef(null);

  /*
   * Load projects
   */
  useEffect(() => {
    const projectsQuery = query(
      collection(db, "projects"),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setProjects(data);
        setProjectsLoading(false);
      },
      (error) => {
        console.error(error);
        setProjectsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * Input handler
   */
  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /*
   * Image handler
   */
  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select a valid image."
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage(
        "Image must be smaller than 5MB."
      );

      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );

    setMessage("");
  };

  /*
   * Reset form
   */
  const resetForm = () => {
    setForm(emptyForm);
    setImage(null);
    setPreview("");
    setEditingId(null);
    setOldImageUrl("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * Upload image
   */
  const uploadProjectImage = async (
    projectId
  ) => {
    if (!image) {
      return oldImageUrl;
    }

    const extension =
      image.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const imageRef = ref(
      storage,
      `projects/${projectId}/${Date.now()}.${extension}`
    );

    await uploadBytes(
      imageRef,
      image
    );

    return await getDownloadURL(
      imageRef
    );
  };

  /*
   * Save project
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage(
        "Project title is required."
      );

      return;
    }

    if (!form.category.trim()) {
      setMessage(
        "Project category is required."
      );

      return;
    }

    if (!editingId && !image) {
      setMessage(
        "Please upload a project image."
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let projectId = editingId;

      /*
       * Create project first
       * so we have document ID for image storage
       */
      if (!editingId) {
        const projectRef = await addDoc(
          collection(db, "projects"),
          {
            title: form.title.trim(),
            category:
              form.category.trim(),
            description:
              form.description.trim(),
            projectUrl:
              form.projectUrl.trim(),
            technologies:
              form.technologies
                .split(",")
                .map((item) =>
                  item.trim()
                )
                .filter(Boolean),
            featured:
              form.featured,
            order:
              Number(form.order) || 1,
            imageUrl: "",
            createdAt:
              serverTimestamp(),
            updatedAt:
              serverTimestamp(),
          }
        );

        projectId = projectRef.id;
      }

      /*
       * Upload image
       */
      let imageUrl = oldImageUrl;

      if (image) {
        imageUrl =
          await uploadProjectImage(
            projectId
          );
      }

      /*
       * Update final data
       */
      await updateDoc(
        doc(
          db,
          "projects",
          projectId
        ),
        {
          title: form.title.trim(),
          category:
            form.category.trim(),
          description:
            form.description.trim(),
          projectUrl:
            form.projectUrl.trim(),
          technologies:
            form.technologies
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),
          featured:
            form.featured,
          order:
            Number(form.order) || 1,
          imageUrl,
          updatedAt:
            serverTimestamp(),
        }
      );

      setMessage(
        editingId
          ? "Project updated successfully."
          : "Project added successfully."
      );

      resetForm();
    } catch (error) {
      console.error(
        "Project save error:",
        error
      );

      setMessage(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Edit project
   */
  const handleEdit = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      category:
        project.category || "",
      description:
        project.description || "",
      projectUrl:
        project.projectUrl || "",
      technologies:
        project.technologies?.join(
          ", "
        ) || "",
      order:
        project.order || 1,
      featured:
        project.featured ?? true,
    });

    setOldImageUrl(
      project.imageUrl || ""
    );

    setPreview(
      project.imageUrl || ""
    );

    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Delete project
   */
  const handleDelete = async (
    project
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${project.title}"?`
      );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(
          db,
          "projects",
          project.id
        )
      );

      /*
       * Delete image from storage
       *
       * Firebase may return an error if
       * the old image no longer exists.
       */
      if (project.imageUrl) {
        try {
          const imageRef =
            ref(
              storage,
              project.imageUrl
            );

          await deleteObject(
            imageRef
          );
        } catch (storageError) {
          console.log(
            "Storage image could not be deleted:",
            storageError
          );
        }
      }

      setMessage(
        "Project deleted successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Could not delete project."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Codirung Admin
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Featured Projects
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
            Add and manage the projects that
            appear on your agency website.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-sm text-white/60">
              {message}
            </p>

            <button
              onClick={() =>
                setMessage("")
              }
              className="text-white/30 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Form */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                {editingId
                  ? "Edit project"
                  : "New project"}
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {editingId
                  ? "Update project"
                  : "Add project"}
              </h2>
            </div>

            {editingId && (
              <button
                onClick={resetForm}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <X size={15} />
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-2"
          >
            {/* Image */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm text-white/60">
                Project Image
              </label>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="
                  group
                  relative
                  flex
                  min-h-[240px]
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border
                  border-dashed
                  border-white/10
                  bg-white/[0.02]
                  transition
                  hover:border-white/20
                  hover:bg-white/[0.04]
                "
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImagePlus
                      size={35}
                      className="mx-auto text-white/20"
                    />

                    <p className="mt-4 text-sm text-white/40">
                      Click to upload image
                    </p>

                    <p className="mt-1 text-xs text-white/20">
                      PNG, JPG or WEBP — max 5MB
                    </p>
                  </div>
                )}

                {preview && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <div className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black">
                      Change Image
                    </div>
                  </div>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Project Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. NexHire"
                className="admin-input"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Category *
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Web Application"
                className="admin-input"
              />
            </div>

            {/* URL */}
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Project URL
              </label>

              <input
                type="url"
                name="projectUrl"
                value={form.projectUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className="admin-input"
              />
            </div>

            {/* Order */}
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Display Order
              </label>

              <input
                type="number"
                name="order"
                min="1"
                value={form.order}
                onChange={handleChange}
                className="admin-input"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm text-white/60">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the project..."
                className="admin-input resize-none"
              />
            </div>

            {/* Technologies */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm text-white/60">
                Technologies
              </label>

              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="admin-input"
              />

              <p className="mt-2 text-xs text-white/20">
                Separate technologies using commas.
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                id="featured"
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4 accent-white"
              />

              <label
                htmlFor="featured"
                className="text-sm text-white/50"
              >
                Show on landing page
              </label>
            </div>

            {/* Submit */}
            <div className="flex justify-end lg:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  min-w-[180px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-white/90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Save size={16} />

                    Update Project
                  </>
                ) : (
                  <>
                    <Plus size={16} />

                    Add Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Projects */}
        <div className="mt-12">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/25">
              Portfolio
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Existing Projects
            </h2>
          </div>

          {projectsLoading ? (
            <div className="py-10 text-center text-sm text-white/30">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
              <p className="text-sm text-white/30">
                No projects added yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map(
                (project) => (
                  <div
                    key={project.id}
                    className="
                      flex
                      flex-col
                      gap-5
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.02]
                      p-4
                      transition
                      hover:border-white/15
                      sm:flex-row
                      sm:items-center
                    "
                  >
                    {/* Thumbnail */}
                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-white/5 sm:w-40">
                      {project.imageUrl && (
                        <img
                          src={
                            project.imageUrl
                          }
                          alt={
                            project.title
                          }
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold">
                          {project.title}
                        </h3>

                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-[9px]
                            ${
                              project.featured
                                ? "bg-green-400/10 text-green-400"
                                : "bg-white/5 text-white/30"
                            }
                          `}
                        >
                          {project.featured
                            ? "Featured"
                            : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-white/30">
                        {project.category}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies
                          ?.slice(0, 4)
                          .map(
                            (
                              technology
                            ) => (
                              <span
                                key={
                                  technology
                                }
                                className="rounded-full bg-white/5 px-2 py-1 text-[9px] text-white/30"
                              >
                                {
                                  technology
                                }
                              </span>
                            )
                          )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleEdit(
                            project
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-white/10
                          px-4
                          py-2.5
                          text-xs
                          text-white/50
                          transition
                          hover:bg-white/5
                          hover:text-white
                        "
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            project
                          )
                        }
                        className="
                          flex
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-red-500/10
                          px-3
                          py-2.5
                          text-red-400/50
                          transition
                          hover:bg-red-500/10
                          hover:text-red-400
                        "
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}