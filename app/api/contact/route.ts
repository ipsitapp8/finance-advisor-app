import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form fields", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = result.data;

    // Save message to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    return NextResponse.json(
      { success: true, message: "Message submitted successfully", id: contactMessage.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to submit message. Internal Server Error." },
      { status: 500 }
    );
  }
}
