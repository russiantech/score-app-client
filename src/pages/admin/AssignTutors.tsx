// v9
// src/pages/admin/AssignTutors.tsx
// Enhanced with modal-based assignment and quick-assign buttons

import { useState, useEffect, useCallback } from 'react';
import CourseService from '@/services/courses/CourseService';
import { UserService } from '@/services/users/UserService';
import { TutorService } from '@/services/users/tutor';
import toast from 'react-hot-toast';
import type { User } from '@/types/users';
import type { Course } from '@/types/course';
import type { 
  AssignmentModalProps, 
  TutorAssignment, 
  TutorAssignmentFilters, 
  TutorAssignmentStats 
} from '@/types/tutor';
import { formatDate } from '@/utils/format';
import StatCard from '@/components/cards/StatCards';
import { Button, EmptyState } from '@/components/buttons/Button';
import { UserAvatar } from '@/components/users/UserAvater';
import type { FormSelectProps } from '@/types/forms';
import type { PaginationProps } from '@/types/api';
import type { FilterBadgeProps } from '@/types';

// ============================================================================
// REUSABLE COMPONENTS (DRY Principle)
// ============================================================================

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
  colClass = 'col-12'
}) => (
  <div className={colClass}>
    <label className="form-label small fw-semibold text-muted mb-1">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <select
      className={`form-select w-100 border form-select-lg ${error ? 'is-invalid' : ''}`}
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
    {hint && (
      <small className="text-muted d-block mt-1" style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }} title={hint}>
        {hint}
      </small>
    )}
  </div>
);

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



const AssignmentModal: React.FC<AssignmentModalProps> = ({
  show,
  onClose,
  tutors,
  courses,
  assignments,
  onAssign,
  assigning,
  preselectedTutorId = '',
  preselectedCourseId = ''
}) => {
  const [selectedTutor, setSelectedTutor] = useState(preselectedTutorId);
  const [selectedCourse, setSelectedCourse] = useState(preselectedCourseId);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update selections when preselected values change
  useEffect(() => {
    setSelectedTutor(preselectedTutorId);
    setSelectedCourse(preselectedCourseId);
  }, [preselectedTutorId, preselectedCourseId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setFormErrors({});
    }
  }, [show]);

  const getTutorWorkload = (tutorId: string) => {
    return assignments.filter(
      a => a.tutor_id === tutorId && a.status === 'active'
    ).length;
  };

  const getAvailableCourses = () => {
    if (!selectedTutor) return courses;
    const assignedCourseIds = assignments
      .filter(a => a.tutor_id === selectedTutor && a.status === 'active')
      .map(a => a.course_id);
    return courses.filter(c => !assignedCourseIds.includes(c.id));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedTutor) {
      errors.tutor = 'Please select a tutor';
    }
    
    if (!selectedCourse) {
      errors.course = 'Please select a course';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await onAssign(selectedTutor, selectedCourse);
      setSelectedTutor('');
      setSelectedCourse('');
      setFormErrors({});
      onClose();
    } catch (error) {
      // Error is handled by parent
    }
  };

  const handleClose = () => {
    if (!assigning) {
      setSelectedTutor('');
      setSelectedCourse('');
      setFormErrors({});
      onClose();
    }
  };

  const tutorOptions = tutors.map(tutor => ({
    value: tutor.id,
    label: `${tutor.names} (${getTutorWorkload(tutor.id)} courses)`,
    disabled: !tutor.is_active
  }));

  const courseOptions = getAvailableCourses().map(course => ({
    value: course.id,
    label: `${course.code} - ${course.title}`
  }));

  const selectedTutorData = tutors.find(t => t.id === selectedTutor);
  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fa fa-link me-2" />
              Assign Tutor to Course
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
              disabled={assigning}
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            {/* Info Alert */}
            <div className="alert alert-info d-flex align-items-start mb-4">
              <i className="fa fa-info-circle mt-1 me-2 flex-shrink-0" />
              <div className="small">
                Select a tutor and an available course to create a new assignment. Tutors can be assigned to multiple courses.
              </div>
            </div>

            <div className="row g-3">
              {/* Tutor Selection */}
              <FormSelect
                label="Select Tutor"
                value={selectedTutor}
                onChange={(value) => {
                  setSelectedTutor(value);
                  setSelectedCourse('');
                  setFormErrors(prev => ({ ...prev, tutor: '' }));
                }}
                options={tutorOptions}
                disabled={assigning}
                required
                placeholder="Choose a tutor..."
                error={formErrors.tutor}
                colClass="col-12"
              />

              {/* Selected Tutor Info */}
              {selectedTutorData && (
                <div className="col-12">
                  <div className="card bg-light border-0">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <UserAvatar 
                          names={selectedTutorData.names || 'Unknown'} 
                          size={48} 
                          bgColor="bg-primary"
                        />
                        <div className="ms-3 flex-grow-1 overflow-hidden">
                          <div className="fw-bold">{selectedTutorData.names}</div>
                          <div className="text-muted small text-truncate">{selectedTutorData.email}</div>
                          <div className="mt-1">
                            <span className="badge bg-primary me-2">
                              <i className="fa fa-book me-1" />
                              {getTutorWorkload(selectedTutorData.id)} Active Course{getTutorWorkload(selectedTutorData.id) !== 1 ? 's' : ''}
                            </span>
                            {selectedTutorData.is_active ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-secondary">Inactive</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Selection */}
              <FormSelect
                label="Select Course"
                value={selectedCourse}
                onChange={(value) => {
                  setSelectedCourse(value);
                  setFormErrors(prev => ({ ...prev, course: '' }));
                }}
                options={courseOptions}
                disabled={!selectedTutor || assigning}
                required
                placeholder={!selectedTutor ? "Select a tutor first..." : "Choose a course..."}
                error={formErrors.course}
                colClass="col-12"
              />

              {/* Selected Course Info */}
              {selectedCourseData && (
                <div className="col-12">
                  <div className="card bg-light border-0">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1 overflow-hidden">
                          <h6 className="text-primary mb-1">{selectedCourseData.code}</h6>
                          <div className="fw-semibold mb-1">{selectedCourseData.title}</div>
                          {selectedCourseData.description && (
                            <p className="text-muted small mb-0" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}>
                              {selectedCourseData.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="d-flex gap-2 flex-wrap mt-2">
                        <span className="badge bg-info">
                          <i className="fa fa-users me-1" />
                          {typeof selectedCourseData.enrolled_count === 'number' 
                            ? selectedCourseData.enrolled_count 
                            : (Array.isArray(selectedCourseData.students) 
                              ? selectedCourseData.students.length 
                              : 0)} Students
                        </span>
                        <span className="badge bg-success">
                          <i className="fa fa-book me-1" />
                          {Array.isArray(selectedCourseData.lessons) 
                            ? selectedCourseData.lessons.length 
                            : (typeof selectedCourseData.lesson_count === 'number' 
                              ? selectedCourseData.lesson_count 
                              : 0)} Lessons
                        </span>
                        {selectedCourseData.status && (
                          <span className={`badge ${
                            selectedCourseData.status === 'active' ? 'bg-success' : 'bg-secondary'
                          }`}>
                            {selectedCourseData.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Available Courses Info */}
              {selectedTutor && courseOptions.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-warning mb-0">
                    <i className="fa fa-exclamation-triangle me-2" />
                    This tutor is already assigned to all available courses.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer border-0 bg-light">
            <div className="d-flex gap-2 w-100 flex-column flex-sm-row">
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                disabled={assigning}
                // block
                size="md"
                className="order-2 order-sm-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!selectedTutor || !selectedCourse || assigning}
                loading={assigning}
                icon="fa fa-check"
                // block
                size="md"
                className="order-1 order-sm-1"
              >
                {assigning ? 'Assigning...' : 'Assign Tutor'}
              </Button>
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

const AssignTutors: React.FC = () => {
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutors, setTutors] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<TutorAssignment[]>([]);
  const [stats, setStats] = useState<TutorAssignmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [preselectedTutor, setPreselectedTutor] = useState('');
  const [preselectedCourse, setPreselectedCourse] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterTutor, setFilterTutor] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Unassign modal state
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [assignmentToRemove, setAssignmentToRemove] = useState<TutorAssignment | null>(null);
  const [unassigning, setUnassigning] = useState(false);

  // UI state
  const [showTutorOverview, setShowTutorOverview] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'unassigned'>('all');

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus, filterTutor, filterCourse, activeTab]);

  // Fetch assignments when dependencies change
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      
      const params: TutorAssignmentFilters = { 
        page, 
        page_size: pageSize,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        tutor_id: filterTutor !== 'all' ? filterTutor : undefined,
        course_id: filterCourse !== 'all' ? filterCourse : undefined,
        search: searchTerm || undefined,
        include_relations: true,
      };

      const response = await TutorService.getAll(params);
      
      const assignmentsData = response.data?.assignments || [];
      const metaData = response.data?.page_meta || {};

      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      
      const totalCount = metaData.total ?? assignmentsData.length;
      setTotal(totalCount);
      setTotalPages(metaData.total_pages ?? Math.ceil(totalCount / pageSize));
      
    } catch (error: any) {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load assignments');
      setAssignments([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterStatus, filterTutor, filterCourse, pageSize]);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [tutorsResponse, coursesResponse, statsResponse] = await Promise.all([
        UserService.getAll({ role: 'tutor', is_active: true }),
        CourseService.getAll({ status: 'active' }),
        TutorService.getStats(),
      ]);

      setTutors(Array.isArray(tutorsResponse) ? tutorsResponse : []);
      setCourses(Array.isArray(coursesResponse) ? coursesResponse : []);
      
      const statsData = statsResponse.data || statsResponse.success || null;
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      toast.error('Failed to load initial data');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const refreshData = () => {
    fetchAssignments();
    fetchInitialData();
  };

  // ============================================================================
  // ASSIGNMENT ACTIONS
  // ============================================================================

  const openAssignModal = (tutorId: string = '', courseId: string = '') => {
    setPreselectedTutor(tutorId);
    setPreselectedCourse(courseId);
    setShowAssignModal(true);
  };

  const handleAssignTutor = async (tutorId: string, courseId: string) => {
    try {
      setAssigning(true);
      await TutorService.create({
        tutor_id: tutorId,
        course_id: courseId,
      });

      toast.success('Tutor assigned successfully');
      refreshData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign tutor');
      throw error;
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async () => {
    if (!assignmentToRemove) return;

    try {
      setUnassigning(true);
      await TutorService.delete(assignmentToRemove.id);

      toast.success('Tutor unassigned successfully');
      setShowUnassignModal(false);
      setAssignmentToRemove(null);

      if (assignments.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refreshData();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to unassign tutor');
    } finally {
      setUnassigning(false);
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================


  const getCoursesForTutor = (tutorId: string) => {
    return assignments.filter(a => a.tutor_id === tutorId && a.status === 'active');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterTutor('all');
    setFilterCourse('all');
    setPage(1);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-secondary';
      case 'revoked': return 'bg-danger';
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
  const hasActiveFilters = searchTerm || filterStatus !== 'all' || filterTutor !== 'all' || filterCourse !== 'all';

  const assignedCourseIds = new Set(
    assignments
      .filter(a => a.status === 'active')
      .map(a => a.course_id)
  );
  
  const assignedCourses = courses.filter(c => assignedCourseIds.has(c.id));
  const unassignedCourses = courses.filter(c => !assignedCourseIds.has(c.id));

  const filteredAssignments = activeTab === 'assigned' 
    ? assignments.filter(a => assignedCourseIds.has(a.course_id))
    : activeTab === 'unassigned'
    ? []
    : assignments;

  const tutorFilterOptions = [
    { value: 'all', label: 'All Tutors' },
    ...tutors.map(tutor => ({
      value: tutor.id,
      label: tutor.names
    }))
  ];

  const courseFilterOptions = [
    { value: 'all', label: 'All Courses' },
    ...courses.map(course => ({
      value: course.id,
      label: course.code
    }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading assignment data...</p>
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
                <h4 className="mb-1">Assign Tutors to Courses</h4>
                <p className="text-muted mb-0 small">Manage tutor assignments and workload distribution</p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  onClick={() => openAssignModal()}
                  variant="primary"
                  size="sm"
                  icon="fa fa-plus"
                >
                  <span className="d-none d-sm-inline">New Assignment</span>
                  <span className="d-inline d-sm-none">Assign</span>
                </Button>
                <Button
                  onClick={refreshData}
                  variant="outline-primary"
                  size="sm"
                  icon="fa fa-sync-alt"
                  loading={loading}
                >
                  <span className="d-none d-sm-inline">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
              <span className="badge bg-primary rounded-pill">
                {/* <i className="fa fa-users me-1" /> {tutors.length} Tutors */}
                <i className="fa fa-users me-1" /> {(stats?.total_tutors ?? tutors.length)} Tutors
              </span>
              <span className="badge bg-success rounded-pill">
                {/* <i className="fa fa-book me-1" /> {courses.length} Courses */}
                <i className="fa fa-book me-1" /> {stats?.total_courses || courses.length} Courses
              </span>
              <span className="badge bg-info rounded-pill">
                <i className="fa fa-link me-1" /> {stats?.total_assignments || total } Assignments
              </span>
              <button
                className="btn btn-sm btn-outline-secondary ms-auto"
                onClick={() => setShowTutorOverview(!showTutorOverview)}
              >
                <i className={`fa fa-${showTutorOverview ? 'minus' : 'plus'} me-1`} />
                {showTutorOverview ? 'Hide' : 'Show'} Overview
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <StatCard
              value={stats?.total_courses || 0}
              label="Total Courses"
              icon="fa fa-book"
              bgColor="bg-primary"
              loading={initialLoading}
            />
            <StatCard
              value={stats?.courses_assigned || 0}
              label="Courses Assigned"
              icon="fa fa-check-circle"
              bgColor="bg-success"
              loading={initialLoading}
            />
            <StatCard
              value={`${stats?.tutors_assigned || 0}/${stats?.total_tutors || 0}`}
              label="Tutors Assigned"
              icon="fa fa-user-check"
              bgColor="bg-info"
              loading={initialLoading}
            />
            <StatCard
              value={stats?.active_assignments || 0}
              label="Active Assignments"
              icon="fa fa-link"
              bgColor="bg-warning"
              loading={initialLoading}
            />
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
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-muted mb-1">Status</label>
                  <select
                    className="form-select w-100 border form-select-lg"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-muted mb-1">Tutor</label>
                  <select
                    className="form-select w-100 border form-select-lg"
                    value={filterTutor}
                    onChange={(e) => setFilterTutor(e.target.value)}
                  >
                    {tutorFilterOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-muted mb-1">Course</label>
                  <select
                    className="form-select w-100 border form-select-lg"
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                  >
                    {courseFilterOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted mb-1">Search</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fa fa-search text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control input-group-sm border-start-0"
                      placeholder="Search by tutor name, email, or course..."
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
                    {filterTutor !== 'all' && (
                      <FilterBadge icon="fa fa-user" onRemove={() => setFilterTutor('all')} color="info">
                        Tutor: {tutors.find(t => t.id === filterTutor)?.names || filterTutor}
                      </FilterBadge>
                    )}
                    {filterCourse !== 'all' && (
                      <FilterBadge icon="fa fa-book" onRemove={() => setFilterCourse('all')} color="success">
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
                        <strong>{total}</strong> assigned tutors
                        {totalPages > 1 && (
                          <span className="ms-2">
                            (Page <strong>{page}</strong> of <strong>{totalPages}</strong>)
                          </span>
                        )}
                      </>
                    ) : (
                      'No assignments found'
                    )}
                  </p>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-check-circle text-success me-1" />
                      {assignments.filter(a => a.status === 'active').length} Active
                    </span>
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-times-circle text-secondary me-1" />
                      {assignments.filter(a => a.status === 'inactive').length} Inactive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignments Table - Mobile Cards & Desktop Table */}
          <div className="card mb-4 shadow-sm">
            <h4 className="m-2 d-flex align-items-center">
                  <i className="fa fa-list me-2" />
                  Course Assignments
                </h4>
            <div className="card-header bg-light py-3">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                
                {/* Tabs */}
                <ul className="nav nav-pills nav-sm">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveTab('all')}
                    >
                      All ({total})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'assigned' ? 'active' : ''}`}
                      onClick={() => setActiveTab('assigned')}
                    >
                      <i className="fa fa-check-circle me-1" />
                      <span className="d-none d-sm-inline">Assigned </span>({assignedCourses.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'unassigned' ? 'active' : ''}`}
                      onClick={() => setActiveTab('unassigned')}
                    >
                      <i className="fa fa-exclamation-circle me-1" />
                      <span className="d-none d-sm-inline">Unassigned </span>({unassignedCourses.length})
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" />
                  <p className="text-muted mt-2">Loading assignments...</p>
                </div>
              ) : activeTab === 'unassigned' ? (
                /* Unassigned Courses View */
                unassignedCourses.length === 0 ? (
                  <EmptyState
                    icon="fa fa-check-circle"
                    title="All courses assigned!"
                    description="Great! Every course has at least one tutor assigned."
                    small
                  />
                ) : (
                  <div className="p-3">
                    <div className="row g-3">
                      {unassignedCourses.map(course => {
                        const enrollmentCount = typeof course.enrolled_count === 'number' 
                          ? course.enrolled_count 
                          : (Array.isArray(course.students) ? course.students.length : 0);
                        
                        const lessonCount = Array.isArray(course.lessons) 
                          ? course.lessons.length 
                          : (typeof course.lesson_count === 'number' ? course.lesson_count : 0);
                        
                        return (
                          <div key={course.id} className="col-12 col-sm-6 col-lg-4 col-xl-6">
                            <div className="card h-100 border-warning shadow-sm">
                              <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="text-primary mb-1 text-truncate" title={course.code}>
                                      {course.code}
                                    </h6>
                                    <p className="text-muted small mb-0" 
                                       style={{ 
                                         display: '-webkit-box',
                                         WebkitLineClamp: 2,
                                         WebkitBoxOrient: 'vertical',
                                         overflow: 'hidden',
                                         lineHeight: '1.3',
                                         minHeight: '2.6em'
                                       }}
                                       title={course.title}
                                    >
                                      {course.title}
                                    </p>
                                  </div>
                                  <span className="badge bg-warning text-dark flex-shrink-0">
                                    <i className="fa fa-exclamation-circle me-1" />
                                    <span className="d-none d-md-inline">Unassigned</span>
                                  </span>
                                </div>
                                
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <div className="text-center bg-light rounded p-2">
                                      <i className="fa fa-users text-primary d-block mb-1" style={{ fontSize: '1.2rem' }} />
                                      <div className="fw-bold">{enrollmentCount}</div>
                                      <small className="text-muted d-block text-truncate">Student{enrollmentCount !== 1 ? 's' : ''}</small>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="text-center bg-light rounded p-2">
                                      <i className="fa fa-book text-success d-block mb-1" style={{ fontSize: '1.2rem' }} />
                                      <div className="fw-bold">{lessonCount}</div>
                                      <small className="text-muted d-block text-truncate">Lesson{lessonCount !== 1 ? 's' : ''}</small>
                                    </div>
                                  </div>
                                </div>
                                
                                {course.description && (
                                  <p className="text-muted small mb-3 flex-grow-1" 
                                     style={{ 
                                       display: '-webkit-box',
                                       WebkitLineClamp: 2,
                                       WebkitBoxOrient: 'vertical',
                                       overflow: 'hidden',
                                       fontSize: '0.8rem'
                                     }}
                                     title={course.description}
                                  >
                                    {course.description}
                                  </p>
                                )}
                                
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  icon="fa fa-user-plus"
                                  // block
                                  onClick={() => openAssignModal('', course.id)}
                                  className="mt-auto"
                                >
                                  Assign Tutor
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ) : filteredAssignments.length === 0 ? (
                <EmptyState
                  icon="fa fa-link"
                  title="No assignments found"
                  description={hasActiveFilters ? 'Try adjusting your filters' : 'Assign a tutor to a course to get started'}
                  actionLabel={hasActiveFilters ? 'Clear Filters' : 'New Assignment'}
                  onAction={hasActiveFilters ? clearFilters : () => openAssignModal()}
                />
              ) : (
                <>
                  {/* Mobile Cards View */}
                  <div className="d-block d-lg-none">
                    {filteredAssignments.map(assignment => {
                      // const tutor = assignment.tutor || {};
                      // const course = assignment.course || {};
                      const tutor = (assignment.tutor || {}) as Partial<User>;
                      const course = (assignment.course || {}) as Partial<Course>;
                      
                      const enrollmentCount = typeof course.enrolled_count === 'number' 
                        ? course.enrolled_count 
                        : (Array.isArray(course.students) ? course.students.length : 0);
                      
                      const lessonCount = Array.isArray(course.lessons) 
                        ? course.lessons.length 
                        : (typeof course.lesson_count === 'number' ? course.lesson_count : 0);

                      return (
                        <div key={assignment.id} className="border-bottom p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                              <UserAvatar names={tutor.names || 'NA'} size={40} className="flex-shrink-0" />
                              <div className="ms-3 overflow-hidden">
                                <div className="fw-bold text-truncate">{tutor.names || 'Unknown'}</div>
                                <div className="small text-muted text-truncate">{tutor.email || 'No email'}</div>
                              </div>
                            </div>
                            <span className={`badge ${getStatusBadgeClass(assignment.status || '')} flex-shrink-0 ms-2`}>
                              {assignment.status?.toUpperCase()}
                            </span>
                          </div>

                          <div className="mb-3 ps-5 ms-2">
                            <div className="fw-bold text-primary text-truncate">{course.code || 'N/A'}</div>
                            <div className="small text-muted mb-2 text-truncate">{course.title || 'Unknown Course'}</div>
                            
                            <div className="d-flex gap-3 flex-wrap">
                              <small className="text-muted">
                                <i className="fa fa-users me-1" />
                                {enrollmentCount} student{enrollmentCount !== 1 ? 's' : ''}
                              </small>
                              <small className="text-muted">
                                <i className="fa fa-book me-1" />
                                {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                              </small>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center ps-5 ms-2">
                            <div className="small text-muted">
                              Assigned: {formatDate(assignment.created_at)}
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              icon="fa fa-unlink"
                              onClick={() => {
                                setAssignmentToRemove(assignment);
                                setShowUnassignModal(true);
                              }}
                            >
                              <span className="d-none d-sm-inline">Unassign</span>
                            </Button>
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
                            <th className="border-0 ps-4">Tutor</th>
                            <th className="border-0">Course</th>
                            <th className="text-center border-0">Students</th>
                            <th className="text-center border-0">Lessons</th>
                            <th className="text-center border-0">Status</th>
                            <th className="text-center border-0">Assigned</th>
                            <th className="text-end border-0 pe-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAssignments.map(assignment => {
                            // Line 1118 area - Fix tutor property access:
                            const tutor = (assignment.tutor || {}) as Partial<User>;
                            const course = (assignment.course || {}) as Partial<Course>;
                                                        
                            const enrollmentCount = typeof course.enrolled_count === 'number' 
                              ? course.enrolled_count 
                              : (Array.isArray(course?.students) ? course.students?.length : 0);
                            
                            const lessonCount = Array.isArray(course.lessons) 
                              ? course.lessons.length 
                              : (typeof course.lesson_count === 'number' ? course.lesson_count : 0);

                            return (
                              <tr key={assignment.id}>
                                <td className="ps-4">
                                  <div className="d-flex align-items-center">
                                    <UserAvatar names={tutor.names || 'NA'} />
                                    <div className="ms-3 overflow-hidden" style={{ maxWidth: '200px' }}>
                                      <div className="fw-bold text-truncate">{tutor.names || 'Unknown'}</div>
                                      <div className="text-muted small text-truncate">{tutor.email || 'No email'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div style={{ maxWidth: '250px' }}>
                                    <div className="fw-bold text-primary text-truncate">{course.code || 'N/A'}</div>
                                    <div className="text-muted small text-truncate">{course.title || 'Unknown Course'}</div>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-info">
                                    <i className="fa fa-users me-1" />
                                    {enrollmentCount}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-primary">
                                    <i className="fa fa-book me-1" />
                                    {lessonCount}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className={`badge ${getStatusBadgeClass(assignment.status || '')}`}>
                                    {assignment.status?.toUpperCase()}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <small className="text-muted">
                                    {formatDate(assignment.created_at)}
                                  </small>
                                </td>
                                <td className="text-end pe-4">
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    icon="fa fa-unlink"
                                    onClick={() => {
                                      setAssignmentToRemove(assignment);
                                      setShowUnassignModal(true);
                                    }}
                                  >
                                    Unassign
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
                  {/* {totalPages > 1 && activeTab !== 'unassigned' && (
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      hasNextPage={hasNextPage}
                      hasPrevPage={hasPrevPage}
                      onPageChange={setPage}
                      loading={loading}
                    />
                  )} */}
                  
                   {totalPages > 1 && activeTab !== ('unassigned' as typeof activeTab) && (
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
          
          {/* Tutor Workload Overview - Enhanced */}
{showTutorOverview && (
  <div className="card mb-4 shadow-sm">
    <div className="card-header bg-light py-3">
      <h6 className="mb-0 d-flex align-items-center">
        <i className="fa fa-users me-2" />
        Tutor Workload Overview ({tutors.length} tutors)
      </h6>
    </div>
    <div className="card-body">
      {tutors.length === 0 ? (
        <EmptyState
          icon="fa fa-user-slash"
          title="No tutors found"
          description="Add tutors to the system to start assigning them to courses" 
          actionLabel={undefined} onAction={undefined}          
        />
      ) : (
        <div className="row g-3">
          {tutors.map(tutor => {
            const tutorAssignments = getCoursesForTutor(tutor.id);
            
            const totalStudents = tutorAssignments.reduce((sum, a) => {
              // const course = a.course || {};
              const course = (a.course || {}) as Partial<Course>;

              const count = typeof course.enrolled_count === 'number' 
                ? course.enrolled_count
                : (Array.isArray(course.students) ? course.students.length : 0);
              return sum + count;

            }, 0);
            
            const totalLessons = tutorAssignments.reduce((sum, a) => {
              // const course = a.course || {};
              const course = (a.course || {}) as Partial<Course>;

              const count = Array.isArray(course.lessons) ? course.lessons.length
               : (typeof course.lesson_count === 'number' ? course.lesson_count : 0);

              return sum + count;

            }, 0);
            
            return (
              <div 
                className="col-12 col-sm-6 col-md-6 col-lg-6" 
                key={tutor.id}
              >
                <div className="border rounded p-3 h-100 bg-light d-flex flex-column">
                  {/* Tutor Header */}
                  <div className="d-flex align-items-center mb-3">
                    <UserAvatar names={tutor.names || 'Unknown'} size={48} bgColor="bg-primary" className="flex-shrink-0" />
                    <div className="ms-3 flex-grow-1 overflow-hidden">
                      <div className="fw-bold text-truncate" title={tutor.names}>{tutor.names}</div>
                      <div className="text-muted small text-truncate" title={tutor.email}>{tutor.email}</div>
                    </div>
                  </div>

                  {/* Workload Stats */}
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <div className="text-center bg-white rounded p-2">
                        <div className="fw-bold text-primary">{tutorAssignments.length}</div>
                        <small className="text-muted d-block text-truncate">Course{tutorAssignments.length !== 1 ? 's' : ''}</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center bg-white rounded p-2">
                        <div className="fw-bold text-success">{totalStudents}</div>
                        <small className="text-muted d-block text-truncate">Student{totalStudents !== 1 ? 's' : ''}</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center bg-white rounded p-2">
                        <div className="fw-bold text-info">{totalLessons}</div>
                        <small className="text-muted d-block text-truncate">Lesson{totalLessons !== 1 ? 's' : ''}</small>
                      </div>
                    </div>
                  </div>

                  {tutorAssignments.length === 0 ? (
                    <div className="text-center py-2 mt-auto">
                      <p className="text-muted small mb-2">No assignments</p>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openAssignModal(tutor.id)}
                      >
                        <i className="fa fa-plus me-1" />
                        Assign
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-semibold text-muted">Assigned Courses</span>
                        <span className="badge bg-primary">
                          {tutorAssignments.length}
                        </span>
                      </div>
                      <div className="small" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {tutorAssignments.map(a => {
                          const course = a.course as unknown as Course || {} as Course;
                          
                          const enrollmentCount = typeof course.enrolled_count === 'number' 
                            ? course.enrolled_count 
                            : (Array.isArray(course.students) ? course.students.length : 0);
                          
                          return (
                            <div
                              key={a.id}
                              className="d-flex justify-content-between align-items-start mb-2 pb-2 border-bottom"
                            >
                              <div className="flex-grow-1 overflow-hidden me-2">
                                <div className="fw-semibold text-truncate" title={course.code}>
                                  {course.code || 'N/A'}
                                </div>
                                <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }} title={course.title}>
                                  {course.title || 'Unknown Course'}
                                </div>
                                <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                                  <i className="fa fa-users me-1" />
                                  {enrollmentCount} student{enrollmentCount !== 1 ? 's' : ''}
                                </div>
                              </div>
                              <span className={`badge ${getStatusBadgeClass(a.status || '')} flex-shrink-0`} style={{ fontSize: '0.65rem' }}>
                                {a.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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

      {/* Assignment Modal */}
      <AssignmentModal
        show={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        tutors={tutors}
        courses={courses}
        assignments={assignments}
        onAssign={handleAssignTutor}
        assigning={assigning}
        preselectedTutorId={preselectedTutor}
        preselectedCourseId={preselectedCourse}
      />

      {/* Unassign Confirmation Modal */}
      {showUnassignModal && assignmentToRemove && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          onClick={() => !unassigning && setShowUnassignModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  <i className="fa fa-unlink me-2 text-danger" />
                  Confirm Unassignment
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUnassignModal(false)}
                  disabled={unassigning}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="alert alert-danger mb-4">
                  <i className="fa fa-exclamation-triangle me-2" />
                  This action will remove the tutor from this course.
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <h6 className="text-muted mb-2">Tutor Details</h6>
                        <div className="d-flex align-items-center">
                          <UserAvatar names={assignmentToRemove.tutor?.names || 'Unknown'} 
                            size={48}
                            bgColor="bg-danger"
                          />
                          <div className="ms-3">
                            <h5 className="mb-1">{assignmentToRemove.tutor?.names || 'Unknown'}</h5>
                            <p className="text-muted small mb-0">{assignmentToRemove.tutor?.email || 'No email'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <h6 className="text-muted mb-2">Course Details</h6>
                        <h5 className="text-primary mb-1">{assignmentToRemove.course?.code || 'N/A'}</h5>
                        <p className="mb-0">{assignmentToRemove.course?.title || 'Unknown Course'}</p>
                        <div className="mt-2">
                          <span className={`badge ${getStatusBadgeClass(assignmentToRemove.status || '')}`}>
                            {assignmentToRemove.status?.toUpperCase()}
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
                      <strong>Note:</strong> Students enrolled in this course will no longer have an assigned tutor until a new one is assigned.
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <div className="d-flex gap-2 w-100 flex-column flex-sm-row">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowUnassignModal(false)}
                    disabled={unassigning}
                    block
                    size="md"
                    className="order-2 order-sm-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleUnassign}
                    loading={unassigning}
                    icon="fa fa-unlink"
                    block
                    size="md"
                    className="order-1 order-sm-2"
                  >
                    {unassigning ? 'Processing...' : 'Confirm Unassignment'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTutors;
