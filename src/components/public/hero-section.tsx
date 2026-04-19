'use client'

import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, Award, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const stats = [
  { icon: Users, value: '500+', label: 'Students' },
  { icon: BookOpen, value: '50+', label: 'Faculty' },
  { icon: Award, value: '20+', label: 'Programs' },
  { icon: GraduationCap, value: '15+', label: 'Years' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
  },
}

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.8 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function HeroSection() {
  const { setCurrentView } = useAppStore()

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />

      {/* Decorative gold glow elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#C9A84C]/[0.07] blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-[#C9A84C]/[0.05] blur-[100px]" />
        <div className="absolute left-1/3 -bottom-20 h-72 w-72 rounded-full bg-[#C9A84C]/[0.04] blur-[80px]" />
        {/* Subtle gold line accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#C9A84C]/30 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Text Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-sm text-[#C9A84C]"
            >
              <Award className="h-4 w-4" />
              Ranked Among Top Universities
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#e0c76e]">
                COMCAT University
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-lg text-lg leading-relaxed text-[#a3a3a3] mx-auto lg:mx-0"
            >
              Empowering minds, shaping futures. Discover a world-class education
              that combines academic excellence with real-world experience in a
              vibrant campus community.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => {
                  setCurrentView('about')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="bg-[#C9A84C] text-black hover:bg-[#B8963A] gap-2 px-8 font-semibold transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
              >
                Explore More
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setCurrentView('admissions')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white gap-2 px-8"
              >
                Apply Now
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="hidden lg:block"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-[#C9A84C]/10 to-[#C9A84C]/5 blur-xl" />
              <div className="relative overflow-hidden rounded-2xl border border-gray-800/50 shadow-2xl">
                <Image
                  src="/hero-campus.jpg"
                  alt="COMCAT University Campus"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
              {/* Gold corner accents */}
              <div className="absolute -top-px -left-px h-12 w-12 border-t-2 border-l-2 border-[#C9A84C]/50 rounded-tl-2xl" />
              <div className="absolute -bottom-px -right-px h-12 w-12 border-b-2 border-r-2 border-[#C9A84C]/50 rounded-br-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-800 bg-[#111]/80 p-6 text-center backdrop-blur-sm glow-gold-hover transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A84C]/10">
                <stat.icon className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-sm text-[#a3a3a3]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
