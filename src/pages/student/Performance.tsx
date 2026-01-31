// Student Performance Dashboard - Clean, Simple, Refactored
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePerformance } from '@/hooks/usePerformance';

import { OverviewTab } from '@/pages/student/performance/OverviewTab';
import { CoursesTab } from '@/pages/student/performance/CoursesTab';
import { AttendanceTab } from '@/pages/student//performance/AttendanceTab';
import { GraduationBanner } from '@/pages/student/performance/GraduationBanner';
import Preloader from '@/components/shared/Preloader';

type TabView = 'overview' | 'courses' | 'attendance';

export const StudentPerformance = () => {
  const { auth } = useAuth();
  const {
    performance,
    loading,
    refreshing,
    error,
    refresh,
    exportReport
  } = usePerformance(auth?.user?.id);

  const [activeTab, setActiveTab] = useState<TabView>('overview');

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      await exportReport(format);
    } catch (err: any) {
      alert(err.message || 'Export failed');
    }
  };

  // Loading state
  if (loading) {
    return (
      <Preloader />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="fa fa-exclamation-triangle me-2" />
          {error}
        </div>
        <button className="btn btn-primary" onClick={refresh}>
          <i className="fa fa-refresh me-2" />
          Try Again
        </button>
      </div>
    );
  }

  // No data state
  if (!performance || !performance.courses || performance.courses.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="fa fa-chart-bar fa-3x text-muted mb-3" />
        <h5>No Performance Data</h5>
        <p className="text-muted">You don't have any course enrollments yet.</p>
      </div>
    );
  }

  const { summary, courses, attendance, attendance_details, trends, graduation_status } = performance;

  return (
    <div className="container-fluid py-3 px-2 px-md-4">
      
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="mb-1">My Performance</h3>
          <p className="text-muted mb-0 small">Track your academic progress</p>
        </div>
        
        <div className="d-flex gap-2">
          {/* Export */}
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-secondary dropdown-toggle" 
              data-bs-toggle="dropdown"
              disabled={refreshing}
            >
              <i className="fa fa-download me-1" />
              Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" onClick={() => handleExport('pdf')}>
                  <i className="fa fa-file-pdf me-2 text-danger" />
                  PDF Report
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => handleExport('excel')}>
                  <i className="fa fa-file-excel me-2 text-success" />
                  Excel Report
                </button>
              </li>
            </ul>
          </div>

          {/* Refresh */}
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={refresh}
            disabled={refreshing}
            title="Refresh data"
          >
            <i className={`fa fa-refresh ${refreshing ? 'fa-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Graduation Status */}
      {graduation_status && (
        <GraduationBanner status={graduation_status} />
      )}

      {/* Summary Cards */}
      <div className="row g-2 mb-4">
        {[
          {
            label: 'Courses',
            value: summary?.total_courses || 0,
            icon: 'fa-book',
            color: '#0d6efd'
          },
          {
            label: 'Average',
            value: `${summary?.overall_average || 0}%`,
            icon: 'fa-graduation-cap',
            color: '#20c997'
          },
          {
            label: 'Attendance',
            value: `${attendance?.attendance_rate || 0}%`,
            icon: 'fa-calendar-check',
            color: '#17a2b8'
          },
          {
            label: 'Assessments',
            value: summary?.total_assessments || 0,
            icon: 'fa-tasks',
            color: '#ffc107'
          }
        ].map((item, idx) => (
          <div key={idx} className="col-6 col-md-4 col-lg-3">
            <div
              className="card border h-100"
              style={{ borderColor: item.color }}
            >
              <div className="card-body p-3 text-center">

                {/* Icon Circle */}
                <div
                  className="rounded-circle mx-auto mb-2"
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.2rem'
                  }}
                >
                  <i className={`fa ${item.icon}`} />
                </div>

                {/* Value */}
                <div className="fw-bold text-truncate">
                  {item.value}
                </div>

                {/* Label */}
                <small className="text-muted text-truncate d-block">
                  {item.label}
                </small>

              </div>
            </div>
          </div>
        ))}
      </div>



      {/* View Switch (Pills) */}
      <div className="mb-4">
        <ul className="nav nav-pills gap-2 flex-wrap">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link fw-semibold px-4 py-2 ${
                activeTab === 'overview' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fa fa-chart-line me-2" />
              Overview
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className={`nav-link fw-semibold px-4 py-2 ${
                activeTab === 'courses' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('courses')}
            >
              <i className="fa fa-book me-2" />
              Courses
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className={`nav-link fw-semibold px-4 py-2 ${
                activeTab === 'attendance' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('attendance')}
            >
              <i className="fa fa-calendar-check me-2" />
              Attendance
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          courses={courses}
          summary={summary}
          trends={trends}
        />
      )}

      {activeTab === 'courses' && (
        <CoursesTab courses={courses} />
      )}

      {activeTab === 'attendance' && (
        <AttendanceTab
          attendance={attendance}
          details={attendance_details}
        />
      )}
    </div>
  );
};

export default StudentPerformance;