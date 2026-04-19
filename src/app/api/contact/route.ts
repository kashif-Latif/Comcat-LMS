import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/contact - Get contact messages (admin only via session)
export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/contact - Submit contact form (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const contactMessage = await db.contactMessage.create({
      data: { name, email, subject, message },
    })

    return NextResponse.json(contactMessage, { status: 201 })
  } catch (error) {
    console.error("Error creating contact message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/contact - Update contact message (mark as read, etc.)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, isRead } = body

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (isRead !== undefined) updateData.isRead = isRead

    const updatedMessage = await db.contactMessage.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error("Error updating contact message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
