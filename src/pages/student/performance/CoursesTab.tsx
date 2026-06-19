// v3
// Courses Tab - Simple Course Details
// src/pages/student/performance/CoursesTab.tsx
import React, { useState } from 'react';
import type { CoursesTabProps } from '@/types/course/course';
import type { CoursePerformance } from '@/types/performance';
import { getGradeColor } from '@/utils/helpers';


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
        <LessonAssessmentTable
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

// ============================================================================
// LESSON ASSESSMENT TABLE - Pivot by lesson, columns by assessment type
// ============================================================================

interface LessonAssessmentTableProps {
  title: string;
  icon: string;
  scores: any[];
}

const LessonAssessmentTable: React.FC<LessonAssessmentTableProps> = ({ title, icon, scores }) => {
  // Group scores by module first, then by lesson within each module
  const groupedByModule = scores.reduce((acc: Record<string, any[]>, score: any) => {
    const moduleKey = score.module_name || 'Uncategorized';
    if (!acc[moduleKey]) acc[moduleKey] = [];
    acc[moduleKey].push(score);
    return acc;
  }, {});

  // Collect all unique assessment types across all lessons (exclude placeholder "none" type)
  const allTypes = Array.from(new Set(
    scores.filter((s: any) => s.type !== 'none').map((s: any) => s.type)
  )).sort();

  // Format type for display
  const formatType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

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
                <th style={{ minWidth: '180px' }}>Lesson</th>
                {allTypes.map((type: string) => (
                  <th key={type} className="text-center" style={{ minWidth: '100px' }}>
                    {formatType(type)}
                  </th>
                ))}
                <th className="d-none d-lg-table-cell text-center" style={{ minWidth: '110px' }}>Scheduled</th>
                <th className="d-none d-xl-table-cell text-center" style={{ minWidth: '110px' }}>Recorded</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedByModule).map(([moduleName, moduleScores]: [string, any[]]) => {
                // Group module scores by lesson
                const groupedByLesson = moduleScores.reduce((acc: Record<string, any[]>, score: any) => {
                  const key = score.scope_title || 'Unknown Lesson';
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(score);
                  return acc;
                }, {});

                return (
                  <React.Fragment key={moduleName}>
                    {/* Module Header Row */}
                    <tr className="table-secondary">
                      <td colSpan={allTypes.length + 3} className="py-2">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fa fa-folder-open text-muted" />
                          <span className="fw-bold text-muted">{moduleName}</span>
                        </div>
                      </td>
                    </tr>
                    {/* Lesson Rows */}
                    {Object.entries(groupedByLesson).map(([lessonName, lessonScores]: [string, any[]]) => {
                      const lessonDate = lessonScores[0]?.lesson_date;
                      const recordedDate = lessonScores[0]?.recorded_date;

                      // Check if this is a placeholder lesson (no real assessments)
                      const isPlaceholder = lessonScores.length === 1 && lessonScores[0].type === 'none';

                      // Build a lookup by type (only for real assessments)
                      const byType: Record<string, any> = {};
                      lessonScores.forEach((s: any) => {
                        if (s.type !== 'none') {
                          byType[s.type] = s;
                        }
                      });

                      return (
                        <tr key={`${moduleName}-${lessonName}`}>
                          <td className="ps-4">
                            <div className="fw-semibold">{lessonName}</div>
                          </td>
                          {allTypes.map((type: string) => {
                            const s = byType[type];
                            if (!s) {
                              return (
                                <td key={type} className="text-center">
                                  <span className="text-muted">—</span>
                                </td>
                              );
                            }
                            return (
                              <td key={type} className="text-center">
                                {s.is_completed ? (
                                  <div>
                                    <div className="fw-semibold small">{s.score}/{s.max_score}</div>
                                    <span className={`badge bg-${getGradeColor(s.grade)}`} style={{ fontSize: '0.7rem' }}>
                                      {s.grade}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>Pending</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="d-none d-lg-table-cell text-center">
                            <small className="text-muted">
                              {lessonDate 
                                ? new Date(lessonDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : '—'}
                            </small>
                          </td>
                          <td className="d-none d-xl-table-cell text-center">
                            <small className="text-muted">
                              {recordedDate 
                                ? new Date(recordedDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : '—'}
                            </small>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STANDARD ASSESSMENT TABLE - For module and course-level assessments
// ============================================================================

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
                <th className="d-none d-lg-table-cell">Recorded</th>
                <th className="d-none d-xl-table-cell">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, idx) => (
                <tr key={score.column_id || idx}>
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
                        : '—'}
                    </small>
                  </td>
                  <td className="d-none d-xl-table-cell">
                    <small className="text-muted">
                      {score.lesson_date 
                        ? new Date(score.lesson_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : '—'}
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

