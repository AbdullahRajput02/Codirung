import { useEffect, useState } from "react";
import { onValue, ref, remove, update } from "firebase/database";
import { db } from "../firebase/firebase";

function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // -----------------------------------------
  // LOAD CONTACT MESSAGES
  // -----------------------------------------

  useEffect(() => {
    const messagesRef = ref(db, "contactMessages");

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val() || {};

        const messageList = Object.entries(data)
          .map(([id, message]) => ({
            id,
            ...message,
          }))
          .sort(
            (a, b) =>
              Number(b.createdAt || 0) -
              Number(a.createdAt || 0)
          );

        setMessages(messageList);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error(
          "Contact messages loading error:",
          firebaseError
        );

        setError("Unable to load contact messages.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // -----------------------------------------
  // FORMAT DATE
  // -----------------------------------------

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Unknown date";
    }

    const date = new Date(Number(timestamp));

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleString();
  };

  // -----------------------------------------
  // UPDATE MESSAGE STATUS
  // -----------------------------------------

  const updateMessageStatus = async (message, status) => {
    try {
      setUpdatingId(message.id);
      setError("");

      await update(
        ref(db, `contactMessages/${message.id}`),
        {
          status,
          updatedAt: Date.now(),
        }
      );

      setSelectedMessage((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          status,
          updatedAt: Date.now(),
        };
      });
    } catch (firebaseError) {
      console.error(
        "Message status update error:",
        firebaseError
      );

      setError(
        "Unable to update message status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // -----------------------------------------
  // DELETE MESSAGE
  // -----------------------------------------

  const deleteMessage = async (message) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the message from ${
        message.name || "this client"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(message.id);
      setError("");

      await remove(
        ref(db, `contactMessages/${message.id}`)
      );

      if (selectedMessage?.id === message.id) {
        setSelectedMessage(null);
      }
    } catch (firebaseError) {
      console.error(
        "Message delete error:",
        firebaseError
      );

      setError(
        "Unable to delete this message."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // -----------------------------------------
  // STATUS STYLE
  // -----------------------------------------

  const getStatusStyle = (status) => {
    if (status === "read") {
      return "bg-blue-500/10 border-blue-500/10 text-blue-400";
    }

    if (status === "replied") {
      return "bg-green-500/10 border-green-500/10 text-green-400";
    }

    if (status === "archived") {
      return "bg-white/5 border-white/10 text-white/40";
    }

    return "bg-yellow-500/10 border-yellow-500/10 text-yellow-400";
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
              Loading messages...
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="mb-8">

        <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-3">
          Client Communication
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>

            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Contact Messages
            </h2>

            <p className="text-white/40 mt-3 max-w-2xl">
              View and manage messages submitted through the
              Codirung contact form.
            </p>

          </div>

          <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/50">
            {messages.length}{" "}
            {messages.length === 1
              ? "Message"
              : "Messages"}
          </div>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* ERROR */}
      {/* -------------------------------- */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

          <p className="text-sm text-red-400">
            {error}
          </p>

        </div>
      )}

      {/* -------------------------------- */}
      {/* EMPTY STATE */}
      {/* -------------------------------- */}

      {messages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">

          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <span className="text-xl text-white/30">
              ✉
            </span>
          </div>

          <h3 className="text-lg font-medium">
            No messages yet
          </h3>

          <p className="text-sm text-white/30 mt-2">
            Client messages submitted through the website
            will appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {messages.map((message) => (

            <div
              key={message.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 hover:bg-white/[0.04] transition"
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                {/* LEFT */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="text-lg font-medium">
                      {message.name || "Unknown Client"}
                    </h3>

                    <span
                      className={`
                        px-2.5 py-1
                        rounded-lg
                        border
                        text-xs
                        capitalize
                        ${getStatusStyle(
                          message.status
                        )}
                      `}
                    >
                      {message.status || "new"}
                    </span>

                  </div>

                  {/* EMAIL */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">

                    {message.email && (
                      <a
                        href={`mailto:${message.email}`}
                        className="text-sm text-white/40 hover:text-white transition break-all"
                      >
                        {message.email}
                      </a>
                    )}

                    {message.company && (
                      <span className="text-sm text-white/30">
                        {message.company}
                      </span>
                    )}

                  </div>

                  {/* SERVICE / BUDGET */}
                  <div className="flex flex-wrap gap-2 mt-4">

                    {message.service && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/40">
                        {message.service}
                      </span>
                    )}

                    {message.budget && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/40">
                        {message.budget}
                      </span>
                    )}

                  </div>

                  {/* MESSAGE PREVIEW */}
                  <p className="text-sm text-white/40 leading-6 mt-4 line-clamp-2">
                    {message.message ||
                      "No message content."}
                  </p>

                  {/* DATE */}
                  <p className="text-xs text-white/20 mt-4">
                    {formatDate(message.createdAt)}
                  </p>

                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedMessage(message)
                    }
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
                  >
                    View
                  </button>

                  {message.status !== "read" && (
                    <button
                      type="button"
                      disabled={
                        updatingId === message.id
                      }
                      onClick={() =>
                        updateMessageStatus(
                          message,
                          "read"
                        )
                      }
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition disabled:opacity-50"
                    >
                      {updatingId === message.id
                        ? "Updating..."
                        : "Mark Read"}
                    </button>
                  )}

                  {message.status !== "replied" && (
                    <button
                      type="button"
                      disabled={
                        updatingId === message.id
                      }
                      onClick={() =>
                        updateMessageStatus(
                          message,
                          "replied"
                        )
                      }
                      className="px-4 py-2.5 rounded-xl border border-green-500/10 text-sm text-green-400 hover:bg-green-500/10 transition disabled:opacity-50"
                    >
                      Mark Replied
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={
                      deletingId === message.id
                    }
                    onClick={() =>
                      deleteMessage(message)
                    }
                    className="px-4 py-2.5 rounded-xl border border-red-500/10 text-sm text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                  >
                    {deletingId === message.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* -------------------------------- */}
      {/* MESSAGE MODAL */}
      {/* -------------------------------- */}

      {selectedMessage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() =>
            setSelectedMessage(null)
          }
        >

          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between gap-5 p-6 border-b border-white/10">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                  Client Message
                </p>

                <h3 className="text-2xl font-semibold">
                  {selectedMessage.name ||
                    "Unknown Client"}
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="w-9 h-9 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition"
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="p-6 space-y-6">

              {/* CONTACT INFO */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                  <p className="text-xs text-white/30 mb-2">
                    Email
                  </p>

                  {selectedMessage.email ? (
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sm text-white/70 hover:text-white break-all"
                    >
                      {selectedMessage.email}
                    </a>
                  ) : (
                    <p className="text-sm text-white/30">
                      Not provided
                    </p>
                  )}

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                  <p className="text-xs text-white/30 mb-2">
                    Company
                  </p>

                  <p className="text-sm text-white/70">
                    {selectedMessage.company ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                  <p className="text-xs text-white/30 mb-2">
                    Service
                  </p>

                  <p className="text-sm text-white/70">
                    {selectedMessage.service ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                  <p className="text-xs text-white/30 mb-2">
                    Budget
                  </p>

                  <p className="text-sm text-white/70">
                    {selectedMessage.budget ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div>

                <p className="text-xs text-white/30 mb-3">
                  Status
                </p>

                <div className="flex flex-wrap gap-2">

                  {[
                    "new",
                    "read",
                    "replied",
                    "archived",
                  ].map((status) => (

                    <button
                      key={status}
                      type="button"
                      disabled={
                        updatingId ===
                        selectedMessage.id
                      }
                      onClick={() =>
                        updateMessageStatus(
                          selectedMessage,
                          status
                        )
                      }
                      className={`
                        px-4 py-2
                        rounded-xl
                        border
                        text-xs
                        capitalize
                        transition
                        ${
                          selectedMessage.status ===
                          status
                            ? getStatusStyle(status)
                            : "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      {status}
                    </button>

                  ))}

                </div>

              </div>

              {/* MESSAGE */}

              <div>

                <p className="text-xs text-white/30 mb-3">
                  Message
                </p>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                  <p className="text-sm text-white/60 leading-7 whitespace-pre-wrap">
                    {selectedMessage.message ||
                      "No message content."}
                  </p>

                </div>

              </div>

              {/* DATE */}

              <div className="text-xs text-white/25">
                Received:{" "}
                {formatDate(
                  selectedMessage.createdAt
                )}
              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">

              {selectedMessage.email && (
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex-1 text-center px-5 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition"
                >
                  Reply via Email
                </a>
              )}

              <button
                type="button"
                onClick={() =>
                  deleteMessage(selectedMessage)
                }
                disabled={
                  deletingId ===
                  selectedMessage.id
                }
                className="px-5 py-3 rounded-xl border border-red-500/10 text-sm text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
              >
                {deletingId === selectedMessage.id
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default ContactMessagesAdmin;