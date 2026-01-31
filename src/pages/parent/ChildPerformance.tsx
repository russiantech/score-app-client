// // src/pages/parent/ChildPerformance.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// // import apiService from '../../services/api';
// import type { User, StudentPerformance, Course } from '../../types';
// import { getGradeColor, getAssessmentTypeColor, formatDate } from '../../types';
// import UserService from '@/services/users/UserService';
// import CourseService from '@/services/courses/CourseService';

import CourseService from "@/services/courses/CourseService";
import type { User } from "@/types/auth";
import type { Course } from "@/types/course";
import type { StudentPerformance } from "@/types/performance";
import { getGradeColor, getAssessmentTypeColor } from "@/utils/helpers";
import { formatDate } from "date-fns";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

 
const ChildPerformance: React.FC = () => {
  const { childId, courseId } = useParams<{ childId: string; courseId?: string }>();
  const [child, setChild] = useState<User | null>(null);
  const [performances, setPerformances] = useState<StudentPerformance[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>(courseId || 'all');
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (childId) {
      fetchData();
    }
  }, [childId, selectedCourse]);

  const fetchData = async () => {
    if (!childId) return;

    try {
      setLoading(true);
      const [childData, performanceData, enrollments] = await Promise.all([
        UserServiceService.getUser(childId),
        apiService.getStudentPerformance(
          childId,
          selectedCourse !== 'all' ? selectedCourse : undefined
        ),
        apiService.getStudentEnrollments(childId),
      ]);

      setChild(childData);
      setPerformances(performanceData);

      // Get full course details
      const courseIds = [...new Set(performanceData.map(p => p.courseId))];
      const fullCourses = await Promise.all(
        courseIds.map(id => CourseService.getCourse(id))
      );
      setCourses(fullCourses);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const calculateOverallStats = () => {
    if (performances.length === 0) {
      return { averagePercentage: 0, totalCompleted: 0, totalPending: 0, overallGrade: '-' };
    }

    const totalPercentage = performances.reduce((sum, p) => sum + p.overallPercentage, 0);
    const averagePercentage = totalPercentage / performances.length;

    let totalCompleted = 0;
    let totalPending = 0;

    performances.forEach(perf => {
      perf.lessons.forEach(lesson => {
        lesson.assessments.forEach(assessment => {
          if (assessment.status === 'graded' || assessment.status === 'completed') {
            totalCompleted++;
          } else {
            totalPending++;
          }
        });
      });
    });

    // Calculate overall grade from average
    const overallGrade = performances[0]?.overallGrade || '-';

    return { averagePercentage, totalCompleted, totalPending, overallGrade };
  };

  const handleDownloadReport = () => {
    // Implement PDF generation here
    alert('Downloading report... (Implement PDF generation)');
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="alert alert-danger">
        Child not found or access denied.
      </div>
    );
  }

  return (
    <div className="child-performance">
      {/* Header with Breadcrumb */}
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/parent/children">My Children</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/parent/children/${childId}`}>
                {child.firstName} {child.lastName}
              </Link>
            </li>
            <li className="breadcrumb-item active">Performance</li>
          </ol>
        </nav>
      </div>

      {/* Child Info Header */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4 className="mb-0">{child.firstName} {child.lastName}'s Performance</h4>
              <p className="text-muted mb-0">{child.email}</p>
            </div>
            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-outline-primary"
                onClick={handleDownloadReport}
              >
                <i className="fa fa-download me-2"></i>
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <div className="progress-circle mx-auto mb-2" style={{ '--progress': stats.averagePercentage } as any} data-progress={Math.round(stats.averagePercentage)}>
              </div>
              <h5 className="mb-0">{Math.round(stats.averagePercentage)}%</h5>
              <p className="text-muted small mb-0">Overall Average</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="mb-0">
                <span className={`badge bg-${getGradeColor(stats.overallGrade as any)}`}>
                  {stats.overallGrade}
                </span>
              </h3>
              <p className="text-muted small mb-0">Overall Grade</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="mb-0 text-success">{stats.totalCompleted}</h3>
              <p className="text-muted small mb-0">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="mb-0 text-warning">{stats.totalPending}</h3>
              <p className="text-muted small mb-0">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <select
                className="form-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 text-md-end">
              <span className="badge bg-primary me-2">
                Total Courses: {courses.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance by Course */}
      {performances.length === 0 ? (
        <div className="alert alert-info">
          No performance data available yet. Your child needs to complete some assessments.
        </div>
      ) : (
        <div className="row">
          {performances.map(coursePerf => {
            const course = courses.find(c => c.id === coursePerf.courseId);
            return (
              <div key={coursePerf.courseId} className="col-12 mb-4">
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{coursePerf.courseName}</h6>
                        {course && (
                          <small>Tutor: {course.tutorName || 'Not assigned'}</small>
                        )}
                      </div>
                      <div className="text-end">
                        <div className="d-flex align-items-center gap-3">
                          <div>
                            <small>Course Average</small>
                            <h5 className="mb-0">{Math.round(coursePerf.overallPercentage)}%</h5>
                          </div>
                          <span className={`badge bg-${getGradeColor(coursePerf.overallGrade)}`}>
                            {coursePerf.overallGrade}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    {/* Lessons with Assessments */}
                    {coursePerf.lessons.map(lesson => (
                      <div key={lesson.lessonId} className="mb-3">
                        <div
                          className="d-flex justify-content-between align-items-center p-3 bg-light rounded cursor-pointer"
                          onClick={() => toggleLesson(lesson.lessonId)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div>
                            <strong>{lesson.lessonTitle}</strong>
                            <div className="text-muted small">
                              {lesson.assessments.length} assessments • 
                              {' '}{lesson.assessments.filter(a => a.status === 'graded').length} graded • 
                              {' '}{lesson.assessments.filter(a => a.status === 'pending').length} pending
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <div className="text-end">
                              <strong>Avg: {Math.round(lesson.averageScore)}%</strong>
                            </div>
                            <i className={`fa fa-chevron-${expandedLessons.has(lesson.lessonId) ? 'up' : 'down'}`}></i>
                          </div>
                        </div>

                        {/* Expanded Assessment Details */}
                        {expandedLessons.has(lesson.lessonId) && (
                          <div className="mt-2 ms-4">
                            <div className="table-responsive">
                              <table className="table table-sm table-hover">
                                <thead>
                                  <tr>
                                    <th>Assessment</th>
                                    <th>Type</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th className="text-end">Score</th>
                                    <th className="text-end">Grade</th>
                                    <th>Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {lesson.assessments.map(assessment => (
                                    <tr key={assessment.assessmentId}>
                                      <td>
                                        <strong>{assessment.assessmentTitle}</strong>
                                      </td>
                                      <td>
                                        <span className={`badge bg-${getAssessmentTypeColor(assessment.type)}`}>
                                          {assessment.type}
                                        </span>
                                      </td>
                                      <td>
                                        {assessment.dueDate ? formatDate(assessment.dueDate) : '-'}
                                      </td>
                                      <td>
                                        {assessment.status === 'graded' ? (
                                          <span className="badge bg-success">Graded</span>
                                        ) : assessment.status === 'completed' ? (
                                          <span className="badge bg-info">Submitted</span>
                                        ) : (
                                          <span className="badge bg-warning">Pending</span>
                                        )}
                                      </td>
                                      <td className="text-end">
                                        {assessment.score ? (
                                          <strong>
                                            {assessment.score.marksObtained}/{assessment.score.totalMarks}
                                            {' '}({assessment.score.percentage}%)
                                          </strong>
                                        ) : (
                                          <span className="text-muted">Not graded</span>
                                        )}
                                      </td>
                                      <td className="text-end">
                                        {assessment.score ? (
                                          <span className={`badge bg-${getGradeColor(assessment.score.grade)}`}>
                                            {assessment.score.grade}
                                          </span>
                                        ) : (
                                          <span className="text-muted">-</span>
                                        )}
                                      </td>
                                      <td>
                                        {assessment.score?.comments ? (
                                          <small className="text-muted">
                                            {assessment.score.comments.substring(0, 50)}
                                            {assessment.score.comments.length > 50 && '...'}
                                          </small>
                                        ) : (
                                          <span className="text-muted">-</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Insights Section */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Strengths</h6>
            </div>
            <div className="card-body">
              {performances.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {performances
                    .filter(p => p.overallPercentage >= 80)
                    .map(p => (
                      <li key={p.courseId} className="mb-2">
                        <i className="fa fa-check-circle text-success me-2"></i>
                        <strong>{p.courseName}</strong> - {Math.round(p.overallPercentage)}%
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">No data yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Needs Attention</h6>
            </div>
            <div className="card-body">
              {performances.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {performances
                    .filter(p => p.overallPercentage < 70)
                    .map(p => (
                      <li key={p.courseId} className="mb-2">
                        <i className="fa fa-exclamation-circle text-warning me-2"></i>
                        <strong>{p.courseName}</strong> - {Math.round(p.overallPercentage)}%
                      </li>
                    ))}
                  {performances.filter(p => p.overallPercentage < 70).length === 0 && (
                    <li className="text-success">All courses performing well!</li>
                  )}
                </ul>
              ) : (
                <p className="text-muted mb-0">No data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildPerformance;

