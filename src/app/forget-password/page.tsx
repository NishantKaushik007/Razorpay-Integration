"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forget-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setOtpSent(true);
    } else {
      setError(data.error || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forget-password/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/login");
    } else {
      // Handle specific errors that require resetting the OTP flow
      if (data.error === "OTP expired. Please request a new one." || 
          data.error === "Too many attempts. Please request a new OTP.") {
        setOtpSent(false);
        setEmail(""); // Optional: clear email if you want them to start fresh
        // Trigger page reload to reset the state and show the error message
        window.location.reload();
      }
      setError(data.error || "Invalid OTP or password reset failed.");
    }
  };

  useEffect(() => {
    // If there's an error indicating OTP expiry or too many attempts, reload the page
    if (error && (error.includes("OTP expired") || error.includes("Too many attempts"))) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Forget Password</h1>
      {error && <p className="text-red-500">{error}</p>}

      {!otpSent ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending OTP..." : "Request OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}
