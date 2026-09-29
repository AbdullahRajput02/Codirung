import { useEffect, useState } from "react";
import {
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "../firebase/firebase";

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    imageUrl: "",
    imagePath: "",
    projectUrl: "",
    technologies: "",
    featured: true,
    order: 0,
  });

  const [imageFile, setImageFile] = useState(null);

  // -----------------------------------------
  // LOAD PROJECTS FROM REALTIME DATABASE
  // -----------------------------------------

  useEffect(() => {
    const projectsRef = ref(db, "projects");

    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        const data = snapshot.val() || {};

        const projectList = Object.entries(data)
          .map(([id, project]) => ({
            id,
            ...project,
          }))
          .sort(
            (a, b) =>
              Number(a.order || 0) - Number(b.order || 0)
          );

        setProjects(projectList);
        setLoading(false);
      },
      (error) => {
        console.error("Projects loading error:", error);

        setError("Unable to load projects.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // -----------------------------------------
  // FORM INPUT
  // -----------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -----------------------------------------
  // IMAGE SELECT
  // -----------------------------------------

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    // Only image files
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
  };

  // -----------------------------------------
  // RESET FORM
  // -----------------------------------------

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      imageUrl: "",
      imagePath: "",
      projectUrl: "",
      technologies: "",
      featured: true,
      order: 0,
    });

    setImageFile(null);
    setEditingId(null);

    const imageInput = document.getElementById(
      "project-image"
    );

    if (imageInput) {
      imageInput.value = "";
    }
  };

  // -----------------------------------------
  // STORE IMAGE WITH THE PROJECT
  // -----------------------------------------

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read image file."));
      reader.readAsDataURL(file);
    });

  const uploadProjectImage = async (file) => {
    if (!file) {
      return null;
    }

    // Keep the image in RTDB so project saving does not depend on
    // Firebase Storage CORS, bucket setup, or Storage rules.
    const imageUrl = await fileToDataUrl(file);

    return {
      imageUrl,
      imagePath: "",
    };
  };

  // -----------------------------------------
  // ADD / UPDATE PROJECT
  // -----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const title = formData.title.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();
    const projectUrl = formData.projectUrl.trim();

    if (!title) {
      setError("Project title is required.");
      return;
    }

    if (!category) {
      setError("Project category is required.");
      return;
    }

    if (!description) {
      setError("Project description is required.");
      return;
    }

    try {
      setSaving(true);

      // ---------------------------------------
      // EDIT EXISTING PROJECT
      // ---------------------------------------

      if (editingId) {
        let imageData = {
          imageUrl: formData.imageUrl,
          imagePath: formData.imagePath,
        };

        // New image selected
        if (imageFile) {
          const uploadedImage = await uploadProjectImage(
            imageFile
          );

          if (uploadedImage) {
            imageData = uploadedImage;
          }

          // Images are stored directly in RTDB, so there is no old
          // Storage object to delete.
        }

        await update(
          ref(db, `projects/${editingId}`),
          {
            title,
            category,
            description,
            imageUrl: imageData.imageUrl || "",
            imagePath: imageData.imagePath || "",
            projectUrl,
            technologies: formData.technologies
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            featured: Boolean(formData.featured),
            order: Number(formData.order) || 0,
            updatedAt: Date.now(),
          }
        );

        setSuccess("Project updated successfully.");

        resetForm();

        return;
      }

      // ---------------------------------------
      // CREATE NEW PROJECT
      // ---------------------------------------

      const projectsRef = ref(db, "projects");
      const newProjectRef = push(projectsRef);

      const projectId = newProjectRef.key;

      let imageData = {
        imageUrl: "",
        imagePath: "",
      };

      if (imageFile && projectId) {
        const uploadedImage = await uploadProjectImage(
          imageFile
        );

        if (uploadedImage) {
          imageData = uploadedImage;
        }
      }

      await set(newProjectRef, {
        title,
        category,
        description,

        imageUrl: imageData.imageUrl,
        imagePath: imageData.imagePath,

        projectUrl,

        technologies: formData.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        featured: Boolean(formData.featured),

        order: Number(formData.order) || 0,

        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      setSuccess("Project added successfully.");

      resetForm();
    } catch (error) {
      console.error("Project save error:", error);

      setError(
        error?.message ||
          "Something went wrong while saving the project."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // EDIT PROJECT
  // -----------------------------------------

  const handleEdit = (project) => {
    setError("");
    setSuccess("");

    setEditingId(project.id);

    setFormData({
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      imageUrl: project.imageUrl || "",
      imagePath: project.imagePath || "",
      projectUrl: project.projectUrl || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      featured: project.featured === true,
      order: project.order || 0,
    });

    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -----------------------------------------
  // DELETE PROJECT
  // -----------------------------------------

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      // Delete RTDB project
      await remove(ref(db, `projects/${project.id}`));

      setSuccess("Project deleted successfully.");

      if (editingId === project.id) {
        resetForm();
      }
    } catch (error) {
      console.error("Project delete error:", error);

      setError(
        error?.message ||
          "Unable to delete the project."
      );
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-center py-20">

          <div className="text-center">

            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-sm text-white/40">
              Loading projects...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="mb-8">

        <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-3">
          Portfolio
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>

            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Projects
            </h2>

            <p className="text-white/40 mt-3 max-w-2xl">
              Add and manage the projects displayed on the
              Codirung website.
            </p>

          </div>

          <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/50">
            {projects.length}{" "}
            {projects.length === 1 ? "Project" : "Projects"}
          </div>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
          <p className="text-sm text-green-400">
            {success}
          </p>
        </div>
      )}

      {/* FORM */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

        <div className="flex items-center justify-between gap-4 mb-7">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
              {editingId ? "Edit Project" : "New Project"}
            </p>

            <h3 className="text-xl font-medium">
              {editingId
                ? "Update project"
                : "Add a project"}
            </h3>

          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE + CATEGORY */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm text-white/50 mb-2">
                Project Title *
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. NexHire"
                className="w-full h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
              />

            </div>

            <div>

              <label className="block text-sm text-white/50 mb-2">
                Category *
              </label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Web Development"
                className="w-full h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="block text-sm text-white/50 mb-2">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the project..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none resize-none placeholder:text-white/20 focus:border-white/30"
            />

          </div>

          {/* PROJECT URL */}

          <div>

            <label className="block text-sm text-white/50 mb-2">
              Project URL
            </label>

            <input
              name="projectUrl"
              type="url"
              value={formData.projectUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
            />

          </div>

          {/* TECHNOLOGIES */}

          <div>

            <label className="block text-sm text-white/50 mb-2">
              Technologies
            </label>

            <input
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none placeholder:text-white/20 focus:border-white/30"
            />

            <p className="text-xs text-white/25 mt-2">
              Separate technologies with commas.
            </p>

          </div>

          {/* IMAGE */}

          <div>

            <label
              htmlFor="project-image"
              className="block text-sm text-white/50 mb-2"
            >
              Project Image
            </label>

            <input
              id="project-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-medium file:text-black"
            />

            <p className="text-xs text-white/25 mt-2">
              Maximum file size: 5MB.
            </p>

          </div>

          {/* ORDER + FEATURED */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm text-white/50 mb-2">
                Display Order
              </label>

              <input
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="w-full h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none focus:border-white/30"
              />

            </div>

            <div className="flex items-center">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4"
                />

                <span className="text-sm text-white/60">
                  Show on Featured Projects
                </span>

              </label>

            </div>

          </div>

          {/* SUBMIT */}

          <div className="pt-3">

            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto px-7 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>

          </div>

        </form>

      </div>

      {/* PROJECT LIST */}

      <div className="mt-8">

        <div className="mb-5">

          <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
            Existing Projects
          </p>

          <h3 className="text-xl font-medium">
            Project List
          </h3>

        </div>

        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">

            <p className="text-white/40">
              No projects added yet.
            </p>

            <p className="text-sm text-white/20 mt-2">
              Add your first project using the form above.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {projects.map((project) => (

              <div
                key={project.id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20"
              >

                {/* IMAGE */}

                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title || "Project"}
                    className="h-48 w-full object-cover sm:h-52"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-black/30 sm:h-52">
                    <span className="text-sm text-white/20">
                      No image
                    </span>
                  </div>
                )}

                {/* CONTENT */}

                <div className="flex flex-1 flex-col p-4 sm:p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <p className="text-xs text-white/30 uppercase tracking-wider">
                        {project.category || "Project"}
                      </p>

                      <h4 className="mt-2 break-words text-lg font-medium">
                        {project.title}
                      </h4>

                    </div>

                    {project.featured && (
                      <span className="shrink-0 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/10 text-xs text-green-400">
                        Featured
                      </span>
                    )}

                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/40">
                    {project.description}
                  </p>

                  {/* TECHNOLOGIES */}

                  {Array.isArray(project.technologies) &&
                    project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">

                        {project.technologies.map(
                          (technology, index) => (
                            <span
                              key={`${technology}-${index}`}
                              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/40"
                            >
                              {technology}
                            </span>
                          )
                        )}

                      </div>
                    )}

                  {/* ACTIONS */}

                  <div className="mt-auto flex gap-3 pt-5">

                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      className="flex-1 py-2.5 rounded-xl border border-red-500/10 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default ProjectsAdmin;
