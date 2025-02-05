import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/lib/UserModel";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1000);
    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    user.resetOtpAttempts = 0;
    await user.save();

    await resend.emails.send({
      from: "no-reply@yourdomain.com",
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your password reset OTP is <strong>${otp}</strong>. It expires in 60 minutes.</p>`
    });

    return NextResponse.json({ message: "Password reset OTP sent" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
