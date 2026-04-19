'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { MapPin, Phone, Mail, Send, Clock, Linkedin, Github, ArrowLeft } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    detail: '345#, Hamdard Chowk, near Arfa Tower, Lahore',
  },
  {
    icon: Phone,
    title: 'Phone',
    detail: '+92 314 4253900',
  },
  {
    icon: Mail,
    title: 'Email',
    detail: 'kashif.latif2004@gmail.com',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    detail: 'Mon - Fri: 8:00 AM - 5:00 PM',
  },
]

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/in/m-kashif-latif-91070729a', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/kashif-Latif', label: 'GitHub' },
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
      staggerChildren: 0.1,
    },
  },
}

function ContactFullPage() {
  const { setCurrentView } = useAppStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to send message')
      }

      toast.success('Message sent successfully!', {
        description: 'We will get back to you shortly.',
      })
      form.reset()
    } catch (err) {
      toast.error('Failed to send message', {
        description:
          err instanceof Error ? err.message : 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Page Header */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <button
            onClick={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#C9A84C] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#a3a3a3]">
            Have a question or need more information? We&apos;d love to hear from you.
            Reach out and our team will respond within 24 hours.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <motion.div
            className="space-y-6 lg:col-span-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-xl font-bold text-white">
                Get in Touch
              </h2>
              <p className="mt-2 leading-relaxed text-[#a3a3a3]">
                Whether you&apos;re a prospective student, parent, or just curious
                about our university, our team is here to help you with any
                inquiries. Visit us at our campus near Arfa Tower or reach out
                through any of the channels below.
              </p>
            </motion.div>

            <motion.div className="space-y-5" variants={staggerContainer}>
              {contactInfo.map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/10">
                    <item.icon className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-0.5 text-sm text-[#a3a3a3]">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div variants={fadeUp}>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#737373]">
                Follow Us
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800 bg-[#111] text-[#a3a3a3] transition-all duration-300 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Map placeholder / campus info */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-gray-800 bg-[#111] p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C9A84C]">
                Campus Location
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a3a3a3]">
                Our campus is conveniently located in the heart of Lahore&apos;s
                technology district, just steps away from Arfa Software Technology Park.
                We are easily accessible via public transport and offer ample
                parking for visitors.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <Card className="border border-gray-800 bg-[#111] shadow-lg glow-gold">
              <CardHeader>
                <CardTitle className="text-xl text-white">Send us a Message</CardTitle>
                <CardDescription className="text-[#a3a3a3]">
                  Fill out the form below and we&apos;ll respond within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#e5e5e5]">Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your full name"
                                className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#e5e5e5]">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#e5e5e5]">Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What is this about?"
                              className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#e5e5e5]">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              rows={6}
                              className="resize-none border-gray-700 bg-[#1a1a1a] text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#C9A84C] text-black hover:bg-[#B8963A] gap-2 sm:w-auto transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ContactCompactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to send message')
      }

      toast.success('Message sent successfully!', {
        description: 'We will get back to you shortly.',
      })
      form.reset()
    } catch (err) {
      toast.error('Failed to send message', {
        description:
          err instanceof Error ? err.message : 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            Have a question or need more information? We&apos;d love to hear from
            you. Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-5">
          <motion.div
            className="space-y-6 lg:col-span-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <h3 className="text-xl font-bold text-white">
                Get in Touch
              </h3>
              <p className="mt-2 leading-relaxed text-[#a3a3a3]">
                Whether you&apos;re a prospective student, parent, or just curious
                about our university, our team is here to help you with any
                inquiries.
              </p>
            </motion.div>

            <motion.div className="space-y-5" variants={staggerContainer}>
              {contactInfo.map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/10">
                    <item.icon className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-0.5 text-sm text-[#a3a3a3]">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#737373]">
                Follow Us
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800 bg-[#111] text-[#a3a3a3] transition-all duration-300 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <Card className="border border-gray-800 bg-[#111] shadow-lg glow-gold">
              <CardHeader>
                <CardTitle className="text-xl text-white">Send us a Message</CardTitle>
                <CardDescription className="text-[#a3a3a3]">
                  Fill out the form below and we&apos;ll respond within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#e5e5e5]">Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your full name"
                                className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#e5e5e5]">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#e5e5e5]">Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What is this about?"
                              className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#e5e5e5]">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              rows={5}
                              className="resize-none border-gray-700 bg-[#1a1a1a] text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#C9A84C] text-black hover:bg-[#B8963A] gap-2 sm:w-auto transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  const { currentView } = useAppStore()

  if (currentView === 'contact') {
    return <ContactFullPage />
  }

  return <ContactCompactSection />
}
