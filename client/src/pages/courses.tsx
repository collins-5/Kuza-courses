import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Search } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/core/course-card';
import type { CourseLevel } from '@/types/courses';

const LEVELS: Array<CourseLevel | 'All'> = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
];

export default function CoursesBrowse() {
  const { courses, loading, error, refresh } = useCourses();
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<CourseLevel | 'All'>('All');

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesQuery =
        query.trim() === '' ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === 'All' || c.level === level;
      return matchesQuery && matchesLevel;
    });
  }, [courses, query, level]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Browse Courses
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Handcrafted courses from instructors who care about the details.
            Filter by level or search by name.
          </p>
        </header>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <Input
              placeholder="Search courses or instructors..."
              leftIcon={<Search />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-full"
            />
          </div>

          <div
            role="group"
            aria-label="Filter by level"
            className="flex flex-wrap items-center gap-2.5"
          >
            {LEVELS.map((l) => {
              const isActive = level === l;
              return (
                <button
                  key={l}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setLevel(l)}
                  className={`rounded-full border-2 px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card text-foreground hover:border-primary'
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        {loading && <SkeletonGrid />}

        {!loading && error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 rounded-full"
              onClick={refresh}
            >
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            hasCourses={courses.length > 0}
            onReset={() => {
              setQuery('');
              setLevel('All');
            }}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <motion.div
            key={`${level}-${query}`}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course._id}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35 }}
              >
                <CourseCard course={course} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="h-32 bg-muted" />
          <div className="p-5">
            <div className="h-4 w-16 rounded-full bg-muted" />
            <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            <div className="mt-6 flex justify-between">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-3 w-12 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasCourses,
  onReset,
}: {
  hasCourses: boolean;
  onReset: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-accent/40 py-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
        <Icon size="md" asChild className="text-primary">
          <Search />
        </Icon>
      </div>
      <h3 className="text-lg font-semibold">
        {hasCourses ? 'No matches found' : 'No courses yet'}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasCourses
          ? 'Try a different search or clear your filters.'
          : 'Courses will appear here once they are published.'}
      </p>
      {hasCourses && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 rounded-full"
          onClick={onReset}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}