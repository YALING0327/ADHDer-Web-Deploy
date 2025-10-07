import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession, getSessionFromRequest } from "../../../lib/auth";
import { CORS_HEADERS } from "../../../lib/cors";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req) || getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: CORS_HEADERS });
  const items = await prisma.focusSession.findMany({ where: { uid: session.uid }, orderBy: { start: "desc" } });
  return new NextResponse(JSON.stringify({ items }), { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req) || getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: CORS_HEADERS });
  const { mode, start, end, interrupts, notes } = await req.json();
  const item = await prisma.focusSession.create({
    data: { uid: session.uid, mode, start: start ? new Date(start) : undefined, end: end ? new Date(end) : undefined, interrupts: interrupts ?? 0, notes },
  });
  return new NextResponse(JSON.stringify({ item }), { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}


