// (Charts & summary)
// Overview Tab - Clean and Simple
// src/pages/student/performance/OverviewTab.tsx

import React from 'react';
import type { CoursePerformance, PerformanceSummary, PerformanceTrend } from '@/hooks/usePerformance';
import { SimpleBarChart, SimpleTrendChart } from './SimpleCharts';

interface OverviewTabProps {
  courses: CoursePerformance[];
  summary: PerformanceSummary;
  trends: PerformanceTrend[];
}

const getGradeColor = (grade: string): string => {
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'primary';
  if (grade.startsWith('C')) return 'info';
  if (grade.startsWith('D')) return 'warning';
  return 'danger';
};

export const OverviewTab: React.FC<OverviewTabProps> = ({ courses, summary, trends }) => {
  return (
    <>
      {/* Performance Chart */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-semibold">
            <i className="fa fa-chart-bar me-2" />
            Course Performance
          </h6>
        </div>
        <div className="card-body">
          <SimpleBarChart courses={courses} />
        </div>
      </div>

      {/* Trend Chart */}
      {trends && trends.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 py-3">
            <h6 className="mb-0 fw-semibold">
              <i className="fa fa-line-chart me-2" />
              Performance Trend (Last 6 Months)
            </h6>
          </div>
          <div className="card-body">
            <SimpleTrendChart data={trends} />
          </div>
        </div>
      )}

      {/* Grade Distribution */}
      {summary?.grade_distribution && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 py-3">
            <h6 className="mb-0 fw-semibold">
              <i className="fa fa-medal me-2" />
              Grade Distribution
            </h6>
          </div>
          <div className="card-body">
            <GradeDistribution distribution={summary.grade_distribution} />
          </div>
        </div>
      )}

      {/* Course Summary Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-semibold">
            <i className="fa fa-list me-2" />
            Course Summary
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Course</th>
                  <th className="text-center">Grade</th>
                  <th className="text-center">Average</th>
                  <th className="text-center d-none d-md-table-cell">Progress</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.enrollment_id}>
                    <td>
                      <div>
                        <div className="fw-semibold">{course.course.title}</div>
                        <small className="text-muted">{course.course.code}</small>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge bg-${getGradeColor(course.overall_grade)}`}>
                        {course.overall_grade}
                      </span>
                    </td>
                    <td className="text-center">
                      <strong>{course.overall_average}%</strong>
                    </td>
                    <td className="text-center d-none d-md-table-cell">
                      <small className="text-muted">
                        {course.completed_assessments}/{course.total_assessments}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

// Grade Distribution Component
interface GradeDistributionProps {
  distribution: { [key: string]: number };
}

const GradeDistribution: React.FC<GradeDistributionProps> = ({ distribution }) => {
  const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
  const colors: { [key: string]: string } = {
    'A+': '#28a745', 'A': '#20c997', 'B+': '#007bff', 'B': '#17a2b8',
    'C+': '#6610f2', 'C': '#6c757d', 'D+': '#fd7e14', 'D': '#ffc107', 'F': '#dc3545'
  };

  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return (
      <div className="text-center py-4 text-muted">
        <p>No grades recorded yet</p>
      </div>
    );
  }

  return (
    <div className="row g-2">
      {grades.map(grade => {
        const count = distribution[grade] || 0;
        if (count === 0) return null;
        
        const percentage = (count / total) * 100;
        
        return (
          <div key={grade} className="col-6 col-md-4 col-lg-3">
            <div className="card border" style={{ borderColor: colors[grade] }}>
              <div className="card-body p-3 text-center">
                <div 
                  className="rounded-circle mx-auto mb-2"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: colors[grade],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {grade}
                </div>
                <div className="fw-bold">{count} course{count !== 1 ? 's' : ''}</div>
                <small className="text-muted">{percentage.toFixed(0)}%</small>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewTab;
