import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/attendance - Get attendance records
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
    const studentId = searchParams.get("studentId")
    const date = searchParams.get("date")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    let where: Record<string, unknown> = {}

    // Students only see their own attendance
    if (role === "STUDENT") {
      where.studentId = userId
    } else if (role === "TEACHER") {
      // Teachers only see attendance for their subjects
      if (!subjectId) {
        return NextResponse.json({ error: "Subject ID required for teachers" }, { status: 400 })
      }
      const assignment = await db.subjectTeacher.findFirst({
        where: { teacherId: userId, subjectId },
      })
      if (!assignment) {
        return NextResponse.json({ error: "Not assigned to this subject" }, { status: 403 })
      }
      where.teacherId = userId
    }

    if (subjectId) where.subjectId = subjectId
    if (studentId && role !== "STUDENT") where.studentId = studentId
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      where.date = { gte: startDate, lte: endDate }
    }
    if (from && to) {
      where.date = {
        gte: new Date(from),
        lte: new Date(to),
      }
    }

    const records = await db.attendanceRecord.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true, studentId: true, department: true },
        },
        subject: {
          select: { id: true, name: true, code: true },
        },
        teacher: {
          select: { id: true, name: true },
        },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/attendance - Create attendance records (teacher only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    if (role !== "TEACHER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Only teachers can mark attendance" }, { status: 403 })
    }

    const body = await req.json()
    const { subjectId, date, records } = body

    if (!subjectId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Subject ID, date, and records are required" }, { status: 400 })
    }

    const userId = (session.user as Record<string, unknown>).id as string

    // Verify teacher is assigned to this subject
    if (role === "TEACHER") {
      const assignment = await db.subjectTeacher.findFirst({
        where: { teacherId: userId, subjectId },
      })
      if (!assignment) {
        return NextResponse.json({ error: "Not assigned to this subject" }, { status: 403 })
      }
    }

    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    const results = []

    for (const record of records) {
      const { studentId, status, remarks } = record

      // Upsert attendance record
      const result = await db.attendanceRecord.upsert({
        where: {
          studentId_subjectId_date: {
            studentId,
            subjectId,
            date: attendanceDate,
          },
        },
        create: {
          studentId,
          subjectId,
          teacherId: userId,
          date: attendanceDate,
          status: status || "PRESENT",
          remarks,
        },
        update: {
          status: status || "PRESENT",
          remarks,
          teacherId: userId,
        },
      })
      results.push(result)
    }

    return NextResponse.json(results, { status: 201 })
  } catch (error) {
    console.error("Error creating attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/attendance - Update attendance record (teacher only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    if (role !== "TEACHER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Only teachers can update attendance" }, { status: 403 })
    }

    const body = await req.json()
    const { id, status, remarks } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 })
    }

    const record = await db.attendanceRecord.update({
      where: { id },
      data: { status, remarks },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error("Error updating attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
