// src/hooks/useTutorCourses.ts
import { useCallback, useEffect, useState } from "react";
import { TutorService } from "@/services/users/tutor";
import toast from "react-hot-toast";
import type { Course } from "@/types/course";

export const useTutorCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // const loadCourses = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const res = await TutorService.getMyCourses();
  //     const data = Array.isArray(res) ? res.data.courses : [];
  //     console.log(res, data)
  //     setCourses(data);
  //   } catch (e) {
  //     console.error(e);
  //     toast.error("Failed to load courses");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const loadCourses = useCallback( async () => {
      try {
        setLoading(true);
        // setError(null);
        const response = await TutorService.getMyCourses();
        // setCourses(Array.isArray(response) ? response : response.data?.courses || []);
        setCourses(
        Array.isArray(response)
          ? response
          : (response as any)?.data?.courses ?? []
      );
        console.log(courses, response.data);
      } catch (err) {
        console.error('Failed to load courses:', err);
        // setError('Failed to load courses');
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }, []);
  

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.is_active).length,
    students: courses.reduce((s, c) => s + (c.enrolled_count || 0), 0),
  };

  return { courses, loading, reload: loadCourses, stats };
};
