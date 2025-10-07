import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession, getSessionFromRequest } from "../../../lib/auth";
import { CORS_HEADERS } from "../../../lib/cors";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req) || getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tasks = await prisma.task.findMany({ where: { uid: session.uid }, orderBy: { createdAt: "desc" } });
  return new NextResponse(JSON.stringify({ tasks }), { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req) || getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { title, type, due } = await req.json();
  if (!title || (type !== "free" && type !== "ddl")) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const task = await prisma.task.create({
    data: { uid: session.uid, title, type, due: due ? new Date(due) : undefined },
  });
  return new NextResponse(JSON.stringify({ task }), { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}


