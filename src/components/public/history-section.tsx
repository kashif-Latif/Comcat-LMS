'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { GraduationCap, Building2, Handshake, FlaskConical, Users, Rocket, ArrowLeft } from 'lucide-react'

const milestones = [
  {
    year: '2010',
    title: 'Founded in Lahore',
    description:
      'COMCAT University was established in the heart of Lahore, Pakistan, with a bold vision to revolutionize technology education and produce world-class tech talent for the global market. Starting with just two programs and a handful of students, our founders laid the groundwork for what would become one of Punjab\'s most innovative institutions.',
    icon: Rocket,
  },
  {
    year: '2013',
    title: 'First Graduating Class',
    description:
      'Our inaugural batch of graduates walked across the stage, marking a proud milestone in our journey. Within months, over 90% secured positions at leading tech companies across Pakistan, including systems at Arfa Software Technology Park and beyond. Their success validated our approach to practical, industry-focused education.',
    icon: GraduationCap,
  },
  {
    year: '2016',
    title: 'Campus Expansion',
    description:
      'Opened our state-of-the-art campus near Arfa Software Technology Park — Lahore\'s premier tech hub — featuring modern labs, smart classrooms, and collaborative spaces designed to inspire innovation. The new campus incorporated sustainability architecture principles, including energy-efficient lighting and natural ventilation systems.',
    icon: Building2,
  },
  {
    year: '2019',
    title: 'Industry Partnerships',
    description:
      'Forged strategic alliances with top Pakistani tech institutions and leading companies, creating pipelines for internships, joint research projects, and guaranteed placement opportunities for students. Partnerships with tech hub organizations in Lahore opened doors for collaborative R&D and student exchange programs.',
    icon: Handshake,
  },
  {
    year: '2022',
    title: 'AI Lab Launch',
    description:
      'Inaugurated a cutting-edge Artificial Intelligence research lab equipped with GPU clusters, robotics workstations, and dedicated spaces for machine learning and natural language processing research. The lab quickly became a hub for student research projects, with several papers accepted at national conferences.',
    icon: FlaskConical,
  },
  {
    year: '2024',
    title: '500+ Students & Growing',
    description:
      'Surpassed 500 enrolled students across six undergraduate programs. Recognized among the fastest-growing tech universities in Pakistan, with alumni at companies like Google, Microsoft, and Careem. Our modern labs, dedicated faculty, and commitment to excellence continue to attract talented students from across the country.',
    icon: Users,
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
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

function HistoryFullPage() {
  const { setCurrentView } = useAppStore()

  const handleBack = () => {
    setCurrentView('home')
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
            Our Journey
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#a3a3a3]">
            From a bold idea to a thriving tech university — over a decade of relentless
            progress, innovation, and impact in the heart of Lahore, Pakistan.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </div>
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 py-20">
        {/* Intro text */}
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <p className="text-lg leading-relaxed text-[#a3a3a3]">
            What began as a small institution with a big dream has grown into a
            leading technology university. Here are the milestones that have defined
            our path — from our founding near Arfa Tower to becoming home to over
            500 students across six cutting-edge programs.
          </p>
          <div className="mx-auto mt-8 h-px w-32 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gray-800 md:left-1/2 md:block md:-translate-x-px" />
          <div className="absolute left-4 top-0 block h-full w-px bg-gray-800 md:hidden" />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="relative"
              >
                {/* Desktop layout: alternate left/right */}
                <div className={`md:grid md:grid-cols-2 md:gap-12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  {/* Content side */}
                  <div className={`md:pr-12 ${index % 2 !== 0 ? 'md:col-start-2 md:pl-12' : ''}`}>
                    <div className="ml-12 md:ml-0">
                      <div className="rounded-xl border border-gray-800 bg-[#111] p-6 glow-gold transition-all duration-300 hover:border-[#C9A84C]/20">
                        <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                          {/* Icon */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/10">
                            <milestone.icon className="h-5 w-5 text-[#C9A84C]" />
                          </div>
                          <div className="flex-1">
                            <span className="inline-block rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-sm font-bold tracking-wider text-[#C9A84C]">
                              {milestone.year}
                            </span>
                            <h3 className="mt-3 text-lg font-semibold text-white">
                              {milestone.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#a3a3a3]">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  {index % 2 === 0 ? (
                    <div className="hidden md:block" />
                  ) : null}
                </div>

                {/* Timeline dot */}
                <div className="absolute left-4 top-6 z-10 -translate-x-1/2 md:left-1/2">
                  <div className="h-3 w-3 rounded-full border-2 border-[#C9A84C] bg-[#0a0a0a]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="text-lg text-[#a3a3a3]">
            And the journey continues. Be part of the next chapter.
          </p>
          <button
            onClick={() => {
              setCurrentView('admissions')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#B8963A] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          >
            Join COMCAT University
          </button>
        </motion.div>
      </div>
    </div>
  )
}

function HistoryCompactSection() {
  return (
    <section id="history" className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our Journey
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            From a bold idea to a thriving tech university — a decade of relentless progress
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gray-800 md:left-1/2 md:block md:-translate-x-px" />
          <div className="absolute left-4 top-0 block h-full w-px bg-gray-800 md:hidden" />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="relative"
              >
                <div className={`md:grid md:grid-cols-2 md:gap-12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`md:pr-12 ${index % 2 !== 0 ? 'md:col-start-2 md:pl-12' : ''}`}>
                    <div className="ml-12 md:ml-0">
                      <div className="rounded-xl border border-gray-800 bg-[#111] p-6 glow-gold transition-all duration-300">
                        <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/10">
                            <milestone.icon className="h-5 w-5 text-[#C9A84C]" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-bold tracking-wider text-[#C9A84C]">
                              {milestone.year}
                            </span>
                            <h3 className="mt-1 text-lg font-semibold text-white">
                              {milestone.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#a3a3a3]">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index % 2 === 0 ? (
                    <div className="hidden md:block" />
                  ) : null}
                </div>

                <div className="absolute left-4 top-6 z-10 -translate-x-1/2 md:left-1/2">
                  <div className="h-3 w-3 rounded-full border-2 border-[#C9A84C] bg-[#0a0a0a]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function HistorySection() {
  const { currentView } = useAppStore()

  if (currentView === 'history') {
    return <HistoryFullPage />
  }

  return <HistoryCompactSection />
}
