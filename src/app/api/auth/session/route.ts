// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/lib/UserModel";
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ session: null });
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ session: null });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.currentDevice !== decoded.deviceId) {
      return NextResponse.json({ session: null });
    }

    return NextResponse.json({
      session: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          subscriptionExpires: user.subscriptionExpires,
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ session: null });
  }
}
