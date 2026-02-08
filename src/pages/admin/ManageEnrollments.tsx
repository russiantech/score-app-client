// RESPONSIVE v4
// v4 - Fully responsive and professional
import { useState, useEffect, useCallback } from 'react';
import CourseService from '@/services/courses/CourseService';
import { UserService } from '@/services/users/UserService';
import toast from 'react-hot-toast';
import type { User } from '@/types/users';
import type { Course } from '@/types/course';
import type { Enrollment, EnrollmentFilters, EnrollmentStats } from '@/types/enrollment';
import { formatDate } from '@/utils/format';
import { EnrollmentService } from '@/services/courses/Enrollment';
import { Button, EmptyState } from '@/components/buttons/Button';
import StatCard from '@/components/cards/StatCards';
import { UserAvatar } from '@/components/users/UserAvater';

// ============================================================================
// REUSABLE COMPONENTS (DRY Principle)
// ============================================================================

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  error?: string;
  colClass?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  hint,
  placeholder = 'Choose...',
  error,
  colClass = 'col-12 col-md-6 col-lg-6'
}) => (
  <div className={colClass}>
    <label className="form-label small fw-semibold text-muted mb-1">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <select
      className={`form-select w-100  border ${error ? 'is-invalid' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <div className="invalid-feedback d-block">{error}</div>}
    {hint && <small className="text-muted d-block mt-1">{hint}</small>}
  </div>
);

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  colClass?: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  colClass = 'col-12 col-md-6 col-lg-6',
  error
}) => (
  <div className={colClass}>
    <label className="form-label small fw-semibold text-muted mb-1">{label}</label>
    <input
      type={type}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {error && <div className="invalid-feedback d-block">{error}</div>}
  </div>
);

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

const ManageEnrollments: React.FC = () => {
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<EnrollmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [session, setSession] = useState('2026/2027');
  const [term, setTerm] = useState('Q1.2026');
  const [enrolling, setEnrolling] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'dropped'>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal state
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);
  const [enrollmentToRemove, setEnrollmentToRemove] = useState<Enrollment | null>(null);
  const [unenrolling, setUnenrolling] = useState(false);

  // UI state
  const [showStudentOverview, setShowStudentOverview] = useState(false);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus, filterCourse]);

  // Fetch data when dependencies change

  // const fetchEnrollments = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const params: Record<string, any> = { 
  //       page, 
  //       page_size: pageSize,
  //       status: filterStatus !== 'all' ? filterStatus : undefined,
  //       course_id: filterCourse !== 'all' ? filterCourse : undefined,
  //       search: searchTerm || undefined
  //     };

  //     const response = await EnrollmentService.getAll(params);
  //     const enrollmentsData = response?.enrollments || [];
  //     const metaData = response.data?.page_meta || {};

  //     setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
  //     const totalCount = metaData.total ?? enrollmentsData.length;
  //     setTotal(totalCount);
  //     setTotalPages(Math.ceil(totalCount / pageSize));
  //   } catch (error: any) {
  //     console.error('Failed to fetch enrollments:', error);
  //     toast.error('Failed to load enrollments');
  //     setEnrollments([]);
  //     setTotal(0);
  //     setTotalPages(0);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [page, searchTerm, filterStatus, filterCourse, pageSize]);
  
 
// const fetchEnrollments = useCallback(async () => {
//   try {
//     setLoading(true);
    
//     const params: EnrollmentFilters = { 
//       page, 
//       page_size: pageSize,
//       status: filterStatus !== 'all' ? filterStatus : undefined,
//       course_id: filterCourse !== 'all' ? filterCourse : undefined,
//       search: searchTerm || undefined,
//       include_relations: true,  // ← Always include relations for list view
//     };

//     const response = await EnrollmentService.getAll(params);
    
//     // Updated path to match backend response structure
//     const enrollmentsData = Array.isArray(response) ? response : [];
//     const metaData = response?.page_meta || {};

//     setEnrollments(enrollmentsData);
    
//     const totalCount = metaData.total ?? enrollmentsData.length;

//     setTotal(totalCount);
//     setTotalPages(metaData.total_pages ?? Math.ceil(totalCount / pageSize));
    
//   } catch (error: any) {
//     console.error('Failed to fetch enrollments:', error);
//     toast.error('Failed to load enrollments');
//     setEnrollments([]);
//     setTotal(0);
//     setTotalPages(0);
//   } finally {
//     setLoading(false);
//   }
// }, [page, searchTerm, filterStatus, filterCourse, pageSize]);

  // Fetch initial data
  
  // v3
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);

    try {
      const params: EnrollmentFilters = {
        page,
        page_size: pageSize,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        course_id: filterCourse !== 'all' ? filterCourse : undefined,
        search: searchTerm || undefined,
        include_relations: true, // list view needs relations
      };

      const response = await EnrollmentService.getAll(params);

      // ✅ strongly typed — no guessing
      const enrollments = response.data;
      const meta = response.page_meta;

      setEnrollments(enrollments);
      setTotal(meta.total);
      setTotalPages(meta.total_pages);

    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
      toast.error("Failed to load enrollments");

      // ✅ safe reset state
      setEnrollments([]);
      setTotal(0);
      setTotalPages(0);

    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    filterStatus,
    filterCourse,
    searchTerm
  ]);


  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);

      const [studentsResponse, coursesResponse, statsResponse] = await Promise.all([
        UserService.getAll({ role: 'student', is_active: true }),
        CourseService.getAll({ status: 'active' }),
        EnrollmentService.getStats(),
      ]);

      // const response: any = await UserService.getAll();
    const students = Array.isArray(studentsResponse)
      ? studentsResponse : [];

    const courses = Array.isArray(coursesResponse)
      ? coursesResponse : [];

      setStudents(students);

      setCourses(courses);

      setStats(statsResponse.data || null);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      toast.error('Failed to load initial data');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const refreshData = () => {
    fetchEnrollments();
    fetchInitialData();
  };

  // ============================================================================
  // ENROLLMENT ACTIONS
  // ============================================================================

  const getAvailableCourses = () => {
    if (!selectedStudent) return courses;
    const enrolledCourseIds = enrollments
      .filter(e => e.student_id === selectedStudent && e.status !== 'dropped')
      .map(e => e.course_id);
    return courses.filter(c => !enrolledCourseIds.includes(c.id));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedStudent) {
      errors.student = 'Please select a student';
    }
    
    if (!selectedCourse) {
      errors.course = 'Please select a course';
    }
    
    if (!session.trim()) {
      errors.session = 'Session is required';
    }
    
    if (!term.trim()) {
      errors.term = 'Term is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEnrollStudent = async () => {
    if (!validateForm()) return;

    try {
      setEnrolling(true);
      await EnrollmentService.create({
        student_id: selectedStudent,
        course_id: selectedCourse,
        session,
        term,
      });

      toast.success('Student enrolled successfully');
      setSelectedStudent('');
      setSelectedCourse('');
      setFormErrors({});
      refreshData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll student');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!enrollmentToRemove) return;

    try {
      setUnenrolling(true);
      await EnrollmentService.delete(enrollmentToRemove.id);

      toast.success('Student unenrolled successfully');
      setShowUnenrollModal(false);
      setEnrollmentToRemove(null);

      if (enrollments.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refreshData();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to unenroll student');
    } finally {
      setUnenrolling(false);
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getStudentWorkload = (studentId: string) => {
    return enrollments.filter(
      e => e.student_id === studentId && e.status === 'active'
    ).length;
  };

  const getCoursesForStudent = (studentId: string) => {
    return enrollments.filter(e => e.student_id === studentId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCourse('all');
    setPage(1);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'completed': return 'bg-primary';
      case 'dropped': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, total);
  const hasActiveFilters = searchTerm || filterStatus !== 'all' || filterCourse !== 'all';

  const studentOptions = students.map(student => ({
    value: student.id,
    label: `${student.names} (${getStudentWorkload(student.id)} active)`,
    disabled: !student.is_active
  }));

  const courseOptions = getAvailableCourses().map(course => ({
    value: course.id,
    label: `${course.code} - ${course.title}`
  }));

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'dropped', label: 'Dropped' }
  ];

  const courseFilterOptions = [
    { value: 'all', label: 'All Courses' },
    ...courses.map(course => ({
      value: course.id,
      label: course.code
    }))
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading enrollment data...</p>
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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
              <div>
                <h4 className="mb-1">Manage Enrollments</h4>
                <p className="text-muted mb-0 small">Enroll students in courses and track progress</p>
              </div>
              <Button
                onClick={refreshData}
                variant="outline-primary"
                size="sm"
                icon="fa fa-sync-alt"
                loading={loading}
              >
                Refresh
              </Button>
            </div>

            {/* Quick Stats Bar */}
            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
              <span className="badge bg-primary rounded-pill">
                <i className="fa fa-users me-1" /> {students.length} Students
              </span>
              <span className="badge bg-success rounded-pill">
                <i className="fa fa-book me-1" /> {courses.length} Courses
              </span>
              <span className="badge bg-info rounded-pill">
                <i className="fa fa-graduation-cap me-1" /> {total} Enrollments
              </span>
              <button
                className="btn btn-sm btn-outline-secondary ms-auto"
                onClick={() => setShowStudentOverview(!showStudentOverview)}
              >
                <i className={`fa fa-${showStudentOverview ? 'minus' : 'plus'} me-1`} />
                {showStudentOverview ? 'Hide' : 'Show'} Overview
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <StatCard
              value={stats?.total_enrollments || 0}
              label="Total Enrollments"
              icon="fa fa-graduation-cap"
              bgColor="bg-primary"
              loading={initialLoading}
            />
            <StatCard
              value={stats?.active_enrollments || 0}
              label="Active Enrollments"
              icon="fa fa-check-circle"
              bgColor="bg-success"
              loading={initialLoading}
            />
            <StatCard
              value={`${stats?.students_enrolled || 0}/${stats?.total_students || 0}`}
              label="Students Enrolled"
              icon="fa fa-user-graduate"
              bgColor="bg-info"
              loading={initialLoading}
            />
            <StatCard
              value={`${stats?.courses_with_students || 0}/${stats?.total_courses || 0}`}
              label="Courses Active"
              icon="fa fa-book"
              bgColor="bg-warning"
              loading={initialLoading}
            />
          </div>

          {/* Enrollment Form */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light py-3">
              <h6 className="mb-0 d-flex align-items-center">
                <i className="fa fa-user-plus me-2" />
                New Enrollment
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <FormSelect
                  label="Select Student"
                  value={selectedStudent}
                  onChange={(value) => {
                    setSelectedStudent(value);
                    setSelectedCourse('');
                    setFormErrors(prev => ({ ...prev, student: '' }));
                  }}
                  options={studentOptions}
                  disabled={enrolling}
                  required
                  placeholder="Choose a student..."
                  hint={selectedStudent ? students.find(s => s.id === selectedStudent)?.email : undefined}
                  error={formErrors.student}
                  colClass="col-12 col-md-6 col-lg-6"
                />

                <FormSelect
                  label="Select Course"
                  value={selectedCourse}
                  onChange={(value) => {
                    setSelectedCourse(value);
                    setFormErrors(prev => ({ ...prev, course: '' }));
                  }}
                  options={courseOptions}
                  disabled={!selectedStudent || enrolling}
                  required
                  placeholder="Choose a course..."
                  hint={selectedCourse ? courses.find(c => c.id === selectedCourse)?.description?.slice(0, 50) : undefined}
                  error={formErrors.course}
                  colClass="col col-md-6 col-lg-6"
                />

                <FormInput
                  label="Session"
                  value={session}
                  onChange={(value) => {
                    setSession(value);
                    setFormErrors(prev => ({ ...prev, session: '' }));
                  }}
                  placeholder="e.g., 2026/2027"
                  error={formErrors.session}
                  colClass="col-12 col-md-6 col-lg-6"
                />

                <FormInput
                  label="Term"
                  value={term}
                  onChange={(value) => {
                    setTerm(value);
                    setFormErrors(prev => ({ ...prev, term: '' }));
                  }}
                  placeholder="e.g., Q1.2026"
                  error={formErrors.term}
                  colClass="col-12 col-md-6 col-lg-6"
                />

                <div className="col-12 col-lg-12">
                  <Button
                    onClick={handleEnrollStudent}
                    disabled={!selectedStudent || !selectedCourse || enrolling}
                    loading={enrolling}
                    icon="fa fa-plus"
                    block
                    size="md"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Student'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
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

                 <div className="col-12 col-md-6 col-lg-6">
                  <label className="form-label small fw-semibold text-muted mb-1">Status</label>
                  <select
                    className="form-select w-100 border"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 col-lg-6">
                  <label className="form-label small fw-semibold text-muted mb-1">Course</label>
                  <select
                    className="form-select w-100 border"
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                  >
                    {courseFilterOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-12 col-md-12 col-lg-12">
                  <label className="form-label small fw-semibold text-muted mb-1">Search</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fa fa-search text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control input-group-sm border-start-0"
                      placeholder="Search by student name, email, or course..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="fa fa-times" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

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
                      <FilterBadge icon="fa fa-filter" onRemove={() => setFilterStatus('all')}>
                        Status: {filterStatus}
                      </FilterBadge>
                    )}
                    {filterCourse !== 'all' && (
                      <FilterBadge icon="fa fa-book" onRemove={() => setFilterCourse('all')} color="info">
                        Course: {courses.find(c => c.id === filterCourse)?.code || filterCourse}
                      </FilterBadge>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-top">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                  <p className="mb-0 small text-muted">
                    {total > 0 ? (
                      <>
                        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
                        <strong>{total}</strong> enrollments
                        {totalPages > 1 && (
                          <span className="ms-2">
                            (Page <strong>{page}</strong> of <strong>{totalPages}</strong>)
                          </span>
                        )}
                      </>
                    ) : (
                      'No enrollments found'
                    )}
                  </p>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-check-circle text-success me-1" />
                      {enrollments.filter(e => e.status === 'active').length} Active
                    </span>
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-graduation-cap text-primary me-1" />
                      {enrollments.filter(e => e.status === 'completed').length} Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollments Table - Mobile Cards & Desktop Table */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light py-3">
              <h6 className="mb-0 d-flex align-items-center">
                <i className="fa fa-list me-2" />
                Current Enrollments ({total})
              </h6>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" />
                  <p className="text-muted mt-2">Loading enrollments...</p>
                </div>
              ) : enrollments.length === 0 ? (
                <EmptyState
                  icon="fa fa-graduation-cap"
                  title="No enrollments found"
                  description={hasActiveFilters ? 'Try adjusting your filters' : 'Enroll a student in a course to get started'}
                  actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
                  onAction={hasActiveFilters ? clearFilters : undefined}
                />
              ) : (
                <>
                  {/* Mobile Cards View */}
                  <div className="d-block d-lg-none">
                    {enrollments.map(enrollment => {
                      // const student = enrollment.student || {};
                      // const course = enrollment.course || {};
                      // Line 1118 area - Fix tutor property access:
                      const student = (enrollment.student || {}) as Partial<User>;
                      const course = (enrollment.course || {}) as Partial<Course>;

                      return (
                        <div key={enrollment.id} className="border-bottom p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center">
                              <UserAvatar names={student.names || 'NA'} size={40} />
                              <div className="ms-3">
                                <div className="fw-bold">{student.names || 'Unknown'}</div>
                                <div className="small text-muted">{student.email || 'No email'}</div>
                              </div>
                            </div>
                            <span className={`badge ${getStatusBadgeClass(enrollment.status || '')}`}>
                              {enrollment.status?.toUpperCase()}
                            </span>
                          </div>

                          <div className="mb-3">
                            <div className="fw-bold text-primary">{course.code || 'N/A'}</div>
                            <div className="small text-muted">{course.title || 'Unknown Course'}</div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center">
                            <div className="flex-grow-1 me-3">
                              <div className="small text-muted mb-1">Progress</div>
                              <div className="progress" style={{ height: '6px' }}>
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: `${enrollment.progress || 0}%` }}
                                  aria-valuenow={enrollment.progress || 0}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <small className="text-muted">{enrollment.progress || 0}%</small>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              icon="fa fa-user-minus"
                              onClick={() => {
                                setEnrollmentToRemove(enrollment);
                                setShowUnenrollModal(true);
                              }}
                            >
                              <span className="d-none d-sm-inline">Remove</span>
                            </Button>
                          </div>

                          <div className="small text-muted mt-2">
                            Enrolled: {formatDate(enrollment.enrolled_at)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Table View */}
                  <div className="d-none d-lg-block">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0 ps-4">Student</th>
                            <th className="border-0">Course</th>
                            <th className="text-center border-0">Progress</th>
                            <th className="text-center border-0">Status</th>
                            <th className="text-center border-0">Enrolled</th>
                            <th className="text-end border-0 pe-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrollments.map(enrollment => {
                            // const student = enrollment.student || {};
                            // const course = enrollment.course || {};
                            const student = (enrollment.student || {}) as Partial<User>;
                            const course = (enrollment.course || {}) as Partial<Course>;

                            return (
                              <tr key={enrollment.id}>
                                <td className="ps-4">
                                  <div className="d-flex align-items-center">
                                    <UserAvatar names={student.names || 'NA'} />
                                    <div className="ms-3">
                                      <div className="fw-bold">{student.names || 'Unknown'}</div>
                                      <div className="text-muted small">{student.email || 'No email'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="fw-bold text-primary">{course.code || 'N/A'}</div>
                                  <div className="text-muted small">{course.title || 'Unknown Course'}</div>
                                </td>
                                <td className="text-center">
                                  <div className="d-flex flex-column align-items-center">
                                    <div className="progress mb-1" style={{ width: '80px', height: '8px' }}>
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${enrollment.progress || 0}%` }}
                                        aria-valuenow={enrollment.progress || 0}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      />
                                    </div>
                                    <small className="text-muted">{enrollment.progress || 0}%</small>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <span className={`badge ${getStatusBadgeClass(enrollment.status || '')}`}>
                                    {enrollment.status?.toUpperCase()}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <small className="text-muted">
                                    {formatDate(enrollment.enrolled_at)}
                                  </small>
                                </td>
                                <td className="text-end pe-4">
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    icon="fa fa-user-minus"
                                    onClick={() => {
                                      setEnrollmentToRemove(enrollment);
                                      setShowUnenrollModal(true);
                                    }}
                                  >
                                    Unenroll
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
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

          {/* Student Overview - Collapsible */}
          {showStudentOverview && (
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light py-3">
                <h6 className="mb-0 d-flex align-items-center">
                  <i className="fa fa-users me-2" />
                  Student Enrollment Overview ({students.length} students)
                </h6>
              </div>
              <div className="card-body">
                {students.length === 0 ? (
                  <EmptyState
                    icon="fa fa-user-slash"
                    title="No students found"
                    description="Add students to the system to start enrolling them in courses"
                    small
                  />
                ) : (
                  <div className="row g-3">
                    {students.map(student => {
                      const studentEnrollments = getCoursesForStudent(student.id);
                      return (
                        <div className="col-12 col-sm-6 col-lg-6 col-xl-6" key={student.id}>
                          <div className="border rounded p-3 h-100 bg-light">
                            <div className="d-flex align-items-center mb-3">
                              <UserAvatar names={student.names || 'N/A'} size={40} bgColor="bg-primary" />
                              <div className="ms-3 flex-grow-1 overflow-hidden">
                                <div className="fw-bold text-truncate">{student.names}</div>
                                <div className="text-muted small text-truncate">{student.email}</div>
                              </div>
                            </div>

                            {studentEnrollments.length === 0 ? (
                              <div className="text-center py-2">
                                <p className="text-muted small mb-0">No enrollments</p>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    setSelectedStudent(student.id);
                                    setSelectedCourse('');
                                    // Scroll to enrollment form
                                    document.getElementById('enrollment-form')?.scrollIntoView({
                                      behavior: 'smooth'
                                    });
                                  }}
                                >
                                  <i className="fa fa-plus me-1" />
                                  Enroll
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="small text-muted">Active: {getStudentWorkload(student.id)}</span>
                                  <span className="badge bg-primary">
                                    {studentEnrollments.length} total
                                  </span>
                                </div>
                                <ul className="list-unstyled small mb-0">
                                  {studentEnrollments.map(e => {
                                    const course = e.course || {};
                                    return (
                                      <li
                                        key={e.id}
                                        className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                                      >
                                        <div className="text-truncate me-2">
                                          <div className="fw-semibold">{(course as Course).code || 'N/A'}</div>
                                          <div className="text-muted">{(course as Course).title?.slice(0, 20)}...</div>
                                        </div>
                                        <span className={`badge ${getStatusBadgeClass(e.status || '')}`}>
                                          {e.status}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Unenroll Confirmation Modal */}
      {showUnenrollModal && enrollmentToRemove && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => !unenrolling && setShowUnenrollModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down"
            style={{ maxHeight: '100dvh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  <i className="fa fa-user-minus me-2 text-danger" />
                  Confirm Unenrollment
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUnenrollModal(false)}
                  disabled={unenrolling}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="alert alert-danger mb-4">
                  <i className="fa fa-exclamation-triangle me-2" />
                  This action cannot be undone. All student progress data will be lost.
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <h6 className="text-muted mb-2">Student Details</h6>
                        <div className="d-flex align-items-center">
                          <UserAvatar 
                            names={enrollmentToRemove.student?.names || 'Unknown'} 
                            size={48}
                            bgColor="bg-danger"
                          />
                          <div className="ms-3">
                            <h5 className="mb-1">{enrollmentToRemove.student?.names || 'Unknown'}</h5>
                            <p className="text-muted small mb-0">{enrollmentToRemove.student?.email || 'No email'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <h6 className="text-muted mb-2">Course Details</h6>
                        <h5 className="text-primary mb-1">{enrollmentToRemove.course?.code || 'N/A'}</h5>
                        <p className="mb-0">{enrollmentToRemove.course?.title || 'Unknown Course'}</p>
                        <div className="mt-2">
                          <span className={`badge ${getStatusBadgeClass(enrollmentToRemove.status || '')} me-2`}>
                            {enrollmentToRemove.status?.toUpperCase()}
                          </span>
                          <span className="badge bg-info">
                            Progress: {enrollmentToRemove.progress || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning mb-0">
                  <div className="d-flex">
                    <i className="fa fa-info-circle mt-1 me-2 flex-shrink-0" />
                    <div>
                      <strong>Note:</strong> The student will lose access to:
                      <ul className="mb-0 mt-2">
                        <li>Course materials and lessons</li>
                        <li>Assignment submissions</li>
                        <li>Progress tracking data</li>
                        <li>Certificate eligibility (if applicable)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowUnenrollModal(false)}
                  disabled={unenrolling}
                  // block
                  size="md"
                  className="mb-2 mb-md-0"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleUnenroll}
                  loading={unenrolling}
                  icon="fa fa-user-minus"
                  // block
                  size="md"
                >
                  {unenrolling ? 'Processing...' : 'Confirm Unenrollment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEnrollments;