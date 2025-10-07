import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession, getSessionFromRequest } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req) || getSession();
  const { name, data } = await req.json();
  if (!name) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const item = await prisma.event.create({ data: { uid: session?.uid ?? null, name, data } });
  return NextResponse.json({ ok: true, id: item.id });
}


