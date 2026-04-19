'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Newspaper, ArrowLeft } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  author: {
    id: string
    name: string
  }
}

const categoryColors: Record<string, string> = {
  GENERAL: 'bg-gray-800 text-gray-300 border-gray-700',
  ACADEMIC: 'bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30',
  EVENT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  URGENT: 'bg-red-500/15 text-red-400 border-red-500/30',
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

function NewsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-gray-800 bg-[#111]">
          <CardHeader className="pb-3">
            <Skeleton className="mb-2 h-5 w-20 rounded-full bg-gray-800" />
            <Skeleton className="h-6 w-full bg-gray-800" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-800" />
            <Skeleton className="h-4 w-3/4 bg-gray-800" />
            <Skeleton className="h-4 w-1/2 bg-gray-800" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-28 bg-gray-800" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements')
        if (!res.ok) throw new Error('Failed to fetch announcements')
        const data = await res.json()
        setAnnouncements(data)
      } catch {
        setError('Unable to load news at this time.')
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  return { announcements, loading, error }
}

function NewsFullPage() {
  const { setCurrentView } = useAppStore()
  const { announcements, loading, error } = useAnnouncements()

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
            Latest News & Announcements
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#a3a3a3]">
            Stay up to date with the latest happenings, academic updates, events,
            and important announcements from the COMCAT University community.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 py-20">
        {loading && <NewsSkeleton />}

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/30 p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && announcements.length === 0 && (
          <div className="rounded-lg border border-gray-800 bg-[#111] p-12 text-center">
            <Newspaper className="mx-auto h-12 w-12 text-[#737373]" />
            <p className="mt-4 text-lg font-medium text-[#a3a3a3]">
              No announcements yet
            </p>
            <p className="mt-1 text-sm text-[#737373]">
              Check back later for the latest news and updates from our university.
            </p>
          </div>
        )}

        {!loading && !error && announcements.length > 0 && (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {announcements.map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <Card className="group h-full overflow-hidden border border-gray-800 bg-[#111] glow-gold-hover transition-all duration-300 hover:border-[#C9A84C]/20">
                  <CardHeader className="pb-3">
                    <Badge
                      variant="outline"
                      className={`w-fit text-xs ${categoryColors[item.category] || categoryColors.GENERAL}`}
                    >
                      {item.category}
                    </Badge>
                    <CardTitle className="mt-2 line-clamp-2 text-lg leading-snug text-white transition-colors group-hover:text-[#C9A84C]">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-4 text-sm leading-relaxed text-[#a3a3a3]">
                      {item.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between text-xs text-[#737373]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="font-medium text-[#737373]">
                      By {item.author.name}
                    </span>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function NewsCompactSection() {
  const { announcements, loading, error } = useAnnouncements()

  return (
    <section id="news" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="flex items-center gap-2 text-[#C9A84C]">
            <Newspaper className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Stay Updated
            </span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Latest News & Announcements
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            Keep up with the latest happenings, events, and updates from our
            university community.
          </p>
        </motion.div>

        <div className="mt-14">
          {loading && <NewsSkeleton />}

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/30 p-8 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && announcements.length === 0 && (
            <div className="rounded-lg border border-gray-800 bg-[#111] p-12 text-center">
              <Newspaper className="mx-auto h-12 w-12 text-[#737373]" />
              <p className="mt-4 text-lg font-medium text-[#a3a3a3]">
                No announcements yet
              </p>
              <p className="mt-1 text-sm text-[#737373]">
                Check back later for the latest news and updates.
              </p>
            </div>
          )}

          {!loading && !error && announcements.length > 0 && (
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerContainer}
            >
              {announcements.slice(0, 6).map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <Card className="group h-full overflow-hidden border border-gray-800 bg-[#111] glow-gold-hover transition-all duration-300 hover:border-[#C9A84C]/20">
                    <CardHeader className="pb-3">
                      <Badge
                        variant="outline"
                        className={`w-fit text-xs ${categoryColors[item.category] || categoryColors.GENERAL}`}
                      >
                        {item.category}
                      </Badge>
                      <CardTitle className="mt-2 line-clamp-2 text-lg leading-snug text-white transition-colors group-hover:text-[#C9A84C]">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-sm leading-relaxed text-[#a3a3a3]">
                        {item.content}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between text-xs text-[#737373]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="font-medium text-[#737373]">
                        By {item.author.name}
                      </span>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export function NewsSection() {
  const { currentView } = useAppStore()

  if (currentView === 'news') {
    return <NewsFullPage />
  }

  return <NewsCompactSection />
}
