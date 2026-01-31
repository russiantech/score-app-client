// =====================================================
// Export all hooks
// =====================================================

import { useApi } from "./useApi";
import { useAssessment, useLessonAssessments, useCreateAssessment, useUpdateAssessment, useDeleteAssessment } from "./useAssessments";
import { useCourses, useCourse, useCreateCourse, useUpdateCourse, useDeleteCourse } from "./useCourses";
import { useStudentEnrollments, useCourseEnrollments, useEnrollStudent, useUnenrollStudent } from "./useEnrollments";
import { useLesson, useCourseLessons, useCreateLesson, useUpdateLesson, useDeleteLesson } from "./useLessons";
import { useParentChildLinks, useParentChildren, useLinkParentChild, useUnlinkParentChild } from "./useParentChild";
import { useStudentPerformance, useCoursePerformance, useChildPerformance } from "./usePerformance";
import { useScores, useAssessmentScores, useCreateScore, useBulkCreateScores, useUpdateScore } from "./useScores";
import { useAdminStats, useTutorStats, useStudentStats, useParentStats } from "./useStats";
import { useUsers, useTutors, useStudents, useParents } from "./useUsers";

export {
  useApi,
  useCourses,
  useCourse,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useScores,
  useAssessmentScores,
  useCreateScore,
  useBulkCreateScores,
  useUpdateScore,
  useStudentEnrollments,
  useCourseEnrollments,
  useEnrollStudent,
  useUnenrollStudent,
  useStudentPerformance,
  useCoursePerformance,
  useChildPerformance,
  useUsers,
  useTutors,
  useStudents,
  useParents,
  useAdminStats,
  useTutorStats,
  useStudentStats,
  useParentStats,
  useParentChildLinks,
  useParentChildren,
  useLinkParentChild,
  useUnlinkParentChild,
  useLesson,
  useCourseLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useAssessment,
  useLessonAssessments,
  useCreateAssessment,
  useUpdateAssessment,
  useDeleteAssessment,
};