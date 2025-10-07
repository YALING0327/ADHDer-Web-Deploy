import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface Session {
  uid: string;
  email?: string;
  phone?: string;
}

export function getSession(): Session | null {
  const cookieStore = cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as Session;
    return payload;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): Session | null {
  // Prefer Authorization: Bearer <token>
  const auth = req.headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7);
    try {
      return jwt.verify(token, JWT_SECRET) as Session;
    } catch {
      // fallthrough to cookie
    }
  }
  // Fallback to cookie (web)
  const cookie = req.headers.get("cookie") || cookies().get("auth")?.value;
  if (!cookie) return null;
  const token = (cookie.includes("auth=") ? cookie.split("auth=")[1]?.split(";")[0] : cookie) || "";
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as Session;
  } catch {
    return null;
  }
}


