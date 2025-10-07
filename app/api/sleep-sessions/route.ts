import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession, getSessionFromRequest } from "../../../lib/auth";
import { CORS_HEADERS } from "../../../lib/cors";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req) || getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: CORS_HEADERS });
  const items = await prisma.sleepSession.findMany({ where: { uid: session.uid }, orderBy: { id: "desc" } });
  return new NextResponse(JSON.stringify({ items }), { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req) || getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: CORS_HEADERS });
  const { soundscape, duration, endedBy } = await req.json();
  const item = await prisma.sleepSession.create({ data: { uid: session.uid, soundscape, duration, endedBy } });
  return new NextResponse(JSON.stringify({ item }), { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}


