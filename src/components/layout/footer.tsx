import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
} from 'lucide-react'

const quickLinks = [
  { label: 'Home', view: 'home' },
  { label: 'About Us', view: 'about' },
  { label: 'Latest News', view: 'news' },
  { label: 'Contact', view: 'contact' },
]

const programs = [
  'Computer Science',
  'Business Administration',
  'Electrical Engineering',
  'Medicine & Health Sciences',
  'Arts & Humanities',
]

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/in/m-kashif-latif-91070729a', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/kashif-Latif', label: 'GitHub' },
]

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-[#a3a3a3] border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A84C]">
                <GraduationCap className="h-5 w-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white">
                COMCAT University
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#737373]">
              COMCAT University is a prestigious institution committed to
              excellence in education, research, and community service. We
              nurture future leaders with knowledge, integrity, and innovation.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 bg-[#111] text-[#a3a3a3] transition-all duration-300 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.view}>
                  <a
                    href={`#${link.view}`}
                    className="text-sm text-[#a3a3a3] transition-colors hover:text-[#C9A84C]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Our Programs
            </h3>
            <ul className="space-y-2 text-sm text-[#a3a3a3]">
              {programs.map((program) => (
                <li
                  key={program}
                  className="transition-colors hover:text-[#C9A84C] cursor-default"
                >
                  {program}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A84C]" />
                <span className="text-sm text-[#a3a3a3]">
                  345#, Hamdard Chowk, near Arfa Tower, Lahore
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#C9A84C]" />
                <span className="text-sm text-[#a3a3a3]">
                  +92 314 4253900
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#C9A84C]" />
                <span className="text-sm text-[#a3a3a3]">
                  kashif.latif2004@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[#737373]">
              &copy; {new Date().getFullYear()} COMCAT University. All rights
              reserved.
            </p>
            <p className="text-sm text-[#737373]">
              Developed by{' '}
              <span className="font-semibold text-[#C9A84C]">Muhammad Kashif Latif</span>
            </p>
          </div>
          <div className="mt-3 flex justify-center gap-6 text-sm text-[#737373]">
            <a href="#" className="transition-colors hover:text-[#C9A84C]">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-[#C9A84C]">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-[#C9A84C]">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
