// v3
// ============================================================================
// COMPONENT: AdminDashboard.tsx
// Modern, Responsive Admin Dashboard with Backend Integration
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourseModal } from '@/context/CourseModalContext';
import { useUserModal } from '@/context/UserModalContext';
import type { AdminStats, RecentActivity } from '@/types/stats';
import AdminService from '@/services/admin/AdminService';
import { toCamelCase } from '@/utils/case';
import StatCard from '@/components/cards/StatCards';
import Preloader from '@/components/shared/Preloader';

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================


interface MiniStatCardProps {
  icon: string;
  iconColor: string;
  value: number | string;
  label: string;
  warning?: { text: string; count: number };
  info?: { text: string; count: number };
}

const MiniStatCard: React.FC<MiniStatCardProps> = ({
  icon,
  iconColor,
  value,
  label,
  warning,
  info
}) => (
  <div className="col-12 col-md-6 mb-3">
    <div className="d-flex align-items-center p-3 bg-light rounded-3 h-100">
      <div className="me-3 flex-shrink-0">
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{ 
            width: '56px', 
            height: '56px',
            background: `${iconColor}15`
          }}
        >
          <i className={`fa ${icon} fa-lg ${iconColor}`}></i>
        </div>
      </div>
      <div className="flex-grow-1 min-w-0">
        <h5 className="mb-0 fw-bold">{value}</h5>
        <small className="text-muted text-truncate d-block">{label}</small>
        {warning && warning.count > 0 && (
          <div className="mt-1">
            <small className="text-warning d-block text-truncate">
              <i className="fa fa-exclamation-triangle me-1"></i>
              {warning.count} {warning.text}
            </small>
          </div>
        )}
        {info && info.count > 0 && (
          <div className="mt-1">
            <small className="text-info d-block text-truncate">
              <i className="fa fa-arrow-up me-1"></i>
              {info.count} {info.text}
            </small>
          </div>
        )}
      </div>
    </div>
  </div>
);


interface AlertBannerProps {
  stats: AdminStats;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ stats }) => {
  if (stats.coursesWithoutTutors === 0 && stats.studentsWithoutParents === 0) {
    return null;
  }

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="alert alert-warning border-0 shadow-sm mb-0">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
            <div className="flex-shrink-0">
              <i className="fa fa-exclamation-triangle fa-2x"></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="alert-heading mb-1 fw-bold">Attention Required</h6>
              <div className="d-flex gap-3 flex-wrap small">
                {stats.coursesWithoutTutors > 0 && (
                  <span>
                    <strong>{stats.coursesWithoutTutors}</strong> course{stats.coursesWithoutTutors !== 1 ? 's' : ''} without tutors
                  </span>
                )}
                {stats.studentsWithoutParents > 0 && (
                  <span>
                    <strong>{stats.studentsWithoutParents}</strong> student{stats.studentsWithoutParents !== 1 ? 's' : ''} not linked to parents
                  </span>
                )}
              </div>
            </div>
            <div className="d-flex gap-2 flex-wrap flex-shrink-0">
              {stats.coursesWithoutTutors > 0 && (
                <Link to="/admin/courses" className="btn btn-sm btn-warning">
                  <i className="fa fa-link me-1 d-none d-sm-inline"></i>
                  Link Parents
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AdminDashboard: React.FC = () => {
  const { openCreateModal: openCourseModal, refreshTrigger: courseRefresh } = useCourseModal();
  const { openCreateModal: openUserModal, refreshTrigger: userRefresh } = useUserModal();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static fallback data
  /*
  const staticStats: AdminStats = {
    totalUsers: 245,
    activeUsers: 200,
    totalCourses: 48,
    totalModules: 135,
    totalLessons: 420,
    totalTutors: 32,
    totalStudents: 189,
    totalParents: 40,
    activeCourses: 42,
    inactiveCourses: 6,
    activeStudents: 170,
    activeTutors: 28,
    activeParents: 35,
    inactiveParents: 5,
    recentEnrollments: 23,
    totalEnrollments: 500,
    totalAssessments: 120,
    averageClassSize: 16,
    coursesWithoutTutors: 2,
    studentsWithoutParents: 15,
    };
  */

const staticStats: AdminStats = {
  total: 150,           //  Add this
  active: 120,          //  Add this
  inactive: 30,         // Add this
  totalUsers: 150,
  activeUsers: 120,
  totalCourses: 25,
  totalModules: 75,
  totalLessons: 200,
  totalTutors: 15,
  totalStudents: 100,
  totalParents: 35,
  activeCourses: 20,
  inactiveCourses: 5,
  activeStudents: 90,
  activeTutors: 12,
  activeParents: 30,
  inactiveParents: 5,
  recentEnrollments: 12,
  totalEnrollments: 150,
  totalAssessments: 300,
  averageClassSize: 15,
  coursesWithoutTutors: 2,
  studentsWithoutParents: 10,
};

  const staticActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'enrollment',
      message: 'John Doe enrolled in Full Stack Web Development',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: { id: '1', name: 'John Doe' },
    },
    {
      id: '2',
      type: 'course',
      message: 'New course "Advanced Machine Learning" created',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      user: { id: '2', name: 'Admin User' },
    },
    {
      id: '3',
      type: 'user',
      message: 'Sarah Williams registered as new tutor',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: { id: '3', name: 'Sarah Williams' },
    },
    {
      id: '4',
      type: 'assessment',
      message: 'Python Basics Quiz completed by 25 students',
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      type: 'attendance',
      message: 'Attendance recorded for Web Development class',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    loadDashboardData();
  }, [courseRefresh, userRefresh]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await AdminService.getDashboardOverview();

      // Map backend snake_case to frontend camelCase
      const mappedStats = toCamelCase(res.stats);
      const mappedActivities = res.activities.map(toCamelCase);

      setStats(mappedStats);
      setActivities(mappedActivities);
    } catch (err: any) {
      console.warn('Using static data:', err);
      setStats(staticStats);
      setActivities(staticActivities);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <Preloader />
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-3 p-md-4">
        <div className="alert alert-danger border-0 shadow-sm">
          <div className="d-flex align-items-center">
            <i className="fa fa-exclamation-triangle fa-2x me-3"></i>
            <div>
              <h6 className="alert-heading mb-1">Error Loading Dashboard</h6>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container-fluid p-2 p-md-3 p-lg-4">
        {/* Header */}
        <div className="mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
            <div>
              <h4 className="mb-1 fw-bold">Admin Dashboard</h4>
              <p className="text-muted mb-0">Welcome to Score Academy Management</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => openUserModal('student')}
              >
                <i className="fa fa-user-plus me-1 d-none d-sm-inline"></i>
                <span className="d-none d-sm-inline">Add User</span>
                <span className="d-inline d-sm-none">User</span>
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={() => openCourseModal()}
              >
                <i className="fa fa-plus me-1 d-none d-sm-inline"></i>
                <span className="d-none d-sm-inline">New Course</span>
                <span className="d-inline d-sm-none">Course</span>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={loadDashboardData}
              >
                <i className="fa fa-sync-alt"></i>
                <span className="d-none d-sm-inline ms-1">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="row g-3 mb-4">
          <StatCard
            icon="fa fa-users"
            bgColor="bg-primary"
            value={stats?.total || 0}
            label="Total Users"
            loading={loading}
          />
          <StatCard
            icon="fa fa-book"
            bgColor="bg-success"
            value={stats?.totalCourses || 0}
            label="Total Courses"
            loading={loading}
          />
          <StatCard
            icon="fa fa-chalkboard-teacher"
            bgColor="bg-info"
            value={stats?.totalTutors || 0}
            label="Tutors"
            loading={loading}
          />
          <StatCard
            icon="fa fa-user-graduate"
            bgColor="bg-warning"
            value={stats?.totalStudents || 0}
            label="Students"
            loading={loading}
          />
        </div>


        {/* Secondary Stats */}
        <div className="row mb-4">
          <div className="col-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3 text-center">
                <div className="mb-2">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '48px', 
                      height: '48px',
                      background: '#667eea15'
                    }}
                  >
                    <i className="fa fa-layer-group text-primary"></i>
                  </div>
                </div>
                <h5 className="mb-0 fw-bold">{stats?.totalModules || 0}</h5>
                <small className="text-muted">Total Modules</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3 text-center">
                <div className="mb-2">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '48px', 
                      height: '48px',
                      background: '#10b98115'
                    }}
                  >
                    <i className="fa fa-list text-success"></i>
                  </div>
                </div>
                <h5 className="mb-0 fw-bold">{stats?.totalLessons || 0}</h5>
                <small className="text-muted">Total Lessons</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3 text-center">
                <div className="mb-2">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '48px', 
                      height: '48px',
                      background: '#0dcaf015'
                    }}
                  >
                    <i className="fa fa-clipboard-list text-info"></i>
                  </div>
                </div>
                <h5 className="mb-0 fw-bold">{stats?.totalAssessments || 0}</h5>
                <small className="text-muted">Assessments</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3 text-center">
                <div className="mb-2">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '48px', 
                      height: '48px',
                      background: '#ffc10715'
                    }}
                  >
                    <i className="fa fa-user-check text-warning"></i>
                  </div>
                </div>
                <h5 className="mb-0 fw-bold">{stats?.recentEnrollments || 0}</h5>
                <small className="text-muted">New Enrollments</small>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {stats && <AlertBanner stats={stats} />}

        {/* Main Content Row */}
        <div className="row mb-4">
          
          {/* System Overview */}
          <div className="col-12 mb-3 mb-lg-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="mb-0 fw-semibold">
                  <i className="fa fa-chart-line me-2 text-primary"></i>
                  System Overview
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <MiniStatCard
                    icon="fa-graduation-cap"
                    iconColor="text-primary"
                    value={stats?.activeCourses || 0}
                    label="Active Courses"
                    warning={
                      stats?.coursesWithoutTutors 
                        ? { text: 'without tutor', count: stats.coursesWithoutTutors }
                        : undefined
                    }
                  />
                  <MiniStatCard
                    icon="fa-user-check"
                    iconColor="text-success"
                    value={stats?.totalEnrollments || 0}
                    label="Total Enrollments"
                    info={
                      stats?.recentEnrollments
                        ? { text: 'last 7 days', count: stats.recentEnrollments }
                        : undefined
                    }
                  />
                  <MiniStatCard
                    icon="fa-users"
                    iconColor="text-info"
                    value={stats?.averageClassSize || 0}
                    label="Avg. Class Size"
                  />
                  <MiniStatCard
                    icon="fa-user-friends"
                    iconColor="text-warning"
                    value={stats?.totalParents || 0}
                    label="Parent Accounts"
                    warning={
                      stats?.studentsWithoutParents
                        ? { text: 'students unlinked', count: stats.studentsWithoutParents }
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
        
      </div>

    </div>
  );
};

export default AdminDashboard;
