"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/forget-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      setOtpSent(true);
    } else {
      setError(data.error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/forget-password/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/login");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Forget Password</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!otpSent ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required className="input" />
          <Button type="submit">Request OTP</Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required className="input" />
          <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} required className="input" />
          <Button type="submit">Reset Password</Button>
        </form>
      )}
    </div>
  );
}
