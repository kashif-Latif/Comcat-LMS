'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Check, ChevronLeft, ChevronRight, User, BookOpen, GraduationCap, ClipboardCheck, Send, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// ─── Zod Schemas ────────────────────────────────────────────
const step1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  cnic: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().min(1, 'Please select a gender'),
})

const step2Schema = z.object({
  program: z.string().min(1, 'Please select a program'),
})

const step3Schema = z.object({
  previousDegree: z.string().optional(),
  previousInstitution: z.string().optional(),
  previousGPA: z.string().optional(),
})

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema)

type AdmissionFormData = z.infer<typeof fullSchema>

// ─── Programs list ──────────────────────────────────────────
const programs = [
  { value: 'BS Computer Science', label: 'BS Computer Science' },
  { value: 'BS Information Technology', label: 'BS Information Technology' },
  { value: 'BS Software Engineering', label: 'BS Software Engineering' },
  { value: 'BS Data Science', label: 'BS Data Science' },
  { value: 'BS Artificial Intelligence', label: 'BS Artificial Intelligence' },
  { value: 'BS Cyber Security', label: 'BS Cyber Security' },
]

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
]

// ─── Step config ────────────────────────────────────────────
const steps = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Program', icon: BookOpen },
  { id: 3, label: 'Education', icon: GraduationCap },
  { id: 4, label: 'Review', icon: ClipboardCheck },
]

// ─── Animation variants ─────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
}

function AdmissionsForm() {
  const { setCurrentView } = useAppStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<AdmissionFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      cnic: '',
      dateOfBirth: '',
      gender: '',
      program: '',
      previousDegree: '',
      previousInstitution: '',
      previousGPA: '',
    },
  })

  const watchedValues = form.watch()

  function validateStep(step: number): boolean {
    let valid = true
    if (step === 1) {
      const result = step1Schema.safeParse({
        firstName: watchedValues.firstName,
        lastName: watchedValues.lastName,
        email: watchedValues.email,
        phone: watchedValues.phone,
        cnic: watchedValues.cnic,
        dateOfBirth: watchedValues.dateOfBirth,
        gender: watchedValues.gender,
      })
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          form.setError(issue.path.join('.') as keyof AdmissionFormData, {
            type: 'manual',
            message: issue.message,
          })
        })
        valid = false
      }
    } else if (step === 2) {
      const result = step2Schema.safeParse({
        program: watchedValues.program,
      })
      if (!result.success) {
        form.setError('program', {
          type: 'manual',
          message: 'Please select a program',
        })
        valid = false
      }
    }
    return valid
  }

  function goNext() {
    if (!validateStep(currentStep)) return
    setDirection(1)
    setCurrentStep((s) => Math.min(s + 1, 4))
  }

  function goBack() {
    setDirection(-1)
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  async function onSubmit() {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(watchedValues),
      })
      if (res.ok) {
        setIsSubmitted(true)
      } else {
        const data = await res.json()
        alert(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Success state ─────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-lg text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/10">
              <Check className="h-8 w-8 text-[#C9A84C]" />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Application Submitted!
            </h2>
            <p className="mt-4 text-[#a3a3a3]">
              Thank you, <span className="text-white font-medium">{watchedValues.firstName}</span>! Your application for{' '}
              <span className="text-[#C9A84C] font-medium">{watchedValues.program}</span> has been received.
              We will review your application and contact you at{' '}
              <span className="text-white font-medium">{watchedValues.email}</span>.
            </p>
            <div className="mt-8 rounded-xl border border-gray-800 bg-[#111] p-6">
              <p className="text-sm text-[#a3a3a3]">
                Application Reference: <span className="text-white font-mono">CMD-{Date.now().toString(36).toUpperCase()}</span>
              </p>
              <p className="mt-2 text-sm text-[#a3a3a3]">Status: <span className="text-[#C9A84C] font-medium">Pending Review</span></p>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => {
                  form.reset()
                  setCurrentStep(1)
                  setIsSubmitted(false)
                }}
                className="bg-[#C9A84C] text-[#0a0a0a] hover:bg-[#C9A84C]/90"
              >
                Submit Another Application
              </Button>
              <Button
                onClick={() => {
                  setCurrentView('home')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                variant="outline"
                className="border-gray-700 text-[#a3a3a3] hover:bg-[#1a1a1a] hover:text-white"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ─── Form ─────────────────────────────────────────────────
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
            Apply Now — Admissions Open
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#a3a3a3]">
            Begin your journey at COMCAT University in just four simple steps.
            Complete the form below and our admissions team will review your application.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </div>
      </div>

      {/* Stepper + Form */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Stepper Progress */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const StepIcon = step.icon
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'border-[#C9A84C] bg-[#C9A84C]'
                          : isActive
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                            : 'border-gray-700 bg-[#111]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-[#0a0a0a]" />
                      ) : (
                        <StepIcon
                          className={`h-4 w-4 ${isActive ? 'text-[#C9A84C]' : 'text-gray-500'}`}
                        />
                      )}
                    </div>
                    <span
                      className={`mt-2 hidden text-xs sm:block ${
                        isActive ? 'text-[#C9A84C] font-medium' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`mx-2 h-px flex-1 sm:mx-4 ${
                        currentStep > step.id ? 'bg-[#C9A84C]' : 'bg-gray-800'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-gray-800 bg-[#111] p-6 sm:p-8 glow-gold"
          >
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait" custom={direction}>
                  {/* ─── Step 1: Personal Info ─────────────────── */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <h3 className="mb-6 text-lg font-semibold text-white">Personal Information</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#e5e5e5]">First Name *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. Muhammad"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#e5e5e5]">Last Name *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. Ali"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
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
                              <FormLabel className="text-[#e5e5e5]">Email *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="you@example.com"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#e5e5e5]">Phone *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="03XX-XXXXXXX"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cnic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#e5e5e5]">CNIC</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="XXXXX-XXXXXXX-X"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#e5e5e5]">Date of Birth</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="date"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel className="text-[#e5e5e5]">Gender *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full border-gray-700 bg-[#1a1a1a] text-white">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="border-gray-700 bg-[#111] text-white">
                                  {genderOptions.map((g) => (
                                    <SelectItem key={g.value} value={g.value}>
                                      {g.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ─── Step 2: Program Selection ─────────────── */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <h3 className="mb-6 text-lg font-semibold text-white">Program Selection</h3>
                      <FormField
                        control={form.control}
                        name="program"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#e5e5e5]">Choose Your Program *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full border-gray-700 bg-[#1a1a1a] text-white">
                                  <SelectValue placeholder="Select a program" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-gray-700 bg-[#111] text-white">
                                {programs.map((p) => (
                                  <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {programs.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => form.setValue('program', p.value)}
                            className={`rounded-lg border p-4 text-left text-sm transition-all duration-200 ${
                              watchedValues.program === p.value
                                ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-white'
                                : 'border-gray-800 bg-[#1a1a1a] text-[#a3a3a3] hover:border-gray-600'
                            }`}
                          >
                            <span className="font-medium">{p.label}</span>
                            <br />
                            <span className="text-xs text-[#a3a3a3]">4 Years · 130 Credit Hours</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ─── Step 3: Academic Background ───────────── */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <h3 className="mb-6 text-lg font-semibold text-white">Academic Background</h3>
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="previousDegree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#e5e5e5]">Previous Degree</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. FSc Pre-Engineering, ICS, DAE"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="previousInstitution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#e5e5e5]">Institution Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. Punjab College, Lahore"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="previousGPA"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#e5e5e5]">GPA / Percentage</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. 3.5 or 88%"
                                  className="border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ─── Step 4: Review & Submit ───────────────── */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <h3 className="mb-6 text-lg font-semibold text-white">Review & Submit</h3>
                      <div className="space-y-4">
                        <div className="rounded-lg border border-gray-800 bg-[#1a1a1a] p-4">
                          <h4 className="mb-3 text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">Personal Information</h4>
                          <div className="grid gap-2 text-sm sm:grid-cols-2">
                            <div>
                              <span className="text-[#a3a3a3]">Name:</span>{' '}
                              <span className="text-white">
                                {watchedValues.firstName} {watchedValues.lastName}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#a3a3a3]">Email:</span>{' '}
                              <span className="text-white">{watchedValues.email}</span>
                            </div>
                            <div>
                              <span className="text-[#a3a3a3]">Phone:</span>{' '}
                              <span className="text-white">{watchedValues.phone}</span>
                            </div>
                            <div>
                              <span className="text-[#a3a3a3]">CNIC:</span>{' '}
                              <span className="text-white">{watchedValues.cnic || '—'}</span>
                            </div>
                            <div>
                              <span className="text-[#a3a3a3]">Date of Birth:</span>{' '}
                              <span className="text-white">{watchedValues.dateOfBirth || '—'}</span>
                            </div>
                            <div>
                              <span className="text-[#a3a3a3]">Gender:</span>{' '}
                              <span className="text-white">{watchedValues.gender || '—'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-800 bg-[#1a1a1a] p-4">
                          <h4 className="mb-3 text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">Selected Program</h4>
                          <p className="text-lg font-medium text-white">{watchedValues.program}</p>
                          <p className="text-sm text-[#a3a3a3]">4 Years · 130 Credit Hours</p>
                        </div>

                        <div className="rounded-lg border border-gray-800 bg-[#1a1a1a] p-4">
                          <h4 className="mb-3 text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">Academic Background</h4>
                          <div className="grid gap-2 text-sm sm:grid-cols-3">
                            <div>
                              <span className="text-[#a3a3a3]">Degree:</span>{' '}
                              <span className="text-white">{watchedValues.previousDegree || '—'}</span>
                            </div>
                            <div>
                              <span className="text-[#a3a3a3]">Institution:</span>{' '}
                              <span className="text-white">{watchedValues.previousInstitution || '—'}</span>
                            </div>
                            <div>
                              <span className="text-[#a3a3a3]">GPA:</span>{' '}
                              <span className="text-white">{watchedValues.previousGPA || '—'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ─── Navigation Buttons ────────────────────── */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-6">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="border-gray-700 bg-transparent text-[#a3a3a3] hover:bg-[#1a1a1a] hover:text-white"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={goNext}
                      className="bg-[#C9A84C] text-[#0a0a0a] hover:bg-[#C9A84C]/90"
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={onSubmit}
                      disabled={isSubmitting}
                      className="bg-[#C9A84C] text-[#0a0a0a] hover:bg-[#C9A84C]/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function AdmissionsCompactSection() {
  return (
    <section className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Apply Now — Admissions Open
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            Begin your journey at COMCAT University in just a few steps
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#C9A84C]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 text-center"
        >
          <p className="text-[#a3a3a3]">
            Our 4-step application process makes it easy to apply. Fill out your personal information,
            select your program, provide your academic background, and submit — all in under 5 minutes.
          </p>
          <Button
            onClick={() => {
              const { setCurrentView } = useAppStore.getState()
              setCurrentView('admissions')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            size="lg"
            className="mt-6 bg-[#C9A84C] text-black hover:bg-[#B8963A] gap-2 px-8 font-semibold transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          >
            Start Your Application
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export function AdmissionsSection() {
  const { currentView } = useAppStore()

  if (currentView === 'admissions') {
    return <AdmissionsForm />
  }

  return <AdmissionsCompactSection />
}
