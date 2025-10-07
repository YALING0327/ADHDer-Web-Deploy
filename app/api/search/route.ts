import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession, getSessionFromRequest } from "../../../lib/auth";
import { CORS_HEADERS } from "../../../lib/cors";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req) || getSession();
  if (!session) return new NextResponse(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: CORS_HEADERS });
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return new NextResponse(JSON.stringify({ tasks: [], ideas: [] }), { headers: CORS_HEADERS });
  const [tasks, ideas] = await Promise.all([
    prisma.task.findMany({ where: { uid: session.uid, title: { contains: q, mode: "insensitive" } }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.idea.findMany({ where: { uid: session.uid, text: { contains: q, mode: "insensitive" } }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  return new NextResponse(JSON.stringify({ tasks, ideas }), { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}


