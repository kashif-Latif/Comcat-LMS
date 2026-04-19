'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap,
  BookOpen,
  Clock,
  Newspaper,
  FileText,
  Phone,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import type { ViewType } from '@/store/use-app-store'

interface SectionCard {
  icon: LucideIcon
  view: ViewType
  title: string
  description: string
  stat: string
}

const sections: SectionCard[] = [
  {
    icon: GraduationCap,
    view: 'about',
    title: 'About Us',
    description:
      'Discover our legacy of academic excellence, our mission to shape future leaders, and the values that drive COMCAT University forward.',
    stat: '15+ Years of Excellence',
  },
  {
    icon: BookOpen,
    view: 'programs',
    title: 'Academic Programs',
    description:
      'Explore our industry-aligned BS degree programs in Computer Science, IT, Software Engineering, Data Science, AI, and Cyber Security.',
    stat: '6 BS Programs',
  },
  {
    icon: Clock,
    view: 'history',
    title: 'Our Journey',
    description:
      'From our founding in Lahore to becoming a leading tech education hub — trace the milestones that defined COMCAT University.',
    stat: 'Est. 2010',
  },
  {
    icon: Newspaper,
    view: 'news',
    title: 'Latest News',
    description:
      'Stay updated with announcements, events, academic updates, and important notices from the COMCAT University community.',
    stat: 'Stay Informed',
  },
  {
    icon: FileText,
    view: 'admissions',
    title: 'Admissions Open',
    description:
      'Ready to begin your journey? Apply now for our upcoming semester. Multi-step application with instant confirmation.',
    stat: 'Apply Now',
  },
  {
    icon: Phone,
    view: 'contact',
    title: 'Contact Us',
    description:
      'Have questions? Reach out to our admissions team. Visit us at Hamdard Chowk, Lahore or connect online.',
    stat: '+92 314 4253900',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function HomepageGrid() {
  const setCurrentView = useAppStore((s) => s.setCurrentView)

  const handleCardClick = (view: ViewType) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="bg-[#0a0a0a]">
      {/* Section Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Explore COMCAT University
          </h2>
          <p className="mt-4 text-[#a3a3a3]">
            Everything you need — academics, admissions, campus life, and more
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </div>
      </div>

      {/* Card Grid */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.view}
                variants={cardVariants}
                onClick={() => handleCardClick(section.view)}
                className="group cursor-pointer rounded-xl border border-gray-800 bg-[#111] p-6 transition-all duration-300 hover:border-[#C9A84C]/30 glow-gold-hover"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A84C]/10 transition-colors duration-300 group-hover:bg-[#C9A84C]/20">
                  <Icon className="h-6 w-6 text-[#C9A84C]" />
                </div>

                {/* Content */}
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {section.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3]">
                  {section.description}
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-[#e5e5e5]">
                    {section.stat}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-[#C9A84C] transition-transform duration-200 group-hover:translate-x-1">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
