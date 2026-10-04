import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '../lib/api';
import { cache, cacheKeys } from '../lib/cache';
import type {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
} from '@/types/courses';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(
    () => cache.get<Course[]>(cacheKeys.courses) ?? []
  );
  const [loading, setLoading] = useState<boolean>(
    !cache.get(cacheKeys.courses)
  );
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async (force = false) => {
    if (!force) {
      const cached = cache.get<Course[]>(cacheKeys.courses);
      if (cached) {
        setCourses(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const { data } = await api.get<Course[]>('/courses');
      cache.set(cacheKeys.courses, data);
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load courses'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refresh: () => fetchCourses(true),
  };
}

export function useCourse(id: string | undefined) {
  const [course, setCourse] = useState<Course | null>(() =>
    id ? cache.get<Course>(cacheKeys.course(id)) ?? null : null
  );
  const [loading, setLoading] = useState<boolean>(
    id ? !cache.get(cacheKeys.course(id)) : false
  );
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(
    async (force = false) => {
      if (!id) return;

      if (!force) {
        const cached = cache.get<Course>(cacheKeys.course(id));
        if (cached) {
          setCourse(cached);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      try {
        const { data } = await api.get<Course>(`/courses/${id}`);
        cache.set(cacheKeys.course(id), data);
        setCourse(data);
        setError(null);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load course'));
        setCourse(null);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refresh: () => fetchCourse(true),
  };
}

export function useCourseMutations() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalidate = useCallback((id?: string) => {
    cache.invalidate(cacheKeys.courses);
    if (id) cache.invalidate(cacheKeys.course(id));
    else cache.invalidatePrefix('courses:detail:');
  }, []);

  const createCourse = useCallback(
    async (input: CreateCourseInput): Promise<Course | null> => {
      setSubmitting(true);
      setError(null);
      try {
        const { data } = await api.post<Course>('/courses', input);
        invalidate();
        return data;
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to create course'));
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [invalidate]
  );

  const updateCourse = useCallback(
    async (id: string, input: UpdateCourseInput): Promise<Course | null> => {
      setSubmitting(true);
      setError(null);
      try {
        const { data } = await api.patch<Course>(`/courses/${id}`, input);
        invalidate(id);
        return data;
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to update course'));
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [invalidate]
  );

  const deleteCourse = useCallback(
    async (id: string): Promise<boolean> => {
      setSubmitting(true);
      setError(null);
      try {
        await api.delete(`/courses/${id}`);
        invalidate(id);
        return true;
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to delete course'));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [invalidate]
  );

  return {
    createCourse,
    updateCourse,
    deleteCourse,
    submitting,
    error,
  };
}