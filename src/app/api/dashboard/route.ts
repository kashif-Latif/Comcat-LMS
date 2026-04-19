import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/dashboard - Get dashboard stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as Record<string, unknown>).role as string
    const userId = (session.user as Record<string, unknown>).id as string

    if (role === "ADMIN") {
      const [
        totalStudents,
        totalTeachers,
        totalSubjects,
        totalAnnouncements,
        unreadMessages,
        recentAnnouncements,
      ] = await Promise.all([
        db.user.count({ where: { role: "STUDENT" } }),
        db.user.count({ where: { role: "TEACHER" } }),
        db.subject.count(),
        db.announcement.count({ where: { isPublished: true } }),
        db.contactMessage.count({ where: { isRead: false } }),
        db.announcement.findMany({
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { author: { select: { name: true } } },
        }),
      ])

      const departmentStats = await db.user.groupBy({
        by: ["department"],
        where: { role: "STUDENT", department: { not: null } },
        _count: { department: true },
      })

      return NextResponse.json({
        totalStudents,
        totalTeachers,
        totalSubjects,
        totalAnnouncements,
        unreadMessages,
        recentAnnouncements,
        departmentStats,
      })
    }

    if (role === "TEACHER") {
      const teacher = await db.user.findUnique({
        where: { id: userId },
        include: {
          teacherSubjects: {
            include: {
              subject: {
                include: {
                  _count: { select: { enrollments: true } },
                },
              },
            },
          },
        },
      })

      const assignedSubjects = teacher?.teacherSubjects.map((ts) => ({
        ...ts.subject,
        enrollmentCount: ts.subject._count.enrollments,
      })) || []

      let totalStudents = 0
      const subjectIds = assignedSubjects.map((s) => s.id)
      if (subjectIds.length > 0) {
        const enrollments = await db.enrollment.groupBy({
          by: ["subjectId"],
          where: { subjectId: { in: subjectIds } },
          _count: { studentId: true },
        })
        totalStudents = enrollments.reduce((sum, e) => sum + e._count.studentId, 0)
      }

      return NextResponse.json({
        teacher: {
          id: teacher?.id,
          name: teacher?.name,
          email: teacher?.email,
          department: teacher?.department,
          designation: teacher?.designation,
          qualification: teacher?.qualification,
          teacherId: teacher?.teacherId,
        },
        assignedSubjects,
        totalStudents,
      })
    }

    if (role === "STUDENT") {
      const student = await db.user.findUnique({
        where: { id: userId },
      })

      const enrollments = await db.enrollment.findMany({
        where: { studentId: userId },
        include: {
          subject: true,
        },
      })

      const attendanceRecords = await db.attendanceRecord.findMany({
        where: { studentId: userId },
      })

      const totalClasses = attendanceRecords.length
      const presentClasses = attendanceRecords.filter((a) => a.status === "PRESENT").length
      const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0

      const fees = await db.fee.findMany({
        where: { studentId: userId },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json({
        student: {
          id: student?.id,
          name: student?.name,
          email: student?.email,
          department: student?.department,
          semester: student?.semester,
          studentId: student?.studentId,
          enrollmentYear: student?.enrollmentYear,
          phone: student?.phone,
          dateOfBirth: student?.dateOfBirth,
        },
        enrollments: enrollments.map((e) => e.subject),
        attendanceStats: {
          totalClasses,
          presentClasses,
          absentClasses: attendanceRecords.filter((a) => a.status === "ABSENT").length,
          lateClasses: attendanceRecords.filter((a) => a.status === "LATE").length,
          attendancePercentage,
        },
        fees,
      })
    }

    return NextResponse.json({ error: "Unknown role" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
