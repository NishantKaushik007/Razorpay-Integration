// src/lib/jwt.ts
import jwt, { JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

export interface MyJwtPayload extends JwtPayload {
  userId: string;
  deviceId: string;
  subscriptionExpires: string; // or Date, depending on how you store it
}

export function signJwt(payload: object, expiresIn: number = 2592000) {
  // expiresIn: 30 days in seconds (2592000)
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token: string): MyJwtPayload | null {
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "object" && decoded !== null && "subscriptionExpires" in decoded) {
      return decoded as MyJwtPayload;
    }
    return null;
  } catch (error) {
    return null;
  }
}
