import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { CORS_HEADERS } from "../../../lib/cors";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  
  if (!phone || !code) {
    return new NextResponse(JSON.stringify({ error: "invalid" }), { 
      status: 400, 
      headers: CORS_HEADERS 
    });
  }

  const now = new Date();
  const record = await prisma.phoneOtp.findFirst({
    where: { 
      phone, 
      code, 
      expiresAt: { gt: now }, 
      consumedAt: null 
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return new NextResponse(JSON.stringify({ error: "invalid_code" }), { 
      status: 400, 
      headers: CORS_HEADERS 
    });
  }

  // 标记验证码为已使用
  await prisma.phoneOtp.update({ 
    where: { id: record.id }, 
    data: { consumedAt: now } 
  });

  // 查找或创建用户
  let user = await prisma.user.findUnique({ 
    where: { phone } 
  });
  
  if (!user) {
    user = await prisma.user.create({ 
      data: { phone } 
    });
  }

  // 生成 JWT token
  const token = jwt.sign(
    { uid: user.id, phone: user.phone }, 
    JWT_SECRET, 
    { expiresIn: "30d" }
  );

  const res = new NextResponse(JSON.stringify({ ok: true, token }), { 
    headers: CORS_HEADERS 
  });
  
  // 设置 cookie（用于 web 端）
  res.cookies.set({ 
    name: "auth", 
    value: token, 
    httpOnly: true, 
    secure: true, 
    sameSite: "lax", 
    path: "/" 
  });
  
  return res;
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}
