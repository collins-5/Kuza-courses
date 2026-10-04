import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Lightbulb,
  Pencil,
  Play,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCourse, useCourseMutations } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { levelStyles } from '@/components/core/course-card';
import type { Lecture, NoteBlock } from '@/types/courses';

function NoteView({ block }: { block: NoteBlock }) {
  switch (block.type) {
    case 'heading':
      return <h3 className="mt-8 text-xl font-bold first:mt-0">{block.text}</h3>;
    case 'paragraph':
      return (
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      );
    case 'code':
      return (
        <pre className="mt-4 overflow-x-auto rounded-xl bg-ed p-4 font-mono text-[13px] leading-6 text-white">
          <code>{block.text}</code>
        </pre>
      );
    case 'tip':
      return (
        <div className="mt-4 flex gap-3 rounded-xl border border-sun/50 bg-sun/15 p-4 text-sm">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-sun" />
          <p>{block.text}</p>
        </div>
      );
    case 'list':
      return (
        <ul className="mt-3 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-muted-foreground">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
  }
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 py-10">
      <div className="h-40 rounded-xl bg-muted" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="h-80 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { course, loading, error } = useCourse(id);
  const { user, isAuthenticated } = useAuth();
  const {
    deleteCourse,
    submitting,
    error: mutationError,
  } = useCourseMutations();

  const modules = course?.modules ?? [];
  const lectures = useMemo(
    () =>
      (course?.modules ?? []).flatMap((m) =>
        m.lectures.map((l) => ({ ...l, _id: l._id ?? `${m.title}-${l.title}` })),
      ),
    [course],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Course not found</h1>
        <p className="mt-2 text-muted-foreground">
          It may have been removed or the link is wrong.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/courses">Browse courses</Link>
        </Button>
      </div>
    );
  }

  const isOwner =
    isAuthenticated && user != null && course.createdBy?._id === user.id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this course?')) return;
    const ok = await deleteCourse(course._id);
    if (ok) navigate('/', { replace: true });
  };

  const hasLectures = lectures.length > 0;
  const index = Math.max(
    0,
    lectures.findIndex((l) => l._id === activeId),
  );
  const active: (Lecture & { _id: string }) | undefined = lectures[index];
  const prev = lectures[index - 1];
  const next = lectures[index + 1];
  const isDone = active ? done.has(active._id) : false;
  const pct = hasLectures ? Math.round((done.size / lectures.length) * 100) : 0;
  const free = course.price === 0;

  const toggleDone = () => {
    if (!active) return;
    setDone((prevSet) => {
      const copy = new Set(prevSet);
      if (copy.has(active._id)) copy.delete(active._id);
      else copy.add(active._id);
      return copy;
    });
  };

  const goTo = (lectureId: string) => {
    setActiveId(lectureId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-400 text-white">
        <span className="absolute -left-10 -top-16 size-56 rounded-full bg-white/10" />
        <span className="absolute -bottom-16 right-10 size-40 rounded-full bg-white/10" />
        <div className="relative mx-auto max-w-6xl px-6 py-10">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to courses
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border bg-white px-2.5 py-0.5 text-xs font-medium ${levelStyles[course.level]}`}
              >
                {course.level}
              </span>
              {free && (
                <span className="rounded-full bg-sun px-3 py-0.5 text-xs font-bold text-ed">
                  Free
                </span>
              )}
            </div>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">
              {course.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-white/85">
              <span>by {course.instructor}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                {course.duration}
              </span>
              <span className="font-mono font-semibold">
                {free ? 'Free' : `$${course.price}`}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_340px]">
        {hasLectures && active ? (
          <motion.main
            key={active._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="min-w-0"
          >
            <div className="relative grid aspect-video place-items-center overflow-hidden rounded-xl bg-ed">
              {active.videoUrl ? (
                <video
                  src={active.videoUrl}
                  controls
                  className="size-full object-cover"
                />
              ) : (
                <>
                  <span className="absolute -left-10 -top-16 size-56 rounded-full bg-primary/30" />
                  <span className="absolute -bottom-16 -right-6 size-44 rounded-full bg-pink/20" />
                  <div className="relative text-center text-white">
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-sun text-ed shadow-lg transition-transform hover:scale-110">
                      <Play className="size-7 fill-current" />
                    </span>
                    <p className="mt-4 text-sm text-white/60">
                      Lecture video appears here
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">
                  Lecture {index + 1} of {lectures.length}
                </p>
                <h2 className="mt-1 text-3xl font-extrabold">{active.title}</h2>
                {active.summary && (
                  <p className="mt-2 max-w-2xl text-muted-foreground">
                    {active.summary}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant={isDone ? 'secondary' : 'default'}
                className="rounded-full"
                onClick={toggleDone}
              >
                <CheckCircle2 className="mr-2 size-4" />
                {isDone ? 'Completed' : 'Mark complete'}
              </Button>
            </div>

            {active.notes.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 border-b border-border pb-3 text-lg font-bold">
                  Lecture notes
                </h2>
                {active.notes.map((block, i) => (
                  <NoteView key={i} block={block} />
                ))}
              </section>
            )}

            {active.takeaways.length > 0 && (
              <section className="mt-10 rounded-xl border border-border bg-accent/50 p-6">
                <h2 className="text-lg font-bold">Key takeaways</h2>
                <ul className="mt-3 space-y-2">
                  {active.takeaways.map((t) => (
                    <li key={t} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-mint" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={!prev}
                onClick={() => prev && goTo(prev._id)}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                type="button"
                className="rounded-full"
                disabled={!next}
                onClick={() => next && goTo(next._id)}
              >
                Next lecture
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </motion.main>
        ) : (
          <main className="min-w-0">
            <div className="rounded-xl border border-dashed border-border bg-accent/40 px-6 py-16 text-center">
              <h2 className="text-xl font-bold">No lectures yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The instructor hasn&apos;t published any lectures for this course.
              </p>
            </div>
          </main>
        )}

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {hasLectures && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Your progress</span>
                <span className="font-mono text-muted-foreground">
                  {done.size}/{lectures.length}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-mint transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-5 space-y-5">
                {modules.map((m, mi) => (
                  <div key={m._id ?? mi}>
                    <h3 className="mb-2 text-sm font-bold">{m.title}</h3>
                    <ul className="space-y-1">
                      {m.lectures.map((l) => {
                        const key = l._id ?? `${m.title}-${l.title}`;
                        const n = lectures.findIndex((x) => x._id === key) + 1;
                        const isActive = active != null && key === active._id;
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              onClick={() => goTo(key)}
                              aria-current={isActive ? 'true' : undefined}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                isActive
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-accent'
                              }`}
                            >
                              {done.has(key) ? (
                                <CheckCircle2
                                  className={`size-4 shrink-0 ${isActive ? '' : 'text-mint'}`}
                                />
                              ) : (
                                <Circle className="size-4 shrink-0 opacity-50" />
                              )}
                              <span className="flex-1 leading-snug">
                                {n}. {l.title}
                              </span>
                              {l.duration && (
                                <span
                                  className={`font-mono text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
                                >
                                  {l.duration}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {course.createdBy?.name && (
            <p className="px-1 text-sm text-muted-foreground">
              Created by {course.createdBy.name} ({course.createdBy.email})
            </p>
          )}

          {mutationError && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
              {mutationError}
            </p>
          )}

          {isOwner && (
            <div className="flex gap-3">
              <Button asChild className="flex-1 rounded-full">
                <Link to={`/courses/${course._id}/edit`}>
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Link>
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1 rounded-full"
                onClick={handleDelete}
                disabled={submitting}
              >
                <Trash2 className="mr-2 size-4" />
                {submitting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}