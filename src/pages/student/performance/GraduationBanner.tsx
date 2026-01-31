// status display

// Graduation Status Banner - Safe with error handling
// src/pages/student/performance/GraduationBanner.tsx

import React from 'react';
import type { GraduationStatus } from '@/hooks/usePerformance';

interface GraduationBannerProps {
  status: GraduationStatus;
}

export const GraduationBanner: React.FC<GraduationBannerProps> = ({ status }) => {
  // Safe access with defaults
  const isQualified = status?.qualified ?? false;
  const statusMessage = status?.message || 'Graduation status unavailable';
  const criteria = status?.criteria || { min_average: 50, min_attendance: 75, min_completion: 80 };
  const current = status?.current || { average: 0, attendance: 0, completion: 0 };
  const criteriaMet = status?.criteria_met || { 
    academic_performance: false, 
    attendance: false, 
    completion: false 
  };
  const recommendations = status?.recommendations || [];

  const alertClass = isQualified ? 'alert-success' : 'alert-warning';
  const icon = isQualified ? 'fa-check-circle' : 'fa-exclamation-triangle';

  // Calculate safe progress percentages
  const academicProgress = Math.min((current.average / criteria.min_average) * 100, 100);
  const attendanceProgress = Math.min((current.attendance / criteria.min_attendance) * 100, 100);
  const completionProgress = Math.min((current.completion / criteria.min_completion) * 100, 100);

  return (
    <div className={`alert ${alertClass} border-0 shadow-sm mb-4`}>
      <div className="d-flex align-items-start gap-2 gap-md-3">
        <i className={`fa ${icon} fa-2x mt-1`} />
        <div className="flex-grow-1">
          <h5 className="alert-heading mb-2">
            {isQualified ? '🎓 Graduation Eligible!' : '📋 Graduation Requirements'}
          </h5>
          <p className="mb-3">{statusMessage}</p>
          
          {/* Requirements Progress - Stack on mobile */}
          <div className="row g-3 mb-3">
            {/* Academic Performance */}
            <div className="col-12 col-md-12">
              <div className="d-flex align-items-center gap-2">
                <i className={`fa fa-graduation-cap ${criteriaMet.academic_performance ? 'text-success' : 'text-danger'}`} />
                <div className="flex-grow-1">
                  <small className="d-block text-muted mb-1">Academic Performance</small>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${criteriaMet.academic_performance ? 'bg-success' : 'bg-danger'}`}
                      style={{ width: `${academicProgress}%` }}
                      role="progressbar"
                      aria-valuenow={academicProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <small className="text-muted">
                    {current.average.toFixed(1)}% / {criteria.min_average}%
                  </small>
                </div>
              </div>
            </div>
            
            {/* Attendance */}
            <div className="col-12 col-md-12">
              <div className="d-flex align-items-center gap-2">
                <i className={`fa fa-calendar-check ${criteriaMet.attendance ? 'text-success' : 'text-danger'}`} />
                <div className="flex-grow-1">
                  <small className="d-block text-muted mb-1">Attendance Rate</small>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${criteriaMet.attendance ? 'bg-success' : 'bg-danger'}`}
                      style={{ width: `${attendanceProgress}%` }}
                      role="progressbar"
                      aria-valuenow={attendanceProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <small className="text-muted">
                    {current.attendance.toFixed(1)}% / {criteria.min_attendance}%
                  </small>
                </div>
              </div>
            </div>
            
            {/* Completion */}
            <div className="col-12 col-md-12">
              <div className="d-flex align-items-center gap-2">
                <i className={`fa fa-tasks ${criteriaMet.completion ? 'text-success' : 'text-danger'}`} />
                <div className="flex-grow-1">
                  <small className="d-block text-muted mb-1">Assessment Completion</small>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${criteriaMet.completion ? 'bg-success' : 'bg-danger'}`}
                      style={{ width: `${completionProgress}%` }}
                      role="progressbar"
                      aria-valuenow={completionProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <small className="text-muted">
                    {current.completion.toFixed(1)}% / {criteria.min_completion}%
                  </small>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-3">
              <strong className="d-block mb-2">
                {isQualified ? '✨ Keep it up:' : '🎯 Action Items:'}
              </strong>
              <ul className="mb-0 ps-3 small">
                {recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};