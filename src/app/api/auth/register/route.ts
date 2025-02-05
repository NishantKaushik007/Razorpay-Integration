// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/lib/UserModel";
import { registerSchema } from "@/utils/validators";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);
    await dbConnect();

    // Check for existing user by email, mobile, or username
    const existingUser = await User.findOne({
      $or: [
        { email: parsed.email },
        { mobile: parsed.mobile },
      ]
    });
    
    if (existingUser) {
      let errorMsg = "";
      if (existingUser.email === parsed.email) {
        errorMsg = "Email already exists";
      } else if (existingUser.mobile === parsed.mobile) {
        errorMsg = "Mobile number already exists";
      } 
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Hash the password and generate OTP
    const hashedPassword = await bcrypt.hash(parsed.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Create a new user with the username field included
    await User.create({
      username: parsed.username,
      email: parsed.email,
      password: hashedPassword,
      mobile: parsed.mobile,
      countryCode: parsed.countryCode,
      otp,
      otpExpires,
      otpAttempts: 0,
    });

    // Send the OTP via email
    await resend.emails.send({
      from: "no-reply@yourdomain.com",
      to: parsed.email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 60 minutes.</p>`
    });

    return NextResponse.json({
      message: "User registered. Please verify your email with the OTP sent."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
