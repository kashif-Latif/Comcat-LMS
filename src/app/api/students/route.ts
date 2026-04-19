import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/students - List all students (admin/teacher)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string

    if (role !== "ADMIN" && role !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const department = searchParams.get("department")
    const semester = searchParams.get("semester")
    const subjectId = searchParams.get("subjectId")

    let where: Record<string, unknown> = { role: "STUDENT" }

    if (department) where.department = department
    if (semester) where.semester = parseInt(semester)

    const students = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        semester: true,
        enrollmentYear: true,
        studentId: true,
        dateOfBirth: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // If teacher and subjectId provided, filter to only enrolled students
    if (role === "TEACHER" && subjectId) {
      const enrollments = await db.enrollment.findMany({
        where: { subjectId },
        select: { studentId: true },
      })
      const enrolledIds = enrollments.map((e) => e.studentId)
      return NextResponse.json(students.filter((s) => enrolledIds.includes(s.id)))
    }

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/students - Create a student (admin only)
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
    const { email, password, name, phone, department, semester, enrollmentYear, studentId, dateOfBirth } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    if (studentId) {
      const existingId = await db.user.findFirst({ where: { studentId } })
      if (existingId) {
        return NextResponse.json({ error: "Student ID already exists" }, { status: 409 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const student = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "STUDENT",
        phone,
        department,
        semester,
        enrollmentYear,
        studentId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        semester: true,
        enrollmentYear: true,
        studentId: true,
        dateOfBirth: true,
        createdAt: true,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/students - Update a student (admin only)
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
    const { id, email, name, phone, department, semester, enrollmentYear, studentId, dateOfBirth, password } = body

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (email) updateData.email = email
    if (name) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (department !== undefined) updateData.department = department
    if (semester !== undefined) updateData.semester = semester
    if (enrollmentYear !== undefined) updateData.enrollmentYear = enrollmentYear
    if (studentId !== undefined) updateData.studentId = studentId
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null
    if (password) updateData.password = await bcrypt.hash(password, 12)

    const student = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        semester: true,
        enrollmentYear: true,
        studentId: true,
        dateOfBirth: true,
        createdAt: true,
      },
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/students - Delete a student (admin only)
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
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    await db.user.delete({ where: { id } })
    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
