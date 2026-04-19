import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/enrollments - Get enrollments
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    const userId = (session.user as Record<string, unknown>).id as string
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get("subjectId")

    let where: Record<string, unknown> = {}

    if (role === "STUDENT") {
      where.studentId = userId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    const enrollments = await db.enrollment.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true, studentId: true, department: true, semester: true },
        },
        subject: {
          select: { id: true, name: true, code: true, credits: true },
        },
      },
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/enrollments - Create enrollment (admin only)
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
    const { studentId, subjectId, grade } = body

    if (!studentId || !subjectId) {
      return NextResponse.json({ error: "Student ID and Subject ID are required" }, { status: 400 })
    }

    const enrollment = await db.enrollment.upsert({
      where: {
        studentId_subjectId: { studentId, subjectId },
      },
      create: { studentId, subjectId, grade },
      update: grade !== undefined ? { grade } : {},
      include: {
        student: { select: { id: true, name: true, studentId: true } },
        subject: { select: { id: true, name: true, code: true } },
      },
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error("Error creating enrollment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/enrollments - Delete enrollment (admin only)
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
    const studentId = searchParams.get("studentId")
    const subjectId = searchParams.get("subjectId")

    if (id) {
      await db.enrollment.delete({ where: { id } })
    } else if (studentId && subjectId) {
      await db.enrollment.delete({
        where: { studentId_subjectId: { studentId, subjectId } },
      })
    } else {
      return NextResponse.json({ error: "ID or studentId+subjectId required" }, { status: 400 })
    }

    return NextResponse.json({ message: "Enrollment deleted successfully" })
  } catch (error) {
    console.error("Error deleting enrollment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
