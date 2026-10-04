import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import type { CourseLevel } from '@/types/courses';

export const levelStyles: Record<CourseLevel, string> = {
  Beginner:
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  Intermediate:
    'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
  Advanced:
    'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
};

const arts = [
  'from-indigo-600 to-violet-400',
  'from-amber-500 to-yellow-300',
  'from-pink-500 to-rose-300',
  'from-teal-500 to-cyan-300',
  'from-emerald-500 to-emerald-300',
  'from-blue-600 to-sky-300',
];

interface CardCourse {
  _id: string;
  name: string;
  instructor: string;
  level: CourseLevel;
  duration: string;
  price: number;
}

export function CourseCard({
  course,
  index = 0,
}: {
  course: CardCourse;
  index?: number;
}) {
  const free = course.price === 0;

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/20"
    >
      <div
        className={`relative grid h-32 place-items-center overflow-hidden bg-gradient-to-br ${arts[index % arts.length]}`}
      >
        <span className="absolute -left-8 -top-12 size-36 rounded-full bg-white/15" />
        <span className="absolute -bottom-10 -right-2 size-24 rounded-full bg-white/15" />
        {free && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-sun px-3 py-0.5 text-xs font-bold text-ed">
            Free
          </span>
        )}
        <BookOpen
          aria-hidden="true"
          className="relative size-12 text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-125"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span
          className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${levelStyles[course.level]}`}
        >
          {course.level}
        </span>
        <h3 className="mt-3 text-xl font-semibold leading-tight">
          {course.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          by {course.instructor}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          <span className="text-muted-foreground">{course.duration}</span>
          <span className="font-mono font-semibold">
            {free ? 'Free' : `$${course.price.toFixed(2)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}