// (Course details)

// Courses Tab - Simple Course Details
// src/pages/student/performance/CoursesTab.tsx

import React, { useState } from 'react';
import type { CoursePerformance } from '@/hooks/usePerformance';

interface CoursesTabProps {
  courses: CoursePerformance[];
}

const getGradeColor = (grade: string): string => {
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'primary';
  if (grade.startsWith('C')) return 'info';
  if (grade.startsWith('D')) return 'warning';
  return 'danger';
};

export const CoursesTab: React.FC<CoursesTabProps> = ({ courses }) => {
  const [selectedCourse, setSelectedCourse] = useState<CoursePerformance | null>(null);

  if (selectedCourse) {
    return (
      <CourseDetail 
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="row g-3">
      {courses.map(course => (
        <div key={course.enrollment_id} className="col-12 col-md-6 col-xl-6">
          <div className="card border-0 shadow-sm h-100 hoverable"
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => setSelectedCourse(course)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div className="card-body">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="flex-grow-1 me-2">
                  <h6 className="mb-1">{course.course.title}</h6>
                  <small className="text-muted">{course.course.code}</small>
                </div>
                <span className={`badge bg-${getGradeColor(course.overall_grade)} rounded-pill`}>
                  {course.overall_grade}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small className="text-muted">Overall Score</small>
                  <small className="fw-semibold">{course.overall_average}%</small>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div 
                    className={`progress-bar bg-${getGradeColor(course.overall_grade)}`}
                    style={{ width: `${course.overall_average}%` }}
                    role="progressbar"
                    aria-valuenow={course.overall_average}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
              
              {/* Stats */}
              <div className="row g-2 mb-3">
                <div className="col-4">
                  <div className="text-center p-2 bg-light rounded">
                    <div className="fw-bold small">{course.lesson_scores.length}</div>
                    <small className="text-muted">Lessons</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center p-2 bg-light rounded">
                    <div className="fw-bold small">{course.module_scores.length}</div>
                    <small className="text-muted">Modules</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center p-2 bg-light rounded">
                    <div className="fw-bold small">{course.course_scores.length}</div>
                    <small className="text-muted">Projects</small>
                  </div>
                </div>
              </div>

              {/* Completion */}
              <div className="text-center">
                <small className="text-muted">
                  Completed: {course.completed_assessments}/{course.total_assessments}
                </small>
              </div>
            </div>
            
            <div className="card-footer bg-white border-top py-2 text-center">
              <small className="text-primary fw-medium">
                <i className="fa fa-arrow-right me-1" />
                Click for details
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Course Detail Component
interface CourseDetailProps {
  course: CoursePerformance;
  onBack: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
  return (
    <>
      {/* Header */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
            <div className="d-flex align-items-center gap-3">
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={onBack}
              >
                <i className="fa fa-arrow-left me-1" />
                Back
              </button>
              
              <div>
                <h5 className="mb-0 fw-bold text-truncate">{course.course.title}</h5>
                <small className="text-muted fw-medium">{course.course.code}</small>
              </div>
            </div>

            <div className="d-flex gap-3">
              <div className="text-center">
                <div className="text-muted small">Grade</div>
                <span className={`badge bg-${getGradeColor(course.overall_grade)} fs-6`}>
                  {course.overall_grade}
                </span>
              </div>
              <div className="text-center">
                <div className="text-muted small">Average</div>
                <div className="fw-bold">{course.overall_average}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessments */}
      {course.lesson_scores.length > 0 && (
        <AssessmentTable
          title="Lesson Assessments"
          icon="clipboard-list"
          scores={course.lesson_scores}
        />
      )}

      {course.module_scores.length > 0 && (
        <AssessmentTable
          title="Module Exams"
          icon="file-alt"
          scores={course.module_scores}
        />
      )}

      {course.course_scores.length > 0 && (
        <AssessmentTable
          title="Course Projects"
          icon="project-diagram"
          scores={course.course_scores}
        />
      )}

      {course.total_assessments === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5 d-flex flex-column align-items-center">
            <i className="fa fa-inbox fa-3x text-muted mb-3" />
            <h5>No Assessments Yet</h5>
            <p className="text-muted">Your assessments will appear here once graded.</p>
          </div>
        </div>
      )}
    </>
  );
};

// Assessment Table Component
interface AssessmentTableProps {
  title: string;
  icon: string;
  scores: any[];
}

const AssessmentTable: React.FC<AssessmentTableProps> = ({ title, icon, scores }) => {
  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-light border-0 py-3">
        <h6 className="mb-0">
          <i className={`fa fa-${icon} me-2`} />
          {title}
        </h6>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Assessment</th>
                <th className="d-none d-md-table-cell">Context</th>
                <th className="text-center">Score</th>
                <th className="text-center">Grade</th>
                <th className="d-none d-lg-table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, idx) => (
                <tr key={idx}>
                  <td>
                    <div>
                      <div className="fw-semibold">{score.title}</div>
                      <small className="text-muted text-capitalize">{score.type}</small>
                    </div>
                  </td>
                  <td className="d-none d-md-table-cell">
                    <small className="text-muted">{score.scope_title || 'N/A'}</small>
                  </td>
                  <td className="text-center">
                    {score.is_completed ? (
                      <div>
                        <div className="fw-semibold">{score.score}/{score.max_score}</div>
                        <small className="text-muted">{score.percentage}%</small>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-center">
                    {score.is_completed ? (
                      <span className={`badge bg-${getGradeColor(score.grade)}`}>
                        {score.grade}
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Pending</span>
                    )}
                  </td>
                  <td className="d-none d-lg-table-cell">
                    <small className="text-muted">
                      {score.recorded_date 
                        ? new Date(score.recorded_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoursesTab;

