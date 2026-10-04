export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseCreator {
  _id: string;
  name: string;
  email: string;
}

export interface Course {
  _id: string;
  name: string;
  instructor: string;
  duration: string;
  price: number;
  level: CourseLevel;
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
}

export type UpdateCourseInput = CreateCourseInput;