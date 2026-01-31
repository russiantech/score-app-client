
// v7 - Professional, Responsive, Pattern-Aligned with ManageEnrollments
import { useState, useEffect, useCallback } from 'react';
import CourseService from '@/services/courses/CourseService';
import { useCourseModal } from '@/context/CourseModalContext';
import toast from 'react-hot-toast';
import type { Course, CourseFilters, CourseStats } from '@/types/course';
import type { User } from '@/types/auth';
import { UserService } from '@/services/users/UserService';
import '@/styles/admin/ManageCourse.css';
import StatCard from '@/components/cards/StatCards';
import { Button } from '@/components/buttons/Button';
import { Link } from 'react-router-dom';

// ============================================================================
// REUSABLE COMPONENTS (DRY Principle)
// ============================================================================

interface FilterBadgeProps {
  children: React.ReactNode;
  onRemove: () => void;
  icon?: string;
  color?: string;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ children, onRemove, icon, color = 'primary' }) => (
  <span className={`badge bg-${color} rounded-pill d-inline-flex align-items-center`}>
    {icon && <i className={`${icon} me-1`} />}
    <span className="text-truncate" style={{ maxWidth: '150px' }}>
      {children}
    </span>
    <button
      type="button"
      className="btn-close btn-close-white ms-2"
      style={{ fontSize: '0.5rem', padding: '0.25rem' }}
      onClick={onRemove}
      aria-label="Remove filter"
    />
  </span>
);

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  small?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  small = false
}) => (
  <div className={`text-center py-${small ? '4' : '5'}`}>
    <i className={`${icon} ${small ? 'fa-2x' : 'fa-3x'} text-muted mb-3`} />
    <h5 className={small ? 'h6' : ''}>{title}</h5>
    <p className={`text-muted ${small ? 'small' : ''} mb-3`}>{description}</p>
    {actionLabel && onAction && (
      <Button
        variant="outline-primary"
        size={small ? 'sm' : 'md'}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    )}
  </div>
);

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  loading
}) => (
  <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap gap-2">
    <Button
      variant="outline-secondary"
      size="sm"
      icon="fa fa-chevron-left"
      disabled={!hasPrevPage || loading}
      onClick={() => onPageChange(page - 1)}
      className="order-1 order-md-1"
    >
      <span className="d-none d-sm-inline">Previous</span>
    </Button>

    <span className="small text-muted text-center order-3 order-md-2 w-100 w-md-auto">
      Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      {totalPages > 10 && (
        <div className="d-inline-block ms-2">
          <input
            type="number"
            className="form-control form-control-sm d-inline-block"
            style={{ width: '60px' }}
            min={1}
            max={totalPages}
            value={page}
            onChange={(e) => {
              const newPage = parseInt(e.target.value);
              if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
                onPageChange(newPage);
              }
            }}
            disabled={loading}
          />
        </div>
      )}
    </span>

    <Button
      variant="outline-secondary"
      size="sm"
      disabled={!hasNextPage || loading}
      onClick={() => onPageChange(page + 1)}
      className="order-2 order-md-3"
    >
      <span className="d-none d-sm-inline">Next</span>
      <i className="fa fa-chevron-right ms-2" />
    </Button>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ManageCourses: React.FC = () => {
  const { openCreateModal, openEditModal, refreshTrigger } = useCourseModal();

  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterTutor, setFilterTutor] = useState<string>('all');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus, filterTutor]);

  // Fetch initial data (tutors)
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const tutorsResponse = await UserService.getAll({ role: 'tutor' });
      setTutors(tutorsResponse.data?.users || tutorsResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
      toast.error('Failed to load tutors');
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch courses when dependencies change
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const params: CourseFilters = {
        page,
        page_size: pageSize,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        tutor_id: filterTutor !== 'all' ? filterTutor : undefined,
        search: searchTerm || undefined,
        include_relations: true, // Always include relations for list view
      };

      const coursesResponse = await CourseService.getAll(params);

      console.log('API Response:', coursesResponse);

      // Handle response structure
      const coursesData = coursesResponse.data?.courses || coursesResponse.data || [];
      const metaData = coursesResponse.data?.meta || coursesResponse.data?.page_meta || {};

      setCourses(Array.isArray(coursesData) ? coursesData : []);

      // Get total from meta
      const totalCount = metaData.total ?? metaData.total_count ?? coursesData.length;
      setTotal(totalCount);

      // Calculate total pages
      const pages = metaData.total_pages ?? Math.ceil(totalCount / pageSize);
      setTotalPages(pages);

      console.log('Parsed data:', {
        courses: coursesData.length,
        total: totalCount,
        pages,
        currentPage: page
      });
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load courses');
      setCourses([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterStatus, filterTutor, pageSize]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Refresh when modal context triggers
  useEffect(() => {
    if (refreshTrigger) {
      refreshData();
    }
  }, [refreshTrigger]);

  const refreshData = () => {
    fetchCourses();
    fetchInitialData();
  };

  // ============================================================================
  // STATS CALCULATION
  // ============================================================================

  const calculateStats = (): CourseStats => {
    return {
      total: total,
      active: courses.filter(c => c.is_active).length,
      inactive: courses.filter(c => !c.is_active).length,
      totalStudents: courses.reduce((a, c) => a + (c.enrolled_count || 0), 0),
      completedLessons: 0,
      totalLessons: 0,
      averageProgress: 0,
    };
  };

  const stats = calculateStats();

  // ============================================================================
  // FILTERING
  // ============================================================================

  const hasActiveFilters = searchTerm || filterStatus !== 'all' || filterTutor !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterTutor('all');
    setPage(1);
  };

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleToggleStatus = async (course: Course) => {
    try {
      const newIsActive = !course.is_active;
      await CourseService.update(course.id, { is_active: newIsActive });
      toast.success(`Course ${newIsActive ? 'activated' : 'deactivated'} successfully`);
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update course status');
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      setDeleting(true);
      await CourseService.delete(selectedCourse.id);
      toast.success('Course deleted successfully');

      // If we deleted the last item on the page and it's not page 1, go back a page
      if (courses.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchCourses();
      }

      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const courseLink = (id: string) => `/courses/${id}`;

  const getTutorDisplay = (course: Course) => {
  if (!course.tutors || course.tutors.length === 0) return '—';

  const maxVisible = 2;

  const visibleNames = course.tutors.slice(0, maxVisible).map(t => {
    // 1️⃣ First name from full name
    if (t.names) {
      const first = t.names.trim().split(' ')[0];
      if (first) return first;
    }

    // 2️⃣ Username fallback
    if (t.username) return t.username;

    // 3️⃣ Email prefix fallback
    if (t.email) return t.email.split('@')[0];

    return 'Tutor';
  });

  const remaining = course.tutors.length - maxVisible;

  return remaining > 0
    ? `${visibleNames.join(', ')} +${remaining}`
    : visibleNames.join(', ');
};


  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, total);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading course data...</p>
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
                <h4 className="mb-1">Manage Courses</h4>
                <p className="text-muted mb-0 small">Create and manage all courses</p>
              </div>
              <div className="d-flex gap-2">
                <Button
                  onClick={refreshData}
                  variant="outline-primary"
                  size="sm"
                  icon="fa fa-sync-alt"
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  onClick={openCreateModal}
                  variant="primary"
                  size="sm"
                  icon="fa fa-plus"
                >
                  Add Course
                </Button>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge bg-primary rounded-pill">
                <i className="fa fa-book me-1" /> {total} Total
              </span>
              <span className="badge bg-success rounded-pill">
                <i className="fa fa-check-circle me-1" /> {stats.active} Active
              </span>
              <span className="badge bg-secondary rounded-pill">
                <i className="fa fa-pause-circle me-1" /> {stats.inactive} Inactive
              </span>
              <span className="badge bg-info rounded-pill">
                <i className="fa fa-users me-1" /> {stats.totalStudents} Students
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <StatCard
              value={stats.total}
              label="Total Courses"
              icon="fa fa-book"
              bgColor="bg-primary"
              loading={loading && !courses.length}
            />
            <StatCard
              value={stats.active}
              label="Active Courses"
              icon="fa fa-check-circle"
              bgColor="bg-success"
              loading={loading && !courses.length}
            />
            <StatCard
              value={stats.inactive}
              label="Inactive Courses"
              icon="fa fa-pause-circle"
              bgColor="bg-secondary"
              loading={loading && !courses.length}
            />
          </div>

          {/* Filters */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <h6 className="mb-0 d-flex align-items-center">
                <i className="fa fa-filter me-2" />
                Filters & Search
              </h6>
              {hasActiveFilters && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="fa fa-times me-1" />
                  Clear All
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="row g-3 align-items-end">
                {/* Search */}
                <div className="col-12 col-lg-12">
                  <label className="form-label small fw-semibold text-muted mb-1">Search</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fa fa-search text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search by title or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearchTerm('')}
                        aria-label="Clear search"
                      >
                        <i className="fa fa-times" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="col-12 col-sm-6 col-lg-6">
                  <label className="form-label small fw-semibold text-muted mb-1">Status</label>
                  <select
                    className="form-select w-100 border"
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')
                    }
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>

                {/* Tutor Filter */}
                <div className="col-12 col-sm-6 col-lg-6">
                  <label className="form-label small fw-semibold text-muted mb-1">Tutor</label>
                  <select
                    className="form-select w-100 border"
                    value={filterTutor}
                    onChange={(e) => setFilterTutor(e.target.value)}
                  >
                    <option value="all">All Tutors</option>
                    {tutors.map((tutor) => (
                      <option key={tutor.id} value={String(tutor.id)}>
                        {tutor.names || tutor.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="small text-muted">Active filters:</span>

                    {searchTerm && (
                      <FilterBadge icon="fa fa-search" onRemove={() => setSearchTerm('')}>
                        Search: {searchTerm}
                      </FilterBadge>
                    )}

                    {filterStatus !== 'all' && (
                      <FilterBadge icon="fa fa-filter" onRemove={() => setFilterStatus('all')} color="info">
                        Status: {filterStatus}
                      </FilterBadge>
                    )}

                    {filterTutor !== 'all' && (
                      <FilterBadge icon="fa fa-user" onRemove={() => setFilterTutor('all')} color="success">
                        Tutor: {tutors.find(t => String(t.id) === filterTutor)?.names || 'Selected'}
                      </FilterBadge>
                    )}
                  </div>
                </div>
              )}

              {/* Results Count */}
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                  <p className="mb-0 small text-muted">
                    {total > 0 ? (
                      <>
                        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
                        <strong>{total}</strong> courses
                        {totalPages > 1 && (
                          <span className="ms-2">
                            (Page <strong>{page}</strong> of <strong>{totalPages}</strong>)
                          </span>
                        )}
                      </>
                    ) : (
                      'No courses found'
                    )}
                  </p>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-check-circle text-success me-1" />
                      {courses.filter(c => c.is_active).length} Active
                    </span>
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-pause-circle text-secondary me-1" />
                      {courses.filter(c => !c.is_active).length} Inactive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="card shadow-sm">
            <div className="card-header bg-light py-3">
              <h6 className="mb-0 d-flex align-items-center">
                <i className="fa fa-list me-2" />
                All Courses ({total})
              </h6>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" />
                  <p className="text-muted mt-2">Loading courses...</p>
                </div>
              ) : courses.length === 0 ? (
                <EmptyState
                  icon="fa fa-book"
                  title="No courses found"
                  description={
                    hasActiveFilters
                      ? 'Try adjusting your filters'
                      : 'Create your first course to get started'
                  }
                  actionLabel={hasActiveFilters ? 'Clear Filters' : 'Add Course'}
                  onAction={hasActiveFilters ? clearFilters : openCreateModal}
                />
              ) : (
                <>
                  {/* Mobile Cards View */}
                  <div className="d-block d-lg-none">
                    {courses.map(course => (
                      <div key={course.id} className="border-bottom p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-bold text-primary">{course.code}</div>
                            {/* <div className="fw-semibold">{course.title}</div> */}
                            <Link to={courseLink(course.id)}
                              className="fw-semibold text-dark text-decoration-none"
                            >
                              {course.title}
                            </Link>

                            <small className="text-muted">
                              {course.description?.slice(0, 60) || 'No description'}
                              {course.description && course.description.length > 60 && '...'}
                            </small>
                          </div>
                          <span
                            className={`badge bg-${
                              course.is_active ? 'success' : 'secondary'
                            }`}
                          >
                            {course.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex gap-3">
                            <span className="badge bg-light text-dark">
                              <i className="fa fa-users me-1" />
                              {getTutorDisplay(course)}
                            </span>
                            <span className="badge bg-info">
                              <i className="fa fa-book me-1" />
                              {course.modules_count ?? 0}
                            </span>
                            <span className="badge bg-primary">
                              <i className="fa fa-graduation-cap me-1" />
                              {course.enrolled_count ?? 0}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            icon="fa fa-pencil"
                            onClick={() => openEditModal(course)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            icon={`fa fa-${course.is_active ? 'pause' : 'play'}`}
                            onClick={() => handleToggleStatus(course)}
                          >
                            {course.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            icon="fa fa-trash"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="d-none d-lg-block">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0 ps-4">Code</th>
                            <th className="border-0">Course</th>
                            <th className="border-0">Tutors</th>
                            <th className="text-center border-0">Modules</th>
                            <th className="text-center border-0">Students</th>
                            <th className="text-center border-0">Status</th>
                            <th className="text-end border-0 pe-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.map(course => (
                            <tr key={course.id}>
                              {/* <td className="text-primary fw-bold ps-4">{course.code}</td> */}
                              <td className="ps-4">
                              <Link
                                to={courseLink(course.id)}
                                className="fw-bold text-primary text-decoration-none badge bg-light"
                              >
                                {course.code}
                              </Link>
                            </td>

                              <td>
                                <div className="d-flex flex-column">
                                  {/* <strong>{course.title}</strong> */}
                                  <Link to={courseLink(course.id)}
                                  className="fw-semibold text-dark text-decoration-none"
                                >
                                  {course.title}
                                </Link>

                                  <small className="text-muted">
                                    {course.description?.slice(0, 60) || 'No description'}
                                    {course.description && course.description.length > 60 && '...'}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">
                                  {getTutorDisplay(course)}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-info">
                                  {course.modules_count ?? 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-primary">
                                  {course.enrolled_count ?? 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <span
                                  className={`badge bg-${
                                    course.is_active ? 'success' : 'secondary'
                                  }`}
                                >
                                  {course.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="text-end pe-4">
                                <div className="btn-group btn-group-sm gap-1" role="group">
                                  <button
                                    className="btn btn-outline-primary rounded-2"
                                    onClick={() => openEditModal(course)}
                                    title="Edit course"
                                  >
                                    <i className="fa fa-pencil" />
                                  </button>
                                  <button
                                    className="btn btn-outline-warning rounded-2"
                                    onClick={() => handleToggleStatus(course)}
                                    title={course.is_active ? 'Deactivate' : 'Activate'}
                                  >
                                    <i className={`fa fa-${course.is_active ? 'pause' : 'play'}`} />
                                  </button>
                                  <button
                                    className="btn btn-outline-danger rounded-2"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      setShowDeleteModal(true);
                                    }}
                                    title="Delete course"
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      hasNextPage={hasNextPage}
                      hasPrevPage={hasPrevPage}
                      onPageChange={setPage}
                      loading={loading}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCourse && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down"
            style={{ maxHeight: '100dvh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  <i className="fa fa-trash me-2 text-danger" />
                  Confirm Delete
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="alert alert-danger mb-4">
                  <i className="fa fa-exclamation-triangle me-2" />
                  This action cannot be undone. All course data will be permanently deleted.
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">Course Details</h6>
                    <div className="mb-3">
                      <div className="fw-bold text-primary fs-5">{selectedCourse.code}</div>
                      <div className="fw-semibold">{selectedCourse.title}</div>
                      <p className="text-muted small mb-0 mt-2">
                        {selectedCourse.description || 'No description'}
                      </p>
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="small text-muted">Modules</div>
                        <div className="fw-bold">{selectedCourse.modules_count ?? 0}</div>
                      </div>
                      <div className="col-6">
                        <div className="small text-muted">Enrolled Students</div>
                        <div className="fw-bold">{selectedCourse.enrolled_count ?? 0}</div>
                      </div>
                      <div className="col-6">
                        <div className="small text-muted">Status</div>
                        <span
                          className={`badge bg-${
                            selectedCourse.is_active ? 'success' : 'secondary'
                          }`}
                        >
                          {selectedCourse.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="col-6">
                        <div className="small text-muted">Tutors</div>
                        <div className="fw-bold">{selectedCourse.tutors?.length ?? 0}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning mb-0">
                  <div className="d-flex">
                    <i className="fa fa-info-circle mt-1 me-2 flex-shrink-0" />
                    <div>
                      <strong>Warning:</strong> Deleting this course will:
                      <ul className="mb-0 mt-2">
                        <li>Remove all course modules and lessons</li>
                        <li>Unenroll all students from this course</li>
                        <li>Delete all student progress data</li>
                        <li>Remove course assignments and grades</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  size="md"
                  className="mb-2 mb-md-0"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteCourse}
                  loading={deleting}
                  icon="fa fa-trash"
                  size="md"
                >
                  {deleting ? 'Deleting...' : 'Delete Course'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses