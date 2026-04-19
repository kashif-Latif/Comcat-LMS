'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Target, Eye, Heart, ArrowLeft } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To provide transformative education that prepares students for leadership roles in a rapidly changing world, fostering critical thinking, creativity, and a commitment to social responsibility. We strive to cultivate an academic culture that encourages intellectual curiosity, ethical reasoning, and a deep sense of purpose in every student who walks through our doors.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'To be a globally recognized center of academic excellence, known for producing innovative research, ethical leaders, and graduates who make meaningful contributions to society. Our vision extends beyond the classroom — we aspire to shape the future of technology education in Pakistan and serve as a model for institutions across the developing world.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description:
      'We uphold integrity, inclusivity, and innovation in everything we do. We believe in empowering every individual through knowledge, nurturing diversity of thought and background, and creating a supportive learning environment where every student feels valued, challenged, and inspired to achieve their highest potential.',
  },
]

const stats = [
  { value: '500+', label: 'Enrolled Students' },
  { value: '50+', label: 'Expert Faculty' },
  { value: '20+', label: 'Academic Programs' },
  { value: '15+', label: 'Years of Excellence' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

function AboutFullPage() {
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
            About COMCAT University
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#a3a3a3]">
            A legacy of academic excellence and innovation since 2010 — shaping the
            next generation of technology leaders in the heart of Lahore, Pakistan.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="absolute -inset-4 rounded-2xl bg-[#C9A84C]/[0.06] blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-gray-800 shadow-lg">
              <Image
                src="/about-library.jpg"
                alt="University Library — COMCAT University"
                width={600}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Shaping Minds, Building Futures
            </h2>
            <p className="leading-relaxed text-[#e5e5e5]">
              COMCAT University stands as a beacon of knowledge and innovation in the
              heart of Lahore. Founded in 2010 with a bold vision to revolutionize
              technology education, our institution has grown into a vibrant community of
              scholars, researchers, and students from all across Pakistan. Located near
              Arfa Software Technology Park — Lahore&apos;s premier tech hub — we are
              uniquely positioned at the intersection of academia and industry.
            </p>
            <p className="leading-relaxed text-[#a3a3a3]">
              Our state-of-the-art facilities include modern computer labs equipped with
              the latest hardware, smart classrooms with interactive displays,
              collaborative maker spaces, and a dedicated AI research lab with GPU
              clusters. Our world-class faculty brings decades of combined industry and
              academic experience, ensuring students receive an education that is both
              theoretically rigorous and practically relevant.
            </p>
            <p className="leading-relaxed text-[#a3a3a3]">
              We offer a diverse range of undergraduate programs spanning Computer Science,
              Information Technology, Software Engineering, Data Science, Artificial
              Intelligence, and Cyber Security. Each program is carefully designed to meet
              the evolving demands of the global technology landscape, with curricula
              regularly updated in consultation with industry advisory boards.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What Drives Us
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            Our core principles guide every decision we make and every program we design.
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {values.map((item) => (
            <motion.div key={item.title} variants={fadeUp}>
              <Card className="group h-full border border-gray-800 bg-[#111] glow-gold-hover transition-all duration-300 hover:border-[#C9A84C]/30">
                <CardHeader className="pb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]/10 transition-colors group-hover:bg-[#C9A84C]/20">
                    <item.icon className="h-6 w-6 text-[#C9A84C] transition-colors" />
                  </div>
                  <CardTitle className="mt-4 text-xl text-white">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-[#a3a3a3]">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats */}
      <div className="border-y border-gray-800 bg-[#111]/50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="text-4xl font-extrabold text-[#C9A84C]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium text-[#737373]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="text-sm text-[#737373]">
            Developed by{' '}
            <span className="font-semibold text-[#C9A84C]">Muhammad Kashif Latif</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function AboutCompactSection() {
  return (
    <section id="about" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            About Our University
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            A legacy of academic excellence and innovation since 2010
          </p>
        </motion.div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="absolute -inset-4 rounded-2xl bg-[#C9A84C]/[0.06] blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-gray-800 shadow-lg">
              <Image
                src="/about-library.jpg"
                alt="University Library"
                width={600}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h3 className="text-2xl font-bold text-white">
              Shaping Minds, Building Futures
            </h3>
            <p className="leading-relaxed text-[#e5e5e5]">
              COMCAT University stands as a beacon of knowledge and innovation
              in the heart of Lahore. Founded with a vision to transform
              technology education, our institution has grown into a vibrant community of
              scholars, researchers, and students from around the globe.
            </p>
            <p className="leading-relaxed text-[#a3a3a3]">
              Our state-of-the-art facilities, world-class faculty, and
              commitment to research excellence create an environment where
              students can thrive and reach their full potential.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {values.map((item) => (
            <motion.div key={item.title} variants={fadeUp}>
              <Card className="group h-full border border-gray-800 bg-[#111] glow-gold-hover transition-all duration-300 hover:border-[#C9A84C]/30">
                <CardHeader className="pb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]/10 transition-colors group-hover:bg-[#C9A84C]/20">
                    <item.icon className="h-6 w-6 text-[#C9A84C] transition-colors" />
                  </div>
                  <CardTitle className="mt-4 text-xl text-white">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-[#a3a3a3]">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="text-center">
              <div className="text-4xl font-extrabold text-[#C9A84C]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-[#737373]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="text-sm text-[#737373]">
            Developed by{' '}
            <span className="font-semibold text-[#C9A84C]">Muhammad Kashif Latif</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export function AboutSection() {
  const { currentView } = useAppStore()

  if (currentView === 'about') {
    return <AboutFullPage />
  }

  return <AboutCompactSection />
}
