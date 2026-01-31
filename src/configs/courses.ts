
export const ASSESSMENT_CONFIG: Assessment[] = [
  { 
    id: 'assess',
    type: 'assess',
    label: 'Assess', 
    maxScore: 10, 
    weight: 0.25,
    description: 'Continuous Assessment',
    color: 'primary'
  },
  { 
    id: 'assign',
    type: 'assign',
    label: 'Assign', 
    maxScore: 10, 
    weight: 0.25,
    description: 'Assignment Score',
    color: 'success'
  },
  { 
    id: 'project',
    type: 'project',
    label: 'Project', 
    maxScore: 10, 
    weight: 0.20,
    description: 'Module Project',
    color: 'warning',
    optional: true
  },
  { 
    id: 'exam',
    type: 'exam',
    label: 'Exam', 
    maxScore: 10, 
    weight: 0.30,
    description: 'Final Examination',
    color: 'danger'
  },
];

export const GRADING_SCALE = {
  A: { min: 8, max: 10, grade: 'A', color: 'success' },
  B: { min: 6, max: 7.9, grade: 'B', color: 'info' },
  C: { min: 4, max: 5.9, grade: 'C', color: 'warning' },
  D: { min: 2, max: 3.9, grade: 'D', color: 'secondary' },
  F: { min: 0, max: 1.9, grade: 'F', color: 'danger' }
};
