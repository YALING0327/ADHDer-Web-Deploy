import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { CORS_HEADERS } from "../../../lib/cors";

// 这里使用阿里云短信服务的最低配置
// 实际使用时需要配置阿里云 AccessKey 和 SecretKey
const sendSmsCode = async (phone: string, code: string): Promise<boolean> => {
  try {
    // 开发环境直接返回成功，生产环境需要配置真实的短信服务
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] SMS Code for ${phone}: ${code}`);
      return true;
    }

    // 生产环境使用阿里云短信服务
    // 需要安装: npm install @alicloud/dysmsapi20170525
    // 配置环境变量: ALIBABA_CLOUD_ACCESS_KEY_ID, ALIBABA_CLOUD_ACCESS_KEY_SECRET
    
    // 示例代码（需要配置后启用）:
    /*
    const Dysmsapi20170525 = require('@alicloud/dysmsapi20170525');
    const { Config } = require('@alicloud/openapi-client');
    
    const config = new Config({
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
      endpoint: 'dysmsapi.aliyuncs.com',
    });
    
    const client = new Dysmsapi20170525.default(config);
    
    const sendSmsRequest = new Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phone,
      signName: 'ADHDer', // 需要在阿里云申请短信签名
      templateCode: 'SMS_123456789', // 需要在阿里云申请短信模板
      templateParam: JSON.stringify({ code }),
    });
    
    const response = await client.sendSms(sendSmsRequest);
    return response.body.code === 'OK';
    */
    
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
};

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  
  if (!phone || typeof phone !== "string") {
    return new NextResponse(JSON.stringify({ error: "invalid_phone" }), { 
      status: 400, 
      headers: CORS_HEADERS 
    });
  }

  // 验证手机号格式（中国大陆手机号）
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return new NextResponse(JSON.stringify({ error: "invalid_phone_format" }), { 
      status: 400, 
      headers: CORS_HEADERS 
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟过期

  // 保存验证码到数据库
  await prisma.phoneOtp.create({ 
    data: { 
      phone, 
      code, 
      expiresAt 
    } 
  });

  // 发送短信验证码
  const smsSent = await sendSmsCode(phone, code);
  
  if (!smsSent) {
    return new NextResponse(JSON.stringify({ error: "sms_send_failed" }), { 
      status: 500, 
      headers: CORS_HEADERS 
    });
  }

  return new NextResponse(JSON.stringify({ ok: true }), { 
    status: 200, 
    headers: CORS_HEADERS 
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}
