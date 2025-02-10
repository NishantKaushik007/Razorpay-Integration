'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      // Check for email verification error
      if (
        res.status === 403 &&
        data.error === "Email not verified. Please verify your email."
      ) {
        router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
        return;
      }

      // Check for subscription expired error
      if (res.status === 403 && data.error.includes("Subscription expired")) {
        router.push("https://rzp.io/rzp/HA8MaWx");
        return;
      }

      if (!res.ok) throw new Error(data.error || "Login failed");
      
      // If the login response includes a token, store it in localStorage.
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Glow effects */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#6366f1]/20 rounded-full blur-[128px] animate-glow" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/20 rounded-full blur-[128px] animate-glow-delayed" />

      <div className="w-full max-w-md p-8 bg-[#1c1c1c]/50 rounded-2xl backdrop-blur-xl border border-zinc-800 relative z-10">
        {/* Logo */}
        <div className="w-8 h-8 mb-8 mx-auto">
          <svg viewBox="0 0 24 24" className="text-white w-full h-full">
            <path fill="currentColor" d="M12 2L1 12l11 10 11-10L12 2zm0 18.5L3 12l9-8.5 9 8.5-9 8.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-white text-center mb-8">Sign in to Job Lawn</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-zinc-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@work-email.com"
              required
              className="w-full h-12 px-4 py-2 rounded-md bg-[#2a2a2a]/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-zinc-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full h-12 px-4 py-2 rounded-md bg-[#2a2a2a]/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#f59e0b] text-white relative overflow-hidden h-12 transition-all duration-1000 ease-in-out hover:from-[#f59e0b] hover:to-[#6366f1]"
          >
            <span className="relative z-10">LOG IN</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/50 to-[#f59e0b]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          </Button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <Link href="/forget-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1c1c1c]/50 px-2 text-zinc-400">OR</span>
          </div>
        </div>

        {/* Sign Up Button */}
        <div className="mt-4 text-center">
          <Link href="/register" passHref>
            <Button className="w-full bg-gradient-to-r from-[#00b5ad] via-[#1e40af] to-[#6b21a8] text-white relative overflow-hidden h-12 transition-all duration-1000 ease-in-out hover:from-[#6b21a8] hover:via-[#00b5ad] hover:to-[#1e40af]">
              <span className="relative z-10">SIGN UP</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00b5ad]/50 via-[#1e40af]/50 to-[#6b21a8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="p-4 flex justify-center gap-6 mt-6">
          <Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Terms of Use
          </Link>
          <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Privacy policy
          </Link>
        </footer>
      </div>
    </div>
  );
}
