import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.contactMessage.deleteMany()
  await prisma.attendanceRecord.deleteMany()
  await prisma.fee.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.subjectTeacher.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.user.deleteMany()

  const hashedAdminPassword = await bcrypt.hash('admin123', 12)
  const hashedTeacherPassword = await bcrypt.hash('teacher123', 12)
  const hashedStudentPassword = await bcrypt.hash('student123', 12)

  // ════════════════════════════════════════════
  // 1. ADMIN — Muhammad Kashif Latif
  // ════════════════════════════════════════════
  const admin = await prisma.user.create({
    data: {
      email: 'admin@comcat.edu.pk',
      password: hashedAdminPassword,
      name: 'Muhammad Kashif Latif',
      role: 'ADMIN',
      phone: '+92 314 4253900',
      address: '345#, Hamdard Chowk, near Arfa Tower, Lahore',
    },
  })

  // ════════════════════════════════════════════
  // 2. TEACHERS — 10 Teachers across all departments
  // ════════════════════════════════════════════
  const teachersData = [
    {
      email: 'prof.qasim@comcat.edu.pk',
      name: 'Prof. Qasim Ali',
      phone: '+92 300 1234567',
      department: 'Computer Science',
      teacherId: 'T001',
      designation: 'Associate Professor & HOD',
      qualification: 'Ph.D. Computer Science — NUST',
    },
    {
      email: 'dr.sarah@comcat.edu.pk',
      name: 'Dr. Sarah Ahmed',
      phone: '+92 301 2345678',
      department: 'Information Technology',
      teacherId: 'T002',
      designation: 'Professor & HOD',
      qualification: 'Ph.D. Information Technology — LUMS',
    },
    {
      email: 'prof.bilal@comcat.edu.pk',
      name: 'Prof. Bilal Hassan',
      phone: '+92 302 3456789',
      department: 'Data Science',
      teacherId: 'T003',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. Data Science — UET Lahore',
    },
    {
      email: 'dr.aiman@comcat.edu.pk',
      name: 'Dr. Aiman Fatima',
      phone: '+92 303 4567890',
      department: 'Software Engineering',
      teacherId: 'T004',
      designation: 'Associate Professor',
      qualification: 'Ph.D. Software Engineering — FAST NUCES',
    },
    {
      email: 'prof.kamran@comcat.edu.pk',
      name: 'Prof. Kamran Raza',
      phone: '+92 304 5678901',
      department: 'Computer Science',
      teacherId: 'T005',
      designation: 'Professor',
      qualification: 'Ph.D. Artificial Intelligence — KAIST, Korea',
    },
    {
      email: 'dr.nida@comcat.edu.pk',
      name: 'Dr. Nida Hussain',
      phone: '+92 305 6789012',
      department: 'Cyber Security',
      teacherId: 'T006',
      designation: 'Assistant Professor & HOD',
      qualification: 'Ph.D. Cyber Security — University of Cambridge, UK',
    },
    {
      email: 'prof.imran@comcat.edu.pk',
      name: 'Prof. Imran Ashraf',
      phone: '+92 306 7890123',
      department: 'Mathematics',
      teacherId: 'T007',
      designation: 'Professor',
      qualification: 'Ph.D. Applied Mathematics — Punjab University',
    },
    {
      email: 'dr.sobia@comcat.edu.pk',
      name: 'Dr. Sobia Kiran',
      phone: '+92 307 8901234',
      department: 'Information Technology',
      teacherId: 'T008',
      designation: 'Associate Professor',
      qualification: 'Ph.D. Cloud Computing — University of Melbourne',
    },
    {
      email: 'prof.talha@comcat.edu.pk',
      name: 'Prof. Talha Mahmood',
      phone: '+92 308 9012345',
      department: 'Computer Science',
      teacherId: 'T009',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. Machine Learning — TU Munich, Germany',
    },
    {
      email: 'dr.zunaira@comcat.edu.pk',
      name: 'Dr. Zunaira Noor',
      phone: '+92 309 0123456',
      department: 'Data Science',
      teacherId: 'T010',
      designation: 'Lecturer',
      qualification: 'M.S. Data Science — GIKI',
    },
  ]

  const teachers: typeof admin[] = []
  for (const t of teachersData) {
    const teacher = await prisma.user.create({
      data: {
        email: t.email,
        password: hashedTeacherPassword,
        name: t.name,
        role: 'TEACHER',
        phone: t.phone,
        department: t.department,
        teacherId: t.teacherId,
        designation: t.designation,
        qualification: t.qualification,
      },
    })
    teachers.push(teacher)
  }

  // ════════════════════════════════════════════
  // 3. SUBJECTS — 12 Subjects across departments
  // ════════════════════════════════════════════
  const subjectsData = [
    {
      code: 'CS101', name: 'Introduction to Programming', description: 'Fundamentals of programming using Python and C++. Covers variables, control structures, functions, and basic data structures.', credits: 4, semester: 1, department: 'Computer Science',
    },
    {
      code: 'CS201', name: 'Data Structures & Algorithms', description: 'Advanced data structures including trees, graphs, hash tables, and algorithm analysis techniques.', credits: 4, semester: 3, department: 'Computer Science',
    },
    {
      code: 'CS301', name: 'Database Management Systems', description: 'Relational databases, SQL, normalization, transaction management, and NoSQL databases.', credits: 3, semester: 5, department: 'Computer Science',
    },
    {
      code: 'CS401', name: 'Artificial Intelligence', description: 'Search algorithms, knowledge representation, NLP, computer vision, and AI ethics.', credits: 4, semester: 7, department: 'Computer Science',
    },
    {
      code: 'MATH101', name: 'Calculus I', description: 'Limits, derivatives, integrals, and their applications in science and engineering.', credits: 3, semester: 1, department: 'Mathematics',
    },
    {
      code: 'MATH201', name: 'Linear Algebra & Probability', description: 'Vectors, matrices, eigenvalues, probability distributions, and statistical inference.', credits: 3, semester: 3, department: 'Mathematics',
    },
    {
      code: 'IT201', name: 'Web Technologies', description: 'Full-stack web development including HTML, CSS, JavaScript, React, Node.js, and database integration.', credits: 4, semester: 3, department: 'Information Technology',
    },
    {
      code: 'IT301', name: 'Cloud Computing & DevOps', description: 'AWS, Azure, Docker, Kubernetes, CI/CD pipelines, and microservices architecture.', credits: 4, semester: 5, department: 'Information Technology',
    },
    {
      code: 'SE201', name: 'Software Engineering Fundamentals', description: 'Software development life cycles, UML, design patterns, agile methodologies, and project management.', credits: 3, semester: 3, department: 'Software Engineering',
    },
    {
      code: 'SE301', name: 'Software Testing & Quality Assurance', description: 'Unit testing, integration testing, TDD, BDD, test automation, and quality metrics.', credits: 3, semester: 5, department: 'Software Engineering',
    },
    {
      code: 'DS301', name: 'Machine Learning Fundamentals', description: 'Supervised and unsupervised learning, neural networks, model evaluation, and practical ML applications.', credits: 4, semester: 5, department: 'Data Science',
    },
    {
      code: 'CYB201', name: 'Network Security & Cryptography', description: 'Network protocols, encryption algorithms, firewalls, intrusion detection, and ethical hacking basics.', credits: 4, semester: 3, department: 'Cyber Security',
    },
  ]

  const subjects: Awaited<ReturnType<typeof prisma.subject.create>>[] = []
  for (const s of subjectsData) {
    const subject = await prisma.subject.create({ data: s })
    subjects.push(subject)
  }

  // ════════════════════════════════════════════
  // 4. TEACHER-SUBJECT ASSIGNMENTS
  // ════════════════════════════════════════════
  const teacherSubjectMap: [number, number[]][] = [
    [0, [0, 1, 2]],         // Prof. Qasim Ali → CS101, CS201, CS301
    [1, [6, 7]],            // Dr. Sarah Ahmed → IT201, IT301
    [2, [10]],              // Prof. Bilal Hassan → DS301
    [3, [8, 9]],            // Dr. Aiman Fatima → SE201, SE301
    [4, [3]],               // Prof. Kamran Raza → CS401
    [5, [11]],              // Dr. Nida Hussain → CYB201
    [6, [4, 5]],            // Prof. Imran Ashraf → MATH101, MATH201
    [7, [7]],               // Dr. Sobia Kiran → IT301 (co-teacher)
    [8, [10]],              // Prof. Talha Mahmood → DS301 (co-teacher)
    [9, [5]],               // Dr. Zunaira Noor → MATH201 (co-teacher)
  ]

  for (const [teacherIdx, subjectIndices] of teacherSubjectMap) {
    for (const subjectIdx of subjectIndices) {
      await prisma.subjectTeacher.create({
        data: { subjectId: subjects[subjectIdx].id, teacherId: teachers[teacherIdx].id },
      })
    }
  }

  // ════════════════════════════════════════════
  // 5. STUDENTS — 35 Students across 6 departments
  // ════════════════════════════════════════════
  const studentNames = [
    // Semester 1 (10 students)
    { name: 'Hassan Ali', studentId: 'CU-2025-001', dept: 'Information Technology', sem: 1 },
    { name: 'Zainab Malik', studentId: 'CU-2025-002', dept: 'Data Science', sem: 1 },
    { name: 'Hamza Raza', studentId: 'CU-2025-003', dept: 'Computer Science', sem: 1 },
    { name: 'Bilal Iqbal', studentId: 'CU-2025-004', dept: 'Information Technology', sem: 1 },
    { name: 'Tahir Mehmood', studentId: 'CU-2025-005', dept: 'Cyber Security', sem: 1 },
    { name: 'Mehak Fatima', studentId: 'CU-2025-006', dept: 'Software Engineering', sem: 1 },
    { name: 'Saad Ahmed', studentId: 'CU-2025-007', dept: 'Computer Science', sem: 1 },
    { name: 'Areeba Shah', studentId: 'CU-2025-008', dept: 'Data Science', sem: 1 },
    { name: 'Fahad Nawaz', studentId: 'CU-2025-009', dept: 'Information Technology', sem: 1 },
    { name: 'Rida Bashir', studentId: 'CU-2025-010', dept: 'Computer Science', sem: 1 },

    // Semester 3 (12 students)
    { name: 'Ahmed Khan', studentId: 'CU-2024-011', dept: 'Computer Science', sem: 3 },
    { name: 'Fatima Noor', studentId: 'CU-2024-012', dept: 'Computer Science', sem: 3 },
    { name: 'Ayesha Tariq', studentId: 'CU-2024-013', dept: 'Information Technology', sem: 3 },
    { name: 'Maryam Siddiqui', studentId: 'CU-2024-014', dept: 'Data Science', sem: 3 },
    { name: 'Hira Bukhari', studentId: 'CU-2024-015', dept: 'Computer Science', sem: 3 },
    { name: 'Abdullah Rafiq', studentId: 'CU-2024-016', dept: 'Cyber Security', sem: 3 },
    { name: 'Nimra Zahid', studentId: 'CU-2024-017', dept: 'Software Engineering', sem: 3 },
    { name: 'Zubair Waseem', studentId: 'CU-2024-018', dept: 'Computer Science', sem: 3 },
    { name: 'Kiran Jabeen', studentId: 'CU-2024-019', dept: 'Information Technology', sem: 3 },
    { name: 'Waqas Anwar', studentId: 'CU-2024-020', dept: 'Data Science', sem: 3 },
    { name: 'Sana Javaid', studentId: 'CU-2024-021', dept: 'Computer Science', sem: 3 },
    { name: 'Farhan Ali', studentId: 'CU-2024-022', dept: 'Cyber Security', sem: 3 },

    // Semester 5 (8 students)
    { name: 'Usman Sheikh', studentId: 'CU-2023-023', dept: 'Computer Science', sem: 5 },
    { name: 'Sidra Waqas', studentId: 'CU-2023-024', dept: 'Data Science', sem: 5 },
    { name: 'Rizwan Ahmed', studentId: 'CU-2023-025', dept: 'Information Technology', sem: 5 },
    { name: 'Amna Riaz', studentId: 'CU-2023-026', dept: 'Software Engineering', sem: 5 },
    { name: 'Adnan Shabbir', studentId: 'CU-2023-027', dept: 'Computer Science', sem: 5 },
    { name: 'Hafsa Noreen', studentId: 'CU-2023-028', dept: 'Cyber Security', sem: 5 },
    { name: 'Kamran Yousuf', studentId: 'CU-2023-029', dept: 'Data Science', sem: 5 },
    { name: 'Laiba Naz', studentId: 'CU-2023-030', dept: 'Information Technology', sem: 5 },

    // Semester 7 (5 students)
    { name: 'Umer Farooq', studentId: 'CU-2022-031', dept: 'Computer Science', sem: 7 },
    { name: 'Tayyaba Iqbal', studentId: 'CU-2022-032', dept: 'Software Engineering', sem: 7 },
    { name: 'Shahzad Ali', studentId: 'CU-2022-033', dept: 'Information Technology', sem: 7 },
    { name: 'Nadia Pervez', studentId: 'CU-2022-034', dept: 'Data Science', sem: 7 },
    { name: 'Junaid Khan', studentId: 'CU-2022-035', dept: 'Computer Science', sem: 7 },
  ]

  const students: typeof admin[] = []
  for (let i = 0; i < studentNames.length; i++) {
    const s = studentNames[i]
    const year = s.sem === 1 ? 2025 : s.sem === 3 ? 2024 : s.sem === 5 ? 2023 : 2022
    const student = await prisma.user.create({
      data: {
        email: `${s.name.toLowerCase().replace(/ /g, '.')}@student.comcat.edu.pk`,
        password: hashedStudentPassword,
        name: s.name,
        role: 'STUDENT',
        phone: `+92 3${String(i + 1).padStart(2, '0')} ${String(1000000 + i).padStart(7, '0')}`,
        department: s.dept,
        semester: s.sem,
        enrollmentYear: year,
        studentId: s.studentId,
        dateOfBirth: new Date(2001 + (s.sem <= 2 ? 3 : 0), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      },
    })
    students.push(student)
  }

  // ════════════════════════════════════════════
  // 6. ENROLLMENTS — Assign subjects to students by semester
  // ════════════════════════════════════════════
  // Subject index → code reference:
  // 0: CS101 (sem 1), 1: CS201 (sem 3), 2: CS301 (sem 5), 3: CS401 (sem 7)
  // 4: MATH101 (sem 1), 5: MATH201 (sem 3)
  // 6: IT201 (sem 3), 7: IT301 (sem 5)
  // 8: SE201 (sem 3), 9: SE301 (sem 5)
  // 10: DS301 (sem 5), 11: CYB201 (sem 3)

  const semSubjectMap: Record<number, number[]> = {
    1: [0, 4],            // CS101, MATH101
    3: [1, 5, 6, 8, 11],  // CS201, MATH201, IT201, SE201, CYB201
    5: [2, 7, 9, 10],     // CS301, IT301, SE301, DS301
    7: [3],               // CS401
  }

  const enrollmentRecords: { studentId: string; subjectIds: string[] }[] = []

  for (const student of students) {
    const sem = student.semester || 1
    const availableSubjects = semSubjectMap[sem] || []

    // Each student gets 2-3 subjects from their semester pool
    const shuffled = availableSubjects.sort(() => Math.random() - 0.5)
    const take = Math.min(shuffled.length, sem === 7 ? 1 : Math.floor(Math.random() * 2) + 2)
    const assigned = shuffled.slice(0, take)

    for (const subjectIdx of assigned) {
      await prisma.enrollment.create({
        data: { studentId: student.id, subjectId: subjects[subjectIdx].id },
      })
      enrollmentRecords.push({ studentId: student.id, subjectIds: [subjects[subjectIdx].id] })
    }
  }

  // ════════════════════════════════════════════
  // 7. ATTENDANCE — 15 days of records per enrollment
  // ════════════════════════════════════════════
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE']
  const allEnrollments = await prisma.enrollment.findMany()

  for (const enrollment of allEnrollments) {
    const subjectTeacher = await prisma.subjectTeacher.findFirst({
      where: { subjectId: enrollment.subjectId },
    })
    if (!subjectTeacher) continue

    for (let day = 0; day < 15; day++) {
      const date = new Date()
      date.setDate(date.getDate() - (day * 2))
      date.setHours(10, 0, 0, 0)

      const status = statuses[Math.floor(Math.random() * statuses.length)]

      await prisma.attendanceRecord.create({
        data: {
          studentId: enrollment.studentId,
          subjectId: enrollment.subjectId,
          teacherId: subjectTeacher.teacherId,
          date,
          status,
        },
      })
    }
  }

  // ════════════════════════════════════════════
  // 8. FEE RECORDS — Per student per semester
  // ════════════════════════════════════════════
  for (const student of students) {
    const currentSem = student.semester || 1

    // Current semester fee
    const isPaid = Math.random() > 0.45
    await prisma.fee.create({
      data: {
        studentId: student.id,
        semester: currentSem,
        amount: 75000,
        status: isPaid ? 'PAID' : 'PENDING',
        paidAmount: isPaid ? 75000 : 0,
        dueDate: new Date(2025, 8, 30),
        paidDate: isPaid ? new Date(2025, 7, Math.floor(Math.random() * 20) + 1) : null,
        description: `Semester ${currentSem} Tuition Fee — ${student.department}`,
      },
    })

    // Previous semester fee (if not semester 1)
    if (currentSem > 1) {
      await prisma.fee.create({
        data: {
          studentId: student.id,
          semester: currentSem - 1,
          amount: 72000,
          status: 'PAID',
          paidAmount: 72000,
          dueDate: new Date(2024, 2, 28),
          paidDate: new Date(2024, 2, 10),
          description: `Semester ${currentSem - 1} Tuition Fee — ${student.department}`,
        },
      })
    }

    // Two semesters ago (if semester 5+)
    if (currentSem >= 5) {
      await prisma.fee.create({
        data: {
          studentId: student.id,
          semester: currentSem - 2,
          amount: 70000,
          status: 'PAID',
          paidAmount: 70000,
          dueDate: new Date(2023, 8, 30),
          paidDate: new Date(2023, 8, 5),
          description: `Semester ${currentSem - 2} Tuition Fee — ${student.department}`,
        },
      })
    }
  }

  // ════════════════════════════════════════════
  // 9. ANNOUNCEMENTS
  // ════════════════════════════════════════════
  const announcements = [
    {
      title: 'Fall 2025 Registration Open',
      content: 'Registration for Fall 2025 semester is now open. Students are advised to register for their courses before the deadline of August 31, 2025. Late registration will incur a fee of PKR 5,000.',
      category: 'ACADEMIC',
    },
    {
      title: 'Annual Sports Day',
      content: 'The annual sports day will be held on October 15, 2025 at the COMCAT Sports Complex. All students are encouraged to participate. Registration for various sports events is open at the Student Affairs office.',
      category: 'EVENT',
    },
    {
      title: 'Library Extended Hours',
      content: 'Starting from next week, the COMCAT University Library will extend its operating hours until 11:00 PM on weekdays to accommodate mid-term exam preparation. Students are encouraged to make full use of this facility.',
      category: 'GENERAL',
    },
    {
      title: 'Scholarship Applications Due',
      content: 'Reminder: All scholarship applications for the Spring 2025 semester must be submitted by November 15, 2024. Merit-based and need-based scholarships are available. Late applications will not be considered.',
      category: 'URGENT',
    },
    {
      title: 'New AI & Data Science Lab Inauguration',
      content: 'The new state-of-the-art AI & Data Science Lab in Block C will be inaugurated next Monday by the Vice Chancellor. It features 60 GPU workstations with the latest hardware and software for research in machine learning and data analytics.',
      category: 'EVENT',
    },
    {
      title: 'Mid-Term Exam Schedule Released',
      content: 'The mid-term examination schedule for Spring 2025 has been released. Students can check their exam dates and timings on the student portal. Any conflicts must be reported to the Exam Cell within 3 days.',
      category: 'ACADEMIC',
    },
    {
      title: 'Cyber Security Workshop — Register Now',
      content: 'A 2-day hands-on workshop on Ethical Hacking and Penetration Testing will be conducted by Dr. Nida Hussain on November 5-6, 2025. Limited seats available — register at the CS Department office.',
      category: 'EVENT',
    },
  ]

  for (const a of announcements) {
    await prisma.announcement.create({
      data: { title: a.title, content: a.content, category: a.category, authorId: admin.id },
    })
  }

  // ════════════════════════════════════════════
  // 10. CONTACT MESSAGES
  // ════════════════════════════════════════════
  const contactMessages = [
    {
      name: 'Ali Haider', email: 'ali.haider@email.com', subject: 'Admission Inquiry — BS CS',
      message: 'Salam, I would like to know about the admission requirements for the BS Computer Science program at COMCAT University. I am an FSc Pre-Engineering student and very interested in joining.',
    },
    {
      name: 'Sara Malik', email: 'sara.malik@email.com', subject: 'Transfer Credits',
      message: 'I am currently studying at another university and would like to transfer to COMCAT. How do I go about transferring my credits? I have completed 60 credit hours in IT.',
    },
    {
      name: 'Omer Farooq', email: 'omer.farooq@email.com', subject: 'Campus Tour Request',
      message: 'I would like to schedule a campus tour for my daughter who is interested in applying for next year. We are available on weekends. Please let us know a convenient time.',
    },
    {
      name: 'Zain Abbas', email: 'zain.abbas@email.com', subject: 'Fee Structure 2025',
      message: 'Can you please share the updated fee structure for BS Data Science program for Fall 2025? I want to compare it with other universities before making my decision.',
    },
    {
      name: 'Hina Raza', email: 'hina.raza@email.com', subject: 'Scholarship for Merit Students',
      message: 'Assalam o Alaikum. I scored 92% in FSc. Am I eligible for any merit scholarship at COMCAT University? What is the criteria and how can I apply?',
    },
  ]

  for (const m of contactMessages) {
    await prisma.contactMessage.create({ data: m })
  }

  // ════════════════════════════════════════════
  // DONE — Print Summary
  // ════════════════════════════════════════════
  console.log('✅ Seeding completed!')
  console.log('')
  console.log('📋 Login Credentials:')
  console.log('  ─────────────────────────────────────────')
  console.log('  🔴 Admin:   admin@comcat.edu.pk / admin123')
  console.log('  🔵 Teacher: prof.qasim@comcat.edu.pk / teacher123')
  console.log('  🟢 Student: ahmed.khan@student.comcat.edu.pk / student123')
  console.log('  ─────────────────────────────────────────')
  console.log('')
  console.log('📊 Created:')
  console.log(`  - ${await prisma.user.count({ where: { role: 'ADMIN' } })} Admin`)
  console.log(`  - ${await prisma.user.count({ where: { role: 'TEACHER' } })} Teachers`)
  console.log(`  - ${await prisma.user.count({ where: { role: 'STUDENT' } })} Students`)
  console.log(`  - ${await prisma.subject.count()} Subjects`)
  console.log(`  - ${await prisma.enrollment.count()} Enrollments`)
  console.log(`  - ${await prisma.attendanceRecord.count()} Attendance Records`)
  console.log(`  - ${await prisma.fee.count()} Fee Records`)
  console.log(`  - ${await prisma.announcement.count()} Announcements`)
  console.log(`  - ${await prisma.contactMessage.count()} Contact Messages`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
