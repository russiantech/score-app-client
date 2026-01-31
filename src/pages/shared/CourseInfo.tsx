// src/pages/tutor/CourseInfo.tsx - Complete real-time CRUD with consistent API refresh
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CourseService } from '@/services/courses/CourseService';
import { LessonService } from '@/services/courses/LessonService';
import { ModuleService } from '@/services/courses/ModuleService';
import LessonFormModal from '@/components/modals/course/LessonFormModal';
import ModuleFormModal from '@/components/modals/course/ModuleFormModal';
import AttendanceFormModal from '@/components/modals/course/AttendanceFormModal';
import LessonAssessmentScoreModal from '@/components/modals/course/LessonAssessmentScoreModal';
import ModuleExamScoreModal from '@/components/modals/course/ModuleExamScoreModal';
import CourseProjectScoreModal from '@/components/modals/course/CourseProjectScoreModal';

import type { Course } from '@/types/course';
import type { Module, ModuleCreate, ModuleUpdate } from '@/types/course/module';
import type { CreateLessonDTO, UpdateLessonDTO, Lesson } from '@/types/course/lesson';

import { formatDate } from '@/utils/format';
import { extractErrorMessage } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';
import { hasAnyRole } from '@/utils/auth/roles';

export const CourseInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Permissions
  const canEdit = auth && auth.user && hasAnyRole(['admin', 'tutor'], auth.user.roles);
  
  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ modules: 0, lessons: 0, students: 0 });

  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLessonScoreModal, setShowLessonScoreModal] = useState(false);
  const [showModuleExamModal, setShowModuleExamModal] = useState(false);
  const [showCourseProjectModal, setShowCourseProjectModal] = useState(false);

  // Active context
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // ============================================================================
  // DATA LOADING - Centralized refresh function
  // ============================================================================

  const loadCourse = useCallback(async () => {
    if (!id) return;

    const res = await CourseService.getById(id, {
      include_relations: true,
      // include_attendance: true,
    });

    setCourse(res.course || null);
    setModules(res?.course?.modules || []);
  }, [id]);

  const loadEnrollments = useCallback(async () => {
    if (!id) return;

    const res = await CourseService.getEnrollments(id);
    const enrollments = Array.isArray(res) ? res : [];
    setStudents(enrollments.map(e => e.student).filter(Boolean));
  }, [id]);

  const loadStats = useCallback(async () => {
    if (!id) return;

    const res = await CourseService.getPerformance(id);
    const statsObj = Array.isArray(res) 
      ? (res[0] || { modules: 0, lessons: 0, students: 0 }) 
      : (res || { modules: 0, lessons: 0, students: 0 });
    setStats(statsObj);
  }, [id]);

  // Refresh all data after mutations
  const refreshCourseData = useCallback(async () => {
    await Promise.all([
      loadCourse(),
      loadStats(),
    ]);
  }, [loadCourse, loadStats]);

  // Initial load
  useEffect(() => {
    Promise.all([
      loadCourse(),
      loadEnrollments(),
      loadStats(),
    ]).finally(() => setLoading(false));
  }, [loadCourse, loadEnrollments, loadStats]);

  // ============================================================================
  // MODULE CRUD - WITH API REFRESH FOR CONSISTENCY
  // ============================================================================

  const handleCreateModule = async (data: ModuleCreate) => {
    try {
      await ModuleService.create(data);
      
      toast.success('Module created successfully');
      
      // Refresh all data to ensure consistency (including attendance stats)
      await refreshCourseData();
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    }
  };

  const handleUpdateModule = async (data: ModuleUpdate) => {
    if (!editingModule) return;

    try {
      await ModuleService.update(editingModule.id, data);

      toast.success('Module updated successfully');
      
      // Refresh all data
      await refreshCourseData();
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    const lessonsCount = module?.lessons?.length || 0;

    const confirmMsg = lessonsCount > 0
      ? `This module contains ${lessonsCount} lesson(s). Continue?`
      : 'Delete this module?';

    if (!window.confirm(confirmMsg)) return;

    try {
      await ModuleService.delete(moduleId);
      
      toast.success('Module deleted successfully');
      
      // Refresh all data
      await refreshCourseData();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  // ============================================================================
  // LESSON CRUD - WITH API REFRESH FOR CONSISTENCY
  // ============================================================================

  const handleCreateLesson = async (data: CreateLessonDTO | UpdateLessonDTO) => {
    if (!activeModule) return;

    // Ensure module_id is always a string for CreateLessonDTO
    const lessonData = {
      ...data,
      module_id: activeModule.id,
    };

    try {
      await LessonService.create(lessonData as CreateLessonDTO);

      toast.success('Lesson created successfully');
      
      // Refresh all data to get updated lesson with attendance stats
      await refreshCourseData();
      
      // Keep the module expanded
      setExpandedModules(prev => new Set([...prev, activeModule.id]));
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    }
  };

  const handleUpdateLesson = async (data: UpdateLessonDTO) => {
    if (!editingLesson || !activeModule) return;

    try {
      await LessonService.update(editingLesson.id, data);

      toast.success('Lesson updated successfully');
      
      // Refresh all data to get updated lesson with all computed fields
      await refreshCourseData();
      
      // Keep the module expanded
      setExpandedModules(prev => new Set([...prev, activeModule.id]));
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    }
  };

  const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
    if (!window.confirm('Delete this lesson?')) return;

    try {
      await LessonService.delete(lessonId);

      // Clear if deleted lesson is active
      if (activeLesson?.id === lessonId) {
        setActiveLesson(null);
      }

      toast.success('Lesson deleted successfully');
      
      // Refresh all data
      await refreshCourseData();
      
      // Keep the module expanded
      setExpandedModules(prev => new Set([...prev, moduleId]));
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  // ============================================================================
  // ATTENDANCE & SCORE HANDLERS - Consistent refresh pattern
  // ============================================================================

  const handleAttendanceSaved = async () => {
    toast.success('Attendance updated');
    
    // Refresh course data to get updated attendance statistics
    await refreshCourseData();
    
    // Keep current lesson's module expanded
    if (activeLesson) {
      const lessonModule = modules.find(m => 
        m.lessons?.some(l => l.id === activeLesson.id)
      );
      if (lessonModule) {
        setExpandedModules(prev => new Set([...prev, lessonModule.id]));
      }
    }
  };

  const handleLessonScoreSaved = async () => {
    toast.success('Scores updated');
    
    // Refresh course data
    await refreshCourseData();
    
    // Keep current lesson's module expanded
    if (activeLesson) {
      const lessonModule = modules.find(m => 
        m.lessons?.some(l => l.id === activeLesson.id)
      );
      if (lessonModule) {
        setExpandedModules(prev => new Set([...prev, lessonModule.id]));
      }
    }
  };

  const handleModuleExamSaved = async () => {
    toast.success('Exam scores updated');
    
    // Refresh course data
    await refreshCourseData();
    
    // Keep current module expanded
    if (activeModule) {
      setExpandedModules(prev => new Set([...prev, activeModule.id]));
    }
  };

  const handleCourseProjectSaved = async () => {
    toast.success('Project scores updated');
    
    // Refresh course data
    await refreshCourseData();
  };

  // ============================================================================
  // UI HELPERS
  // ============================================================================

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      newSet.has(moduleId) ? newSet.delete(moduleId) : newSet.add(moduleId);
      return newSet;
    });
  };

  const getStatusBadge = (status?: Lesson['status']) => {
    const config = {
      completed: { color: 'success', label: 'Completed', icon: '✓' },
      ongoing: { color: 'primary', label: 'Ongoing', icon: '↻' },
      upcoming: { color: 'warning', label: 'Upcoming', icon: '⏱' },
      cancelled: { color: 'danger', label: 'Cancelled', icon: '✕' },
      draft: { color: 'secondary', label: 'Draft', icon: '📝' },
      default: { color: 'secondary', label: 'Unknown', icon: '?' }
    };
    const c = config[(status as keyof typeof config) || 'default'] || config.default;
    return (
      <span className={`badge bg-${c.color}`}>
        {c.icon} {c.label}
      </span>
    );
  };

  const getAttendanceBadge = (lesson: Lesson) => {
    // Check if attendance data exists
    const hasAttendance = lesson.attendance_count && lesson.attendance_count > 0;
    
    if (!hasAttendance) {
      return <span className="badge bg-secondary">No attendance</span>;
    }

    const rate = lesson.attendance_rate || 0;
    const color = rate >= 80 ? 'success' : rate >= 60 ? 'warning' : 'danger';

    return (
      <span className={`badge bg-${color}`}>
        {lesson.present_count || 0}/{lesson.attendance_count} ({Math.round(rate)}%)
      </span>
    );
  };

  const filteredModules = modules.filter(m =>
    !searchQuery ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h4>Course Not Found</h4>
        <p className="text-muted">
          The course you're looking for doesn't exist or you don't have access to it.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/tutor/courses')}>
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      <div className="mb-4">
        <button
          className="btn btn-link text-decoration-none p-0 mb-2"
          onClick={() => navigate('/tutor/courses')}
        >
          ← Back to Courses
        </button>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h3 className="mb-1">{course.title}</h3>
            <p className="text-muted mb-2">{course.description}</p>
            <span className="badge bg-secondary">{course.code}</span>
          </div>
          {canEdit && (
            <div className="btn-group gap-2">
              <button
                className="btn btn-primary rounded"
                onClick={() => {
                  setEditingModule(null);
                  setShowModuleModal(true);
                }}
              >
                <i className="fa fa-plus me-2" />
                Add Module
              </button>
              <button
                className="btn btn-success rounded"
                onClick={() => setShowCourseProjectModal(true)}
                title="Record Course Project Scores"
              >
                <i className="fa fa-project-diagram me-2" />
                Course Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="fa fa-book-open fa-2x text-primary me-3" />
                <div>
                  <div className="small text-muted">Modules</div>
                  <h4 className="mb-0">{stats.modules}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="fa fa-clipboard-list fa-2x text-info me-3" />
                <div>
                  <div className="small text-muted">Lessons</div>
                  <h4 className="mb-0">{stats.lessons}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="fa fa-users fa-2x text-success me-3" />
                <div>
                  <div className="small text-muted">Students</div>
                  <h4 className="mb-0">{stats.students}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="fa fa-chalkboard-teacher fa-2x text-warning me-3" />
                <div>
                  <div className="small text-muted">Tutors</div>
                  <h4 className="mb-0">{course.tutor_count || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search modules..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Modules List */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">Course Modules</h5>
        </div>
        <div className="card-body p-0">
          {filteredModules.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa fa-folder-open fa-3x text-muted mb-3" />
              <p className="text-muted">
                {searchQuery ? 'No modules match your search' : 'No modules yet'}
              </p>
              {!searchQuery && canEdit && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModuleModal(true)}
                >
                  Create First Module
                </button>
              )}
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredModules.map(module => (
                <div key={module.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                      <button
                        className="btn btn-sm btn-link text-decoration-none p-0 me-2"
                        onClick={() => toggleModuleExpand(module.id)}
                        aria-label={expandedModules.has(module.id) ? 'Collapse' : 'Expand'}
                      >
                        <i className={`fa fa-chevron-${expandedModules.has(module.id) ? 'down' : 'right'}`} />
                      </button>
                      <div
                        className="flex-grow-1"
                        onClick={() => toggleModuleExpand(module.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <h6 className="mb-0">
                          {module.order}. {module.title}
                        </h6>
                        {module.description && (
                          <small className="text-muted">{module.description}</small>
                        )}
                        <div className="mt-1">
                          <span className="badge bg-secondary me-2">
                            {module.lessons_count || 0} lesson{module.lessons_count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="btn-group btn-group-sm gap-1">
                        <button
                          className="btn btn-outline-primary rounded"
                          onClick={() => {
                            setActiveModule(module);
                            setEditingLesson(null);
                            setShowLessonModal(true);
                          }}
                          title="Add Lesson"
                        >
                          <i className="fa fa-plus me-1" />
                          Lesson
                        </button>
                        <button
                          className="btn btn-danger rounded"
                          onClick={() => {
                            setActiveModule(module);
                            setShowModuleExamModal(true);
                          }}
                          title="Module Exam"
                        >
                          <i className="fa fa-file-text me-1" />
                          Exam
                        </button>
                        <button
                          className="btn btn-outline-secondary rounded"
                          onClick={() => {
                            setEditingModule(module);
                            setShowModuleModal(true);
                          }}
                          aria-label="Edit module"
                        >
                          <i className="fa fa-edit" />
                        </button>
                        <button
                          className="btn btn-outline-danger rounded"
                          onClick={() => handleDeleteModule(module.id)}
                          aria-label="Delete module"
                        >
                          <i className="fa fa-trash" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Lessons */}
                  {expandedModules.has(module.id) && (
                    <div className="mt-3 ps-4">
                      {!module.lessons || module.lessons.length === 0 ? (
                        <div className="text-center py-3 bg-light rounded">
                          <small className="text-muted">No lessons in this module yet</small>
                        </div>
                      ) : (
                        <div className="list-group">
                          {module.lessons.map(lesson => (
                            <div key={lesson.id} className="list-group-item">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">
                                    {lesson.order}. {lesson.title}
                                  </h6>
                                  {lesson.description && (
                                    <p className="mb-2 text-muted small">
                                      {lesson.description}
                                    </p>
                                  )}
                                  <div className="d-flex gap-2 align-items-center flex-wrap">
                                    {getStatusBadge(lesson.status)}
                                    {lesson.date && (
                                      <small className="text-muted">
                                        <i className="fa fa-calendar me-1" />
                                        {formatDate(lesson.date)}
                                      </small>
                                    )}
                                    {lesson.duration && (
                                      <small className="text-muted">
                                        <i className="fa fa-clock me-1" />
                                        {lesson.duration}
                                      </small>
                                    )}
                                    {getAttendanceBadge(lesson)}
                                  </div>
                                </div>
                                {canEdit && (
                                  <div className="btn-group btn-group-sm gap-1">
                                    <button
                                      className="btn btn-outline-info rounded"
                                      onClick={() => {
                                        setActiveLesson(lesson);
                                        setShowAttendanceModal(true);
                                      }}
                                      title="Mark Attendance"
                                    >
                                      <i className="fa fa-user-check" />
                                    </button>
                                    <button
                                      className="btn btn-primary rounded"
                                      onClick={() => {
                                        setActiveLesson(lesson);
                                        setShowLessonScoreModal(true);
                                      }}
                                      title="Record Scores"
                                    >
                                      <i className="fa fa-table" />
                                    </button>
                                    <button
                                      className="btn btn-outline-secondary rounded"
                                      onClick={() => {
                                        setEditingLesson(lesson);
                                        setActiveModule(module);
                                        setShowLessonModal(true);
                                      }}
                                      aria-label="Edit lesson"
                                    >
                                      <i className="fa fa-edit" />
                                    </button>
                                    <button
                                      className="btn btn-outline-danger rounded"
                                      onClick={() => handleDeleteLesson(lesson.id, module.id)}
                                      aria-label="Delete lesson"
                                    >
                                      <i className="fa fa-trash" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {canEdit && (
        <>
          <ModuleFormModal
            isOpen={showModuleModal}
            onClose={() => {
              setShowModuleModal(false);
              setEditingModule(null);
            }}
            onSave={editingModule ? handleUpdateModule : handleCreateModule}
            courseId={id!}
            module={editingModule}
            isEditing={!!editingModule}
            existingOrders={modules.map(m => m.order)}
          />

          {activeModule && (
            <LessonFormModal
              isOpen={showLessonModal}
              onClose={() => {
                setShowLessonModal(false);
                setEditingLesson(null);
                setActiveModule(null);
              }}
              onSave={editingLesson ? handleUpdateLesson : handleCreateLesson}
              module={activeModule}
              lesson={editingLesson}
              isEditing={!!editingLesson}
            />
          )}

          {activeLesson && showAttendanceModal && (
            <AttendanceFormModal
              isOpen={showAttendanceModal}
              onClose={() => {
                setShowAttendanceModal(false);
                setActiveLesson(null);
              }}
              lesson={activeLesson}
              students={students}
              onSave={handleAttendanceSaved}
            />
          )}

          {activeLesson && showLessonScoreModal && (
            <LessonAssessmentScoreModal
              isOpen={showLessonScoreModal}
              onClose={() => {
                setShowLessonScoreModal(false);
                setActiveLesson(null);
              }}
              lesson={activeLesson}
              students={students}
              onSave={handleLessonScoreSaved}
            />
          )}

          {activeModule && showModuleExamModal && (
            <ModuleExamScoreModal
              isOpen={showModuleExamModal}
              onClose={() => {
                setShowModuleExamModal(false);
                setActiveModule(null);
              }}
              module={activeModule}
              onSave={handleModuleExamSaved}
            />
          )}

          {course && showCourseProjectModal && (
            <CourseProjectScoreModal
              isOpen={showCourseProjectModal}
              onClose={() => setShowCourseProjectModal(false)}
              course={course}
              onSave={handleCourseProjectSaved}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CourseInfo;