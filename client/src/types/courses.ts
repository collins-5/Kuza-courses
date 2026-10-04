export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseCreator {
  _id: string;
  name: string;
  email: string;
}

export type NoteBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; text: string; lang?: string }
  | { type: 'tip'; text: string }
  | { type: 'list'; items: string[] };

export interface Lecture {
  _id?: string;
  title: string;
  duration?: string;
  summary?: string;
  videoUrl?: string;
  notes: NoteBlock[];
  takeaways: string[];
}

export interface CourseModule {
  _id?: string;
  title: string;
  lectures: Lecture[];
}

export interface Course {
  _id: string;
  name: string;
  instructor: string;
  duration: string;
  price: number;
  level: CourseLevel;
  modules?: CourseModule[];
  createdBy: CourseCreator;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  name: string;
  instructor: string;
  duration: string;
  price: number;
  level: CourseLevel;
  modules?: CourseModule[];
}

export type UpdateCourseInput = CreateCourseInput;