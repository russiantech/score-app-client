import type { AssessmentConfig } from "@/types/course/assessment";

export const GRADING_SCALE = {
  'A+': { grade: 'A+', min: 9.0, max: 10, color: 'success' },
  'A': { grade: 'A', min: 8.0, max: 8.9, color: 'success' },
  'B+': { grade: 'B+', min: 7.5, max: 7.9, color: 'primary' },
  'B': { grade: 'B', min: 6.0, max: 7.4, color: 'primary' },
  'C+': { grade: 'C+', min: 5.5, max: 5.9, color: 'info' },
  'C': { grade: 'C', min: 4.0, max: 5.4, color: 'info' },
  'D+': { grade: 'D+', min: 3.5, max: 3.9, color: 'warning' },
  'D': { grade: 'D', min: 2.0, max: 3.4, color: 'warning' },
  'F': { grade: 'F', min: 0, max: 1.9, color: 'danger' }
} as const;

export const ASSESSMENT_CONFIG: AssessmentConfig[] = [
  {
    id: 'assess',
    type: 'assess',
    label: 'Assess',
    max_score: 10,
    weight: 0.25,
    description: 'Continuous Assessment',
    color: 'primary'
  },
  {
    id: 'assign',
    type: 'assign',
    label: 'Assign',
    max_score: 10,
    weight: 0.25,
    description: 'Assignment Score',
    color: 'success'
  },
  {
    id: 'project',
    type: 'project',
    label: 'Project',
    max_score: 10,
    weight: 0.20,
    description: 'Module Project',
    color: 'warning',
    optional: true
  },
  {
    id: 'exam',
    type: 'exam',
    label: 'Exam',
    max_score: 10,
    weight: 0.30,
    description: 'Final Examination',
    color: 'danger'
  },
];
