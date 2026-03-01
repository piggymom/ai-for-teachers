import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Log contact submissions (dev only — contains PII)
  if (process.env.NODE_ENV !== "production") {
    console.log("=== SUPPORT CONTACT ===");
    console.log("From:", name, `<${email}>`);
    console.log("User ID:", session?.user?.id || "Not logged in");
    console.log("Message:", message);
    console.log("=======================");
  }

  // Send email via Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "AI for Teachers <noreply@aiforteachers.com>",
          to: process.env.SUPPORT_EMAIL || "support@aiforteachers.com",
          subject: `[Support] Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nUser ID: ${session?.user?.id || "Not logged in"}\n\nMessage:\n${message}`
        })
      });
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  }

  return NextResponse.json({ success: true });
}
