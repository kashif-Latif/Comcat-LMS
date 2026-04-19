'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Monitor, Code, Database, Brain, Shield, Cpu, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const programs = [
  {
    icon: Monitor,
    name: 'BS Computer Science',
    duration: '4 Years',
    credits: '130 Credit Hours',
    description:
      'Master the fundamentals of computing — algorithms, data structures, operating systems, and software architecture. Build a rock-solid foundation for careers in software development, systems engineering, and research. This program emphasizes theoretical rigor alongside hands-on coding experience, preparing graduates for roles at leading tech companies worldwide.',
  },
  {
    icon: Code,
    name: 'BS Information Technology',
    duration: '4 Years',
    credits: '130 Credit Hours',
    description:
      'Bridge the gap between technology and business. Learn networking, web development, database administration, and IT project management to drive digital transformation across industries. Graduates are equipped to manage complex IT infrastructures and lead technology initiatives in organizations of all sizes.',
  },
  {
    icon: Database,
    name: 'BS Software Engineering',
    duration: '4 Years',
    credits: '130 Credit Hours',
    description:
      'Learn to design, build, and maintain large-scale software systems using industry-standard methodologies like Agile, DevOps, and CI/CD pipelines from day one. This program focuses on the engineering discipline behind software creation, including requirements analysis, system design, quality assurance, and project management.',
  },
  {
    icon: Cpu,
    name: 'BS Data Science',
    duration: '4 Years',
    credits: '130 Credit Hours',
    description:
      'Unlock the power of data. Master statistics, machine learning, data visualization, and big data technologies to extract actionable insights that drive strategic decisions. Students work with real-world datasets and industry tools like Python, R, TensorFlow, and Apache Spark throughout the program.',
  },
  {
    icon: Brain,
    name: 'BS Artificial Intelligence',
    duration: '4 Years',
    credits: '130 Credit Hours',
    description:
      'Dive deep into neural networks, natural language processing, computer vision, and robotics. Prepare to build intelligent systems that solve real-world problems. This cutting-edge program covers the full spectrum of AI research and application, from foundational theory to deploying production-grade models.',
  },
  {
    icon: Shield,
    name: 'BS Cyber Security',
    duration: '4 Years',
    credits: '130 Credit Hours',
    description:
      'Become a guardian of the digital world. Learn ethical hacking, cryptography, network security, and digital forensics to protect organizations from evolving cyber threats. With the rising demand for security professionals, this program prepares graduates for critical roles in government, finance, and the tech industry.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

function ProgramsFullPage() {
  const { setCurrentView } = useAppStore()

  const handleBack = () => {
    setCurrentView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleApplyNow = () => {
    setCurrentView('admissions')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Page Header */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#C9A84C] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Academic Programs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#a3a3a3]">
            Industry-aligned degree programs designed to prepare you for the future of
            technology. Each program combines rigorous academics with hands-on experience
            to ensure our graduates are ready to lead from day one.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {programs.map((program) => (
            <motion.div
              key={program.name}
              variants={cardVariants}
              className="group relative flex flex-col rounded-xl border border-gray-800 bg-[#111] p-6 transition-all duration-300 glow-gold-hover"
            >
              {/* Icon */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A84C]/10 transition-colors duration-300 group-hover:bg-[#C9A84C]/20">
                <program.icon className="h-6 w-6 text-[#C9A84C]" />
              </div>

              {/* Program Name */}
              <h3 className="text-lg font-semibold text-white">
                {program.name}
              </h3>

              {/* Duration & Credits */}
              <div className="mt-2 flex items-center gap-3 text-sm text-[#a3a3a3]">
                <span className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-[#e5e5e5]">
                  {program.duration}
                </span>
                <span className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-[#e5e5e5]">
                  {program.credits}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[#a3a3a3]">
                {program.description}
              </p>

              {/* Apply Now Button */}
              <Button
                onClick={handleApplyNow}
                variant="ghost"
                className="mt-5 h-auto justify-start gap-2 p-0 text-[#C9A84C] hover:text-[#C9A84C]/80 hover:bg-transparent"
              >
                Apply Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-16 rounded-xl border border-gray-800 bg-[#111] p-8 text-center sm:p-12"
        >
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Begin Your Journey?
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
            Admissions are now open for the upcoming semester. Submit your application
            today and take the first step toward a rewarding career in technology.
          </p>
          <Button
            onClick={handleApplyNow}
            size="lg"
            className="mt-8 bg-[#C9A84C] text-black hover:bg-[#B8963A] gap-2 px-8 font-semibold transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          >
            Apply Now — Admissions Open
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

function ProgramsCompactSection() {
  return (
    <section id="programs" className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Academic Programs
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            Industry-aligned degree programs designed to prepare you for the future of technology
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {programs.map((program) => (
            <motion.div
              key={program.name}
              variants={cardVariants}
              className="group relative rounded-xl border border-gray-800 bg-[#111] p-6 transition-all duration-300 glow-gold-hover"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A84C]/10 transition-colors duration-300 group-hover:bg-[#C9A84C]/20">
                <program.icon className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {program.name}
              </h3>
              <div className="mt-2 flex items-center gap-3 text-sm text-[#a3a3a3]">
                <span className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-[#e5e5e5]">
                  {program.duration}
                </span>
                <span className="rounded-full border border-gray-700 px-2.5 py-0.5 text-xs text-[#e5e5e5]">
                  {program.credits}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#a3a3a3]">
                {program.description}
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  useAppStore.getState().setCurrentView('programs')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="mt-5 h-auto p-0 text-[#C9A84C] hover:text-[#C9A84C]/80 hover:bg-transparent"
              >
                Learn More
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function ProgramsSection() {
  const { currentView } = useAppStore()

  if (currentView === 'programs') {
    return <ProgramsFullPage />
  }

  return <ProgramsCompactSection />
}
