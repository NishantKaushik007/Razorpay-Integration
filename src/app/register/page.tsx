"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    mobile: "",
    countryCode: "",
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendMessage, setResendMessage] = useState("");
  const [timer, setTimer] = useState(120); // 120 seconds = 2 minutes
  const [timerActive, setTimerActive] = useState(false); // Determines if the timer is running

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResendMessage("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setOtpSent(true);
      setTimerActive(true); // Start the timer once OTP is sent
    } else {
      setError(data.error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, otp: otp.join("") }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResendMessage("");
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    const data = await res.json();
    if (res.ok) {
      setResendMessage("OTP resent successfully.");
      setTimer(120);        // Reset timer to 2 minutes
      setTimerActive(true); // Start the timer again
    } else {
      setError(data.error);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]{1}$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input if a valid number is entered
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Countdown timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false); // Timer has expired; disable timer
    }
    return () => {
      clearInterval(interval);
    };
  }, [timerActive, timer]);

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center p-4">
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#6366f1]/20 rounded-full blur-[128px] animate-glow" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/20 rounded-full blur-[128px] animate-glow-delayed" />

      <div className="w-full max-w-md p-8 bg-[#2a2a2a]/50 rounded-2xl backdrop-blur-xl border border-zinc-800 relative z-10">
        <h1 className="text-2xl font-semibold text-white text-center mb-8">Register</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {resendMessage && <p className="text-green-500 text-center mb-4">{resendMessage}</p>}

        {!otpSent ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-zinc-400">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 py-2 rounded-md bg-[#2a2a2a]/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
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
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 py-2 rounded-md bg-[#2a2a2a]/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <div className="w-2/7">
                <label htmlFor="countryCode" className="text-sm text-zinc-400">
                  Country Code
                </label>
                <input
                  id="countryCode"
                  type="text"
                  name="countryCode"
                  placeholder="+91"
                  value={form.countryCode}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 py-2 rounded-md bg-[#2a2a2a]/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-5/7">
                <label htmlFor="mobile" className="text-sm text-zinc-400">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 py-2 rounded-md bg-[#2a2a2a]/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#f59e0b] text-white hover:to-[#f59e0b] relative overflow-hidden h-12"
            >
              <span className="relative z-10">Register</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/50 to-[#f59e0b]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </Button>
          </form>
        ) : (
          <div>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    maxLength={1}
                    className="w-14 h-14 text-center text-white bg-[#2a2a2a] border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="-"
                  />
                ))}
              </div>

              {timerActive && (
                <p className="mt-4 text-center text-sm text-zinc-400">
                  OTP expires in {Math.floor(timer / 60)}:
                  {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#f59e0b] text-white hover:to-[#f59e0b] relative overflow-hidden h-12"
              >
                <span className="relative z-10">Verify OTP</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/50 to-[#f59e0b]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </Button>
            </form>
            <div className="mt-4">
              <Button
                onClick={handleResendOtp}
                disabled={timer > 0} // Disable button while timer is active
                className={`w-full ${
                  timer > 0
                    ? "text-blue-500 hover:bg-blue-50 border border-blue-500"
                    : "bg-gradient-to-r from-[#6366f1] to-[#f59e0b] text-white hover:to-[#f59e0b]"
                } relative overflow-hidden h-12`}
              >
                {timer > 0 ? "Resend OTP" : "Reset OTP"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
