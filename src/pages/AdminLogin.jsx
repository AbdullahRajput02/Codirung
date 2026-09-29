import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../firebase/firebase";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Firebase Authentication login
      const credential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const user = credential.user;

      // Email verification check
      if (!user.emailVerified) {
        await signOut(auth);

        setError(
          "Please verify your email address before accessing the admin panel."
        );

        return;
      }

      // Check admin UID in Realtime Database
      const adminRef = ref(db, `admins/${user.uid}`);

      const adminSnapshot = await get(adminRef);

      // UID admin list mein nahi hai
      if (!adminSnapshot.exists() || adminSnapshot.val() !== true) {
        await signOut(auth);

        setError(
          "This account is not authorized to access the admin panel."
        );

        return;
      }

      // Login successful
      if (onLogin) {
        onLogin(user);
      }
    } catch (error) {
      console.error("Admin login error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (error.code === "auth/too-many-requests") {
        setError(
          "Too many login attempts. Please try again later."
        );
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
            Codirung
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Admin Login
          </h1>

          <p className="text-sm text-white/40 mt-3">
            Sign in to access the administration panel.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8 shadow-2xl shadow-black/20">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm text-white/60 mb-2"
              >
                Email Address
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/30 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm text-white/60 mb-2"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full h-12 rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/30 disabled:opacity-50"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-white text-black text-sm font-semibold transition hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Back to Website */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full mt-4 text-sm text-white/40 hover:text-white transition"
          >
            ← Back to website
          </button>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-white/20 mt-6">
          Authorized administrators only.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;