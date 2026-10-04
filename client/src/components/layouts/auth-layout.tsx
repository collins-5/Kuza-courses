import { motion } from 'motion/react';
import { Link, Outlet } from 'react-router-dom';

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
      <rect width="32" height="32" rx="10" className="fill-primary" />
      <path
        d="M10 8v16M10 17l10-9M13.5 15l8.5 9"
        className="stroke-sun"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-ed via-indigo-950 to-ed p-12 text-white">
        <Link
          to="/"
          className="relative z-10 inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight"
        >
          <LogoMark />
          Kuza
        </Link>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight"
          >
            Learn. Build.
            <br />
            Ship{' '}
            <em className="inline-block -rotate-2 rounded-lg bg-sun px-2 not-italic text-ed">
              faster
            </em>
            .
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-md text-lg text-white/70"
          >
            Free tech courses with short lessons, real projects, and motion in
            every topic. Track your progress and publish your own courses.
          </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-xs text-white/60">
          <span>© {new Date().getFullYear()} Kuza Academy</span>
          <span>·</span>
          <Link to="/" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <span>·</span>
          <Link to="/" className="transition-colors hover:text-white">
            Terms
          </Link>
        </div>

        <AuthIllustration />
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link
            to="/"
            className="lg:hidden mb-8 inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight"
          >
            <LogoMark />
            Kuza
          </Link>

          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

function AuthIllustration() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="pointer-events-none absolute -bottom-32 -right-24 h-[560px] w-[560px] opacity-40"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C74FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#7C74FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFC933" />
          <stop offset="100%" stopColor="#FF5FA2" />
        </linearGradient>
      </defs>

      <circle cx="300" cy="300" r="280" fill="url(#g1)" />

      <motion.g
        initial={{ rotate: -8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ transformOrigin: '300px 300px' }}
      >
        <circle
          cx="300"
          cy="300"
          r="180"
          fill="none"
          stroke="url(#g2)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        <circle
          cx="300"
          cy="300"
          r="120"
          fill="none"
          stroke="url(#g2)"
          strokeWidth="1.5"
          strokeDasharray="2 6"
        />
      </motion.g>

      <motion.g
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect
          x="220"
          y="255"
          width="160"
          height="100"
          rx="12"
          fill="rgba(255,255,255,0.08)"
          stroke="url(#g2)"
          strokeWidth="1.5"
        />
        <line x1="240" y1="285" x2="340" y2="285" stroke="#FF8FC0" strokeWidth="2" strokeLinecap="round" />
        <line x1="240" y1="305" x2="320" y2="305" stroke="#5BE3B4" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="240" y1="325" x2="300" y2="325" stroke="#FFC933" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </motion.g>

      <motion.ellipse
        cx="470"
        cy="470"
        rx="30"
        ry="5"
        fill="#000"
        animate={{ scaleX: [1, 0.4, 1], opacity: [0.5, 0.12, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '470px 470px' }}
      />
      <motion.circle
        cx="470"
        cy="440"
        r="26"
        fill="#FFC933"
        animate={{ y: [0, -110, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.circle
        cx="430"
        cy="180"
        r="8"
        fill="#5BE3B4"
        animate={{ y: [0, -12, 0], opacity: [1, 0.7, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="160"
        cy="420"
        r="6"
        fill="#FF5FA2"
        animate={{ y: [0, 10, 0], opacity: [1, 0.6, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}