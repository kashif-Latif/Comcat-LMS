import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/subject-teachers - Get subject-teacher assignments
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assignments = await db.subjectTeacher.findMany({
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true, teacherId: true } },
      },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error("Error fetching subject teachers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/subject-teachers - Assign teacher to subject (admin only)
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

    const body = await req.json()
    const { subjectId, teacherId } = body

    if (!subjectId || !teacherId) {
      return NextResponse.json({ error: "Subject ID and Teacher ID are required" }, { status: 400 })
    }

    const assignment = await db.subjectTeacher.create({
      data: { subjectId, teacherId },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true, teacherId: true } },
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error("Error creating subject teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/subject-teachers - Remove teacher from subject (admin only)
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
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await db.subjectTeacher.delete({ where: { id } })
    return NextResponse.json({ message: "Assignment removed successfully" })
  } catch (error) {
    console.error("Error deleting subject teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
