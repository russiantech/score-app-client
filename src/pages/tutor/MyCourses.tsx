
// v4
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { TutorService } from "@/services/users/tutor";
import { Button, EmptyState } from '@/components/buttons/Button'
import { StatCard } from '@/components/cards/StatCards'
import toast from 'react-hot-toast';
import type { Course } from "@/types/course";

export const TutorMyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await TutorService.getMyCourses();
      setCourses(Array.isArray(response) ? response : response.data?.courses || []);
      console.log(courses, response.data);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (course: Course) => {
    return course.is_active ? (
      <span className="badge bg-success">Active</span>
    ) : (
      <span className="badge bg-secondary">Inactive</span>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-content bg-white p-2 p-md-3 p-lg-4">
        <div className="container-fluid px-0 px-md-3">
          {/* Header */}
          <div className="mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
              <div>
                <h4 className="mb-1">My Courses</h4>
                <p className="text-muted mb-0 small">View and manage your assigned courses</p>
              </div>
              <Button onClick={loadCourses} variant="outline-primary" icon="fa fa-sync-alt" loading={loading}>
                Refresh
              </Button>
            </div>

            {/* Stats */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge bg-primary rounded-pill">
                <i className="fa fa-book me-1" /> {courses.length} Total
              </span>
              <span className="badge bg-success rounded-pill">
                <i className="fa fa-check-circle me-1" /> {courses.filter(c => c.is_active).length} Active
              </span>
              <span className="badge bg-info rounded-pill">
                <i className="fa fa-users me-1" /> {courses.reduce((sum, c) => sum + (c.enrolled_count || 0), 0)} Students
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <StatCard value={courses.length} label="Total Courses" icon="fa fa-book" bgColor="bg-primary" />
            <StatCard value={courses.filter(c => c.is_active).length} label="Active Courses" icon="fa fa-check-circle" bgColor="bg-success" />
            <StatCard value={courses.reduce((sum, c) => sum + (c.enrolled_count || 0), 0)} label="Total Students" icon="fa fa-users" bgColor="bg-info" />
            {/* <StatCard value={courses.reduce((sum, c) => sum + (c.modules_count || 0), 0)} label="Total Modules" icon="fa fa-layer-group" bgColor="bg-warning" /> */}
          </div>

          {/* Courses */}
          <div className="card shadow-sm">
            <div className="card-header bg-light py-3">
              <h6 className="mb-0 d-flex align-items-center">
                <i className="fa fa-list me-2" />
                All Courses ({courses.length})
              </h6>
            </div>
            <div className="card-body p-0">
              {courses.length === 0 ? (
                <EmptyState
                  icon="fa fa-book"
                  title="No courses assigned"
                  description="You don't have any courses assigned yet. Please contact your administrator." actionLabel={undefined} onAction={undefined}                />
              ) : (
                <>
                  {/* Mobile View */}
                  <div className="d-block d-lg-none">
                    {courses.map(course => (
                      <div key={course.id} className="border-bottom p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-bold text-primary">{course.code}</div>
                            <div className="fw-semibold">{course.title}</div>
                          </div>
                          {getStatusBadge(course)}
                        </div>
                        <div className="d-flex gap-2 mb-3">
                          <span className="badge bg-info"><i className="fa fa-book me-1" />{course.modules_count || 0}</span>
                          <span className="badge bg-primary"><i className="fa fa-users me-1" />{course.enrolled_count || 0}</span>
                        </div>
                        <Button variant="primary" size="sm" onClick={() => navigate(`/courses/${course.id}`)}>
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View */}
                  <div className="d-none d-lg-block">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0 ps-4">Code</th>
                            <th className="border-0">Course</th>
                            {/* <th className="text-center border-0">Modules</th> */}
                            <th className="text-center border-0">Students</th>
                            <th className="text-center border-0">Status</th>
                            <th className="text-end border-0 pe-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.map(course => (
                            <tr key={course.id}>
                              <td className="text-primary fw-bold ps-4">{course.code}</td>
                              <td>
                                <div className="fw-semibold">{course.title}</div>
                                <small className="text-muted">{course.description?.substring(0, 60) || 'No description'}</small>
                              </td>
                              {/* <td className="text-center">
                                <span className="badge bg-info">{course.modules_count || 0}</span>
                              </td> */}
                              <td className="text-center">
                                <span className="badge bg-primary">{course.enrolled_count || 0}</span>
                              </td>
                              <td className="text-center">{getStatusBadge(course)}</td>
                              <td className="text-end pe-4">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => navigate(`/courses/${course.id}`)}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorMyCourses;