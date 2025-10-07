import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { CORS_HEADERS } from "@/app/lib/cors";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  if (!email || !code) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const now = new Date();
  const record = await prisma.emailOtp.findFirst({
    where: { email: email.toLowerCase(), code, expiresAt: { gt: now }, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return NextResponse.json({ error: "invalid_code" }, { status: 400 });

  await prisma.emailOtp.update({ where: { id: record.id }, data: { consumedAt: now } });

  let user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    user = await prisma.user.create({ data: { email: email.toLowerCase() } });
  }

  const token = jwt.sign({ uid: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
  const res = new NextResponse(JSON.stringify({ ok: true, token }), { headers: CORS_HEADERS });
  res.cookies.set({ name: "auth", value: token, httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  return res;
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}


