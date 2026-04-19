import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/teachers - List all teachers (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const teachers = await db.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        teacherId: true,
        designation: true,
        qualification: true,
        createdAt: true,
        _count: {
          select: {
            teacherSubjects: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/teachers - Create a teacher (admin only)
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
    const { email, password, name, phone, department, teacherId, designation, qualification } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    if (teacherId) {
      const existingId = await db.user.findFirst({ where: { teacherId } })
      if (existingId) {
        return NextResponse.json({ error: "Teacher ID already exists" }, { status: 409 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const teacher = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "TEACHER",
        phone,
        department,
        teacherId,
        designation,
        qualification,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        teacherId: true,
        designation: true,
        qualification: true,
        createdAt: true,
      },
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/teachers - Update a teacher (admin only)
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
    const { id, email, name, phone, department, teacherId, designation, qualification, password } = body

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (email) updateData.email = email
    if (name) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (department !== undefined) updateData.department = department
    if (teacherId !== undefined) updateData.teacherId = teacherId
    if (designation !== undefined) updateData.designation = designation
    if (qualification !== undefined) updateData.qualification = qualification
    if (password) updateData.password = await bcrypt.hash(password, 12)

    const teacher = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        teacherId: true,
        designation: true,
        qualification: true,
        createdAt: true,
      },
    })

    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Error updating teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/teachers - Delete a teacher (admin only)
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
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    await db.user.delete({ where: { id } })
    return NextResponse.json({ message: "Teacher deleted successfully" })
  } catch (error) {
    console.error("Error deleting teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
