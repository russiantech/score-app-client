// src/pages/parent/ParentDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useParentChildren } from '@/hooks/useParentChild';
import { useParentStats } from '@/hooks/useStats';
import { getFullName, getGradeColor } from '@/utils/helpers';
import Preloader from '@/components/shared/Preloader';

const ParentDashboard: React.FC = () => {
  const { auth } = useAuth();
  const { data: stats, loading: statsLoading } = useParentStats(auth?.user?.id || '');
  const { data: children, loading: childrenLoading } = useParentChildren(auth?.user?.id || '');

  const loading = statsLoading || childrenLoading;

  if (loading) {
    return (
    
      <Preloader />
      
    );
  }

  return (
    <div className="parent-dashboard">
      {/* Header */}
      <div className="title-bar mb-4">
        <h5 className="title">Parent Dashboard</h5>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center course-card">
            <div className="card-body">
              <div className="mb-2">
                <i className="fa fa-users fa-2x text-success"></i>
              </div>
              <h3 className="mb-0">{stats?.totalChildren || 0}</h3>
              <p className="text-muted mb-0">My Children</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center course-card">
            <div className="card-body">
              <div className="mb-2">
                <i className="fa fa-book fa-2x text-primary"></i>
              </div>
              <h3 className="mb-0">{stats?.totalCourses || 0}</h3>
              <p className="text-muted mb-0">Total Courses</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center course-card">
            <div className="card-body">
              <div className="mb-2">
                <i className="fa fa-chart-line fa-2x text-info"></i>
              </div>
              <h3 className="mb-0">{stats?.averagePerformance || 0}%</h3>
              <p className="text-muted mb-0">Avg Performance</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center course-card">
            <div className="card-body">
              <div className="mb-2">
                <i className="fa fa-bell fa-2x text-warning"></i>
              </div>
              <h3 className="mb-0">{stats?.upcomingAssessments || 0}</h3>
              <p className="text-muted mb-0">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Children Cards */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">My Children</h6>
          <Link to="/parent/children" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        <div className="card-body">
          {children && children.length > 0 ? (
            <div className="row">
              {children.map(child => (
                <div key={child.id} className="col-md-6 mb-3">
                  <div className="card course-card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-start mb-3">
                        <div className="me-3">
                          <div 
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}
                          >
                            {child.names?.charAt(0) || ''}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{getFullName(child)}</h6>
                          <p className="text-muted small mb-0">{child.email}</p>
                        </div>
                      </div>
                      
                      <div className="row text-center mb-3">
                        <div className="col-4">
                          <div className="border-end">
                            <strong className="d-block text-primary">{child.totalCourses || 0}</strong>
                            <small className="text-muted">Courses</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="border-end">
                            <strong className="d-block text-success">{child.overallPerformance || 0}%</strong>
                            <small className="text-muted">Avg</small>
                          </div>
                        </div>
                        <div className="col-4">
                          {child.averageGrade ? (
                            <div>
                              <span className={`badge bg-${getGradeColor(child.averageGrade)}`}>
                                {child.averageGrade}
                              </span>
                              <small className="d-block text-muted">Grade</small>
                            </div>
                          ) : (
                            <div>
                              <strong className="d-block">-</strong>
                              <small className="text-muted">Grade</small>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Link 
                        to={`/parent/children/${child.id}/performance`} 
                        className="btn btn-sm btn-success w-100"
                      >
                        <i className="fa fa-chart-line me-1"></i>
                        View Performance
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="fa fa-users fa-3x mb-3"></i>
              <p>No children linked to your account yet.</p>
              <p className="small">Please contact an administrator to link your children.</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights & Alerts */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fa fa-trophy me-2 text-warning"></i>
                High Performers
              </h6>
            </div>
            <div className="card-body">
              {stats?.childrenWithHighGrades ? (
                <div className="alert alert-success mb-0">
                  <i className="fa fa-star me-2"></i>
                  <strong>{stats.childrenWithHighGrades}</strong> of your children are performing excellently (A or B+ grades).
                </div>
              ) : (
                <p className="text-muted mb-0">
                  No performance data available yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fa fa-exclamation-triangle me-2 text-warning"></i>
                Needs Attention
              </h6>
            </div>
            <div className="card-body">
              {stats?.childrenNeedingAttention ? (
                <div className="alert alert-warning mb-0">
                  <i className="fa fa-info-circle me-2"></i>
                  <strong>{stats.childrenNeedingAttention}</strong> child(ren) need additional support (below C grade).
                  <Link to="/parent/children" className="alert-link ms-2">
                    Review →
                  </Link>
                </div>
              ) : (
                <p className="text-muted mb-0">
                  <i className="fa fa-check-circle text-success me-2"></i>
                  All children are performing well!
                </p>
              )}

              {stats?.upcomingAssessments ? (
                <div className="alert alert-info mt-3 mb-0">
                  <i className="fa fa-calendar me-2"></i>
                  <strong>{stats.upcomingAssessments}</strong> upcoming assessments across all children.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      {stats?.recentAchievements ? (
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">
              <i className="fa fa-medal me-2 text-warning"></i>
              Recent Achievements
            </h6>
          </div>
          <div className="card-body">
            <div className="alert alert-info mb-0">
              <i className="fa fa-trophy me-2"></i>
              Your children achieved <strong>{stats.recentAchievements}</strong> excellent scores this week!
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ParentDashboard;
