'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppStore } from '@/store/use-app-store'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  GraduationCap,
  Mail,
  Lock,
  Loader2,
  Shield,
  BookOpen,
  User,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

const testAccounts = [
  {
    role: 'Admin',
    name: 'Muhammad Kashif Latif',
    email: 'admin@comcat.edu.pk',
    password: 'admin123',
    icon: Shield,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  {
    role: 'Teacher',
    name: 'Prof. Qasim Ali',
    email: 'prof.qasim@comcat.edu.pk',
    password: 'teacher123',
    icon: BookOpen,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
  },
  {
    role: 'Student',
    name: 'Ahmed Khan',
    email: 'ahmed.khan@student.comcat.edu.pk',
    password: 'student123',
    icon: User,
    color: 'text-[#C9A84C]',
    bgColor: 'bg-[#C9A84C]/10',
    borderColor: 'border-[#C9A84C]/20',
  },
]

export function LoginForm() {
  const { data: session, status } = useSession()
  const { setCurrentView, setUser } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const fillCredentials = (email: string, password: string) => {
    form.setValue('email', email)
    form.setValue('password', password)
    setError(null)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedEmail(label)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch {
      // fallback - ignore
    }
  }

  // If already logged in, redirect to dashboard
  if (session?.user) {
    const role = (session.user as Record<string, unknown>).role as string
    const dashboardView =
      role === 'ADMIN'
        ? 'admin-dashboard'
        : role === 'TEACHER'
          ? 'teacher-dashboard'
          : 'student-dashboard'

    setTimeout(() => setCurrentView(dashboardView as typeof dashboardView & 'home'), 0)
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0a0a0a]">
        <Card className="w-full max-w-md border border-gray-800 bg-[#111]">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
            <p className="text-[#a3a3a3]">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
        return
      }

      // Fetch session data after successful login
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()

      if (sessionData?.user) {
        const userData = {
          id: sessionData.user.id || '',
          email: sessionData.user.email || '',
          name: sessionData.user.name || '',
          role: (sessionData.user.role as string) || 'STUDENT',
        }

        setUser(userData)

        // Navigate to appropriate dashboard
        const dashboardView =
          userData.role === 'ADMIN'
            ? 'admin-dashboard'
            : userData.role === 'TEACHER'
              ? 'teacher-dashboard'
              : 'student-dashboard'
        setCurrentView(dashboardView as typeof dashboardView & 'home')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Card className="border border-gray-800 bg-[#111] glow-gold">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A84C]">
              <GraduationCap className="h-7 w-7 text-black" />
            </div>
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-[#a3a3a3]">
              Sign in to your COMCAT University account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="rounded-lg border border-red-800 bg-red-950/30 p-3 text-center text-sm text-red-400">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#e5e5e5]">Email</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="border-gray-700 bg-[#1a1a1a] pl-10 text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#e5e5e5]">Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="border-gray-700 bg-[#1a1a1a] pl-10 text-white placeholder:text-[#737373] focus:border-[#C9A84C] focus-visible:ring-[#C9A84C]/30"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C9A84C] text-black hover:bg-[#B8963A] transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex-col gap-3 border-t border-gray-800 pt-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('home')}
              className="w-full text-[#737373] hover:text-white hover:bg-white/5"
            >
              Back to Home
            </Button>
          </CardFooter>
        </Card>

        {/* Test Credentials Card */}
        <Card className="border border-gray-800 bg-[#111]">
          <CardHeader className="pb-3">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => setShowCredentials(!showCredentials)}
            >
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#a3a3a3]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A84C]/10">
                  <span className="text-xs font-bold text-[#C9A84C]">?</span>
                </span>
                Demo Login Credentials
              </CardTitle>
              {showCredentials ? (
                <ChevronUp className="h-4 w-4 text-[#737373]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#737373]" />
              )}
            </button>
          </CardHeader>

          {showCredentials && (
            <CardContent className="space-y-3">
              <p className="text-xs text-[#737373]">
                Click any account below to auto-fill credentials
              </p>
              {testAccounts.map((account) => {
                const Icon = account.icon
                return (
                  <button
                    key={account.role}
                    onClick={() => fillCredentials(account.email, account.password)}
                    className={`flex w-full items-center gap-3 rounded-lg border ${account.borderColor} ${account.bgColor} p-3 text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-md`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${account.bgColor}`}>
                      <Icon className={`h-4 w-4 ${account.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${account.color}`}>
                        {account.role}
                      </p>
                      <p className="text-xs text-[#e5e5e5] truncate">
                        {'name' in account && account.name}
                      </p>
                      <p className="text-[10px] text-[#525252] truncate">
                        {account.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono text-[#525252]">
                        {account.password}
                      </span>
                      <Copy
                        className="h-3 w-3 text-[#525252] hover:text-[#a3a3a3] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(account.email, account.email)
                        }}
                      />
                    </div>
                    {copiedEmail === account.email && (
                      <Check className="absolute top-2 right-2 h-3 w-3 text-green-400" />
                    )}
                  </button>
                )
              })}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
