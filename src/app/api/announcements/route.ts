import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/announcements - Get announcements (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    let where: Record<string, unknown> = { isPublished: true }

    if (category) where.category = category

    const announcements = await db.announcement.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: category ? undefined : 20,
    })

    return NextResponse.json(announcements)
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/announcements - Create announcement (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const userId = (session.user as Record<string, unknown>).id as string
    const body = await req.json()
    const { title, content, category, isPublished } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const announcement = await db.announcement.create({
      data: {
        title,
        content,
        category: category || "GENERAL",
        authorId: userId,
        isPublished: isPublished !== false,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    console.error("Error creating announcement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/announcements - Update announcement (admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { id, title, content, category, isPublished } = body

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (title) updateData.title = title
    if (content) updateData.content = content
    if (category) updateData.category = category
    if (isPublished !== undefined) updateData.isPublished = isPublished

    const announcement = await db.announcement.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error("Error updating announcement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/announcements - Delete announcement (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 })
    }

    await db.announcement.delete({ where: { id } })
    return NextResponse.json({ message: "Announcement deleted successfully" })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
