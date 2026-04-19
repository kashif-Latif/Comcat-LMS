import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// ─── GET: Fetch all admissions (admin use) ─────────────────
// Supports ?status=PENDING, ?status=ACCEPTED, etc.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')

    const where = status ? { status: status as string } : {}

    const admissions = await db.admission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(admissions)
  } catch (error) {
    console.error('Error fetching admissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admissions' },
      { status: 500 }
    )
  }
}

// ─── POST: Create new admission application ─────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      cnic,
      dateOfBirth,
      gender,
      program,
      previousDegree,
      previousInstitution,
      previousGPA,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !gender || !program) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, phone, gender, program' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    const existing = await db.admission.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      )
    }

    const admission = await db.admission.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        cnic: cnic?.trim() || null,
        dateOfBirth: dateOfBirth || null,
        gender,
        program,
        previousDegree: previousDegree?.trim() || null,
        previousInstitution: previousInstitution?.trim() || null,
        previousGPA: previousGPA?.trim() || null,
        status: 'PENDING',
      },
    })

    // TODO: Send confirmation email to applicant
    // TODO: Notify admissions team about new application

    return NextResponse.json(
      {
        success: true,
        admission: {
          id: admission.id,
          firstName: admission.firstName,
          lastName: admission.lastName,
          email: admission.email,
          program: admission.program,
          status: admission.status,
          createdAt: admission.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating admission:', error)
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}
