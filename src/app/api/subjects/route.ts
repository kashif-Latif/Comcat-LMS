import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/subjects - List subjects
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    const userId = (session.user as Record<string, unknown>).id as string

    const subjects = await db.subject.findMany({
      include: {
        teachers: {
          include: {
            teacher: {
              select: { id: true, name: true, teacherId: true },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { code: "asc" },
    })

    // Students only see their enrolled subjects
    if (role === "STUDENT") {
      const enrollments = await db.enrollment.findMany({
        where: { studentId: userId },
        select: { subjectId: true },
      })
      const enrolledIds = enrollments.map((e) => e.subjectId)
      return NextResponse.json(subjects.filter((s) => enrolledIds.includes(s.id)))
    }

    // Teachers only see their assigned subjects
    if (role === "TEACHER") {
      const assignments = await db.subjectTeacher.findMany({
        where: { teacherId: userId },
        select: { subjectId: true },
      })
      const assignedIds = assignments.map((a) => a.subjectId)
      return NextResponse.json(subjects.filter((s) => assignedIds.includes(s.id)))
    }

    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/subjects - Create a subject (admin only)
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
    const { code, name, description, credits, semester, department, teacherIds } = body

    if (!code || !name) {
      return NextResponse.json({ error: "Code and name are required" }, { status: 400 })
    }

    const existing = await db.subject.findUnique({ where: { code } })
    if (existing) {
      return NextResponse.json({ error: "Subject code already exists" }, { status: 409 })
    }

    const subject = await db.subject.create({
      data: {
        code,
        name,
        description,
        credits: credits || 3,
        semester,
        department,
        teachers: teacherIds
          ? {
              create: teacherIds.map((teacherId: string) => ({ teacherId })),
            }
          : undefined,
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/subjects - Update a subject (admin only)
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
    const { id, code, name, description, credits, semester, department } = body

    if (!id) {
      return NextResponse.json({ error: "Subject ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (code) updateData.code = code
    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (credits !== undefined) updateData.credits = credits
    if (semester !== undefined) updateData.semester = semester
    if (department !== undefined) updateData.department = department

    const subject = await db.subject.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error("Error updating subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/subjects - Delete a subject (admin only)
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
      return NextResponse.json({ error: "Subject ID is required" }, { status: 400 })
    }

    await db.subject.delete({ where: { id } })
    return NextResponse.json({ message: "Subject deleted successfully" })
  } catch (error) {
    console.error("Error deleting subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
