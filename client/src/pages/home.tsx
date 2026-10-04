import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ArrowRight, BookOpen, Zap, Award } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/core/course-card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Featured />
      <Features />
      <FinalCta />
    </div>
  );
}

const STEPS = [
  {
    text: '.ball { background: gold; border-radius: 50%; }',
    target: 'ball',
  },
  {
    text: '.ball { animation: ball .8s ease-out infinite alternate; }',
    target: 'bounce',
  },
  {
    text: '.shadow { animation: squash .8s ease-out infinite alternate; }',
    target: 'shadow',
  },
] as const;

type Stage = { ball: boolean; bounce: boolean; shadow: boolean };

const EMPTY_STAGE: Stage = { ball: false, bounce: false, shadow: false };

function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(/(^\.\w+|[a-z-]+(?=:))/).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={part.startsWith('.') ? 'text-pink' : 'text-mint'}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function Studio() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [stage, setStage] = useState<Stage>(EMPTY_STAGE);

  useEffect(() => {
    setDone([]);
    setCurrent('');
    setStage(EMPTY_STAGE);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(STEPS.map((s) => s.text));
      setStage({ ball: true, bounce: true, shadow: true });
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    (async () => {
      await wait(800);
      for (const step of STEPS) {
        for (let k = 1; k <= step.text.length; k++) {
          if (cancelled) return;
          setCurrent(step.text.slice(0, k));
          await wait(24);
        }
        if (cancelled) return;
        setDone((d) => [...d, step.text]);
        setCurrent('');
        setStage((s) => ({ ...s, [step.target]: true }));
        await wait(500);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [run]);

  return (
    <div
      aria-label="Live animation lesson preview"
      className="overflow-hidden rounded-3xl bg-ed text-white shadow-2xl shadow-primary/40"
    >
      <div className="flex items-center gap-2 bg-black/30 px-4 py-3.5">
        <span className="size-3 rounded-full bg-[#FF5F57]" />
        <span className="size-3 rounded-full bg-[#FEBC2E]" />
        <span className="size-3 rounded-full bg-[#28C840]" />
        <span className="ml-auto text-xs text-white/60">lesson-1.css</span>
      </div>

      <div className="min-h-36 p-5 font-mono text-[13.5px] leading-7">
        {done.map((line) => (
          <div key={line} className="min-h-6 whitespace-pre-wrap break-words">
            <Highlight text={line} />
          </div>
        ))}
        {(current !== '' || done.length < STEPS.length) && (
          <div className="min-h-6 whitespace-pre-wrap break-words">
            {current}
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-sun" />
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        className="relative h-52 border-t border-white/10 bg-gradient-to-b from-indigo-800/80 to-ed"
      >
        <div
          className={`absolute bottom-8 left-1/2 -ml-8 h-2.5 w-16 rounded-full bg-black opacity-0 ${stage.shadow ? 'animate-squash' : ''}`}
        />
        <div
          className={`absolute bottom-11 left-1/2 -ml-8 size-16 ${stage.ball ? 'rounded-full bg-sun' : ''} ${stage.bounce ? 'animate-ball' : ''}`}
        />
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="absolute right-3.5 top-3 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-white transition-colors hover:bg-white/20"
        >
          Replay
        </button>
      </div>
    </div>
  );
}

const faces = [
  { bg: 'bg-sun', emoji: '🧑🏾‍💻' },
  { bg: 'bg-pink', emoji: '👩🏽‍🎨' },
  { bg: 'bg-mint', emoji: '🧑🏿‍🔬' },
  { bg: 'bg-primary/60', emoji: '👩🏾‍💻' },
];

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11 } } }}
      >
        <motion.h1
          variants={rise}
          className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          Free tech courses you&apos;ll actually{' '}
          <em className="inline-block -rotate-2 rounded-lg bg-sun px-2 not-italic text-ed">
            finish
          </em>
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-6 max-w-xl text-xl text-muted-foreground"
        >
          Short lessons, real projects, and motion in every topic. Learn web,
          mobile, data, and animation without paying a shilling.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg" className="rounded-full">
            <Link to="/courses">
              Browse Courses
              <Icon size="sm" asChild className="ml-2">
                <ArrowRight />
              </Icon>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/register">Get Started</Link>
          </Button>
        </motion.div>

        <motion.div
          variants={rise}
          className="mt-9 flex items-center gap-3.5 text-sm text-muted-foreground"
        >
          <div aria-hidden="true" className="flex">
            {faces.map((f, i) => (
              <span
                key={i}
                className={`-ml-2.5 grid size-9 place-items-center rounded-full border-[3px] border-background text-sm first:ml-0 ${f.bg}`}
              >
                {f.emoji}
              </span>
            ))}
          </div>
          <span>12,400 learners from Nairobi, Lagos, Accra and beyond</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <Studio />
      </motion.div>
    </section>
  );
}

function Featured() {
  const { courses, loading } = useCourses();
  const featured = courses.slice(0, 3);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Pick a course and start in a minute
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked from the catalog.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/courses">
              View all
              <Icon size="sm" asChild className="ml-1.5">
                <ArrowRight />
              </Icon>
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="h-32 bg-muted" />
                <div className="p-5">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">No courses published yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <CourseCard course={course} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const features = [
  {
    icon: BookOpen,
    title: 'Curated content',
    description:
      'Every course is reviewed for clarity, accuracy, and depth. No fluff, no filler.',
    rule: 'border-sun',
  },
  {
    icon: Zap,
    title: 'Learn at your pace',
    description:
      'Self-guided modules with lifetime access. Revisit any lesson, anytime.',
    rule: 'border-pink',
  },
  {
    icon: Award,
    title: 'Real outcomes',
    description:
      'Finish with portfolio-ready work and a certificate you can share.',
    rule: 'border-mint',
  },
];

function Features() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] bg-foreground px-8 py-14 text-background sm:px-12">
          <h2 className="max-w-xl text-3xl font-extrabold sm:text-4xl">
            Built for people who care
          </h2>
          <p className="mt-2 text-background/70">
            Three things every course on this platform does well.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`border-t-[3px] pt-5 ${f.rule}`}
              >
                <Icon size="md" asChild>
                  <f.icon />
                </Icon>
                <h3 className="mt-3 text-2xl font-extrabold">{f.title}</h3>
                <p className="mt-2 text-background/75">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center sm:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 120%, color-mix(in oklch, var(--primary) 28%, transparent), transparent 60%)',
            }}
          />
          <div className="relative">
            <h2 className="text-3xl font-extrabold sm:text-5xl">
              Ready to start?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Create an account and start learning. Every course is free and it
              takes less than a minute.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/register">
                  Create an account
                  <Icon size="sm" asChild className="ml-2">
                    <ArrowRight />
                  </Icon>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}