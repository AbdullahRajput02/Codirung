import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../firebase/firebase";

import AdminLogin from "./AdminLogin";
import AdminLayout from "../components/AdminLayout";
import ProjectsAdmin from "../components/ProjectsAdmin";
import ContactMessagesAdmin from "../components/ContactMessagesAdmin";

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setCheckingAuth(true);
        setError("");

        // User login nahi hai
        if (!currentUser) {
          setUser(null);
          setCheckingAuth(false);
          return;
        }

        // Email verified nahi hai
        if (!currentUser.emailVerified) {
          await signOut(auth);

          setUser(null);
          setError(
            "Please verify your email address before accessing the admin panel."
          );

          setCheckingAuth(false);
          return;
        }

        // RTDB mein admin UID check
        const adminRef = ref(db, `admins/${currentUser.uid}`);
        const adminSnapshot = await get(adminRef);

        // Admin authorized nahi hai
        if (!adminSnapshot.exists() || adminSnapshot.val() !== true) {
          await signOut(auth);

          setUser(null);
          setError(
            "This account is not authorized to access the admin panel."
          );

          setCheckingAuth(false);
          return;
        }

        // Admin authorized
        setUser(currentUser);
        setCheckingAuth(false);
      } catch (error) {
        console.error("Admin authentication error:", error);

        try {
          await signOut(auth);
        } catch (logoutError) {
          console.error("Logout error:", logoutError);
        }

        setUser(null);
        setError("Something went wrong while checking admin access.");
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // --------------------------------
  // AUTH CHECKING
  // --------------------------------

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-sm text-white/50">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // NOT LOGGED IN
  // --------------------------------

  if (!user) {
    return (
      <AdminLogin
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          setError("");
        }}
      />
    );
  }

  // --------------------------------
  // DASHBOARD
  // --------------------------------

  const Dashboard = () => {
    return (
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-3">
            Overview
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Welcome back 👋
          </h2>

          <p className="text-white/40 mt-3 max-w-2xl">
            Manage your Codirung website, projects and incoming client
            messages from one place.
          </p>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Projects */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-white/40">
                  Projects
                </p>

                <p className="text-3xl font-semibold mt-3">
                  —
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                ▣
              </div>

            </div>

            <p className="text-xs text-white/25 mt-5">
              Project management coming next
            </p>

          </div>

          {/* Messages */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-white/40">
                  Messages
                </p>

                <p className="text-3xl font-semibold mt-3">
                  —
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                ✉
              </div>

            </div>

            <p className="text-xs text-white/25 mt-5">
              Contact messages coming next
            </p>

          </div>

          {/* Admin */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-white/40">
                  Admin Status
                </p>

                <p className="text-lg font-semibold mt-4 text-green-400">
                  Authorized
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/10 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>

            </div>

            <p className="text-xs text-white/25 mt-5">
              Secure admin account
            </p>

          </div>

          {/* Database */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-white/40">
                  Database
                </p>

                <p className="text-lg font-semibold mt-4">
                  Realtime DB
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                ◈
              </div>

            </div>

            <p className="text-xs text-white/25 mt-5">
              Firebase Realtime Database
            </p>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

            <div className="mb-6">

              <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                Quick Actions
              </p>

              <h3 className="text-xl font-medium">
                Manage Codirung
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Projects */}
              <button
                onClick={() => setActivePage("projects")}
                className="group text-left rounded-2xl border border-white/10 bg-black/20 p-5 hover:bg-white/[0.05] transition"
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    ▣
                  </div>

                  <span className="text-white/20 group-hover:text-white transition">
                    →
                  </span>

                </div>

                <h4 className="font-medium mt-5">
                  Manage Projects
                </h4>

                <p className="text-sm text-white/35 mt-2">
                  Add, edit and remove featured projects.
                </p>

              </button>

              {/* Messages */}
              <button
                onClick={() => setActivePage("messages")}
                className="group text-left rounded-2xl border border-white/10 bg-black/20 p-5 hover:bg-white/[0.05] transition"
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    ✉
                  </div>

                  <span className="text-white/20 group-hover:text-white transition">
                    →
                  </span>

                </div>

                <h4 className="font-medium mt-5">
                  Contact Messages
                </h4>

                <p className="text-sm text-white/35 mt-2">
                  View messages submitted by potential clients.
                </p>

              </button>

            </div>

          </div>

        </div>

        {/* Admin Information */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

          <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4">
            Account
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm text-white/40">
                Logged in as
              </p>

              <p className="mt-2 text-sm font-medium break-all">
                {user.email}
              </p>

            </div>

            <div>

              <p className="text-sm text-white/40">
                Email Verification
              </p>

              <p className="mt-2 text-sm font-medium text-green-400">
                Verified
              </p>

            </div>

            <div>

              <p className="text-sm text-white/40">
                Access
              </p>

              <p className="mt-2 text-sm font-medium text-green-400">
                Administrator
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  };

  // --------------------------------
  // PLACEHOLDER PAGES
  // --------------------------------

  const PlaceholderPage = ({ title, description }) => {
    return (
      <div className="max-w-7xl mx-auto">

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">

          <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-3">
            Codirung Admin
          </p>

          <h2 className="text-3xl font-semibold">
            {title}
          </h2>

          <p className="text-white/40 mt-3 max-w-xl leading-7">
            {description}
          </p>

          <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-8 text-center">

            <p className="text-sm text-white/30">
              This section will be built in the next step.
            </p>

          </div>

        </div>

      </div>
    );
  };

  // --------------------------------
  // PAGE CONTENT
  // --------------------------------

 const renderPage = () => {
  switch (activePage) {
    case "dashboard":
      return <Dashboard />;

    case "projects":
      return <ProjectsAdmin />;

    case "messages":
      return <ContactMessagesAdmin />;

    default:
      return <Dashboard />;
  }
};

  // --------------------------------
  // AUTHORIZED ADMIN LAYOUT
  // --------------------------------

  return (
    <AdminLayout
      user={user}
      activePage={activePage}
      setActivePage={setActivePage}
    >
      {renderPage()}
    </AdminLayout>
  );
}

export default AdminPanel;