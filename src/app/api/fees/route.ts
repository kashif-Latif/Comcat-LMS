import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/fees - Get fee records
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    const userId = (session.user as Record<string, unknown>).id as string
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get("studentId")

    let where: Record<string, unknown> = {}

    // Students only see their own fees
    if (role === "STUDENT") {
      where.studentId = userId
    } else if (role === "TEACHER") {
      return NextResponse.json({ error: "Teachers cannot access fee records" }, { status: 403 })
    }

    if (studentId && role === "ADMIN") {
      where.studentId = studentId
    }

    const fees = await db.fee.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true, studentId: true, department: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(fees)
  } catch (error) {
    console.error("Error fetching fees:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/fees - Create fee record (admin only)
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
    const { studentId, semester, amount, status, dueDate, description } = body

    if (!studentId || !amount || !semester) {
      return NextResponse.json({ error: "Student ID, amount, and semester are required" }, { status: 400 })
    }

    const fee = await db.fee.create({
      data: {
        studentId,
        semester,
        amount: parseFloat(amount),
        status: status || "PENDING",
        dueDate: dueDate ? new Date(dueDate) : null,
        description,
      },
    })

    return NextResponse.json(fee, { status: 201 })
  } catch (error) {
    console.error("Error creating fee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/fees - Update fee record (admin only)
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
    const { id, status, paidAmount, paidDate } = body

    if (!id) {
      return NextResponse.json({ error: "Fee ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (paidAmount !== undefined) updateData.paidAmount = parseFloat(paidAmount)
    if (paidDate) updateData.paidDate = new Date(paidDate)

    const fee = await db.fee.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(fee)
  } catch (error) {
    console.error("Error updating fee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
