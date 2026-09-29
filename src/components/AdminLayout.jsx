import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function AdminLayout({ user, activePage, setActivePage, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "projects",
      label: "Projects",
      icon: "▣",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "✉",
    },
  ];

  const handlePageChange = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/admin";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-72
          border-r border-white/10
          bg-[#080808]
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-white/10">

          <div>
            <p className="text-lg font-semibold tracking-tight">
              Codirung
            </p>

            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto lg:hidden w-9 h-9 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition"
          >
            ×
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">

          <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.25em] text-white/25">
            Management
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => {
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`
                    w-full
                    flex items-center gap-3
                    px-4 py-3
                    rounded-xl
                    text-sm
                    transition
                    ${
                      isActive
                        ? "bg-white text-black"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }
                  `}
                >

                  <span
                    className={`
                      w-6
                      text-center
                      text-base
                      ${
                        isActive
                          ? "text-black"
                          : "text-white/40"
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>

                </button>
              );
            })}

          </div>

        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">

          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium truncate">
                  Administrator
                </p>

                <p className="text-xs text-white/30 truncate">
                  {user?.email}
                </p>

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-4 py-2.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/5 transition"
            >
              Logout
            </button>

          </div>

        </div>

      </aside>

      {/* Main Area */}
      <div className="lg:pl-72 min-h-screen">

        {/* Top Header */}
        <header className="h-20 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-30">

          <div className="h-full px-5 md:px-8 flex items-center justify-between">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              ☰
            </button>

            {/* Page Title */}
            <div className="hidden lg:block">

              <p className="text-xs text-white/30 uppercase tracking-[0.2em]">
                Admin
              </p>

              <h1 className="text-lg font-medium mt-1">
                {activePage === "dashboard" && "Dashboard"}
                {activePage === "projects" && "Projects"}
                {activePage === "messages" && "Messages"}
              </h1>

            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 ml-auto">

              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-green-500/10 bg-green-500/[0.04]">

                <span className="w-2 h-2 rounded-full bg-green-400"></span>

                <span className="text-xs text-green-400">
                  Admin Online
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="p-5 md:p-8 lg:p-10">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;