import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Resend } from "resend";
import { CORS_HEADERS } from "@/app/lib/cors";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return new NextResponse(JSON.stringify({ error: "invalid_email" }), { status: 400, headers: CORS_HEADERS });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await prisma.emailOtp.create({ data: { email: email.toLowerCase(), code, expiresAt } });

  if (!process.env.RESEND_API_KEY) {
    return new NextResponse(JSON.stringify({ ok: true, code }), { status: 200, headers: CORS_HEADERS });
  }

  await resend.emails.send({
    from: "ADHDer <login@adhder.app>",
    to: email,
    subject: "Your ADHDer code",
    text: `Your login code is ${code}. It expires in 10 minutes.`
  });

  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}


