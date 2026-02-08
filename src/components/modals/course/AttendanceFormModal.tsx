// src/components/modals/course/AttendanceFormModal.tsx
// Fixed to send proper payload with enrollment_id fallback

import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/utils/helpers';
import type { Lesson } from '@/types/course/lesson';
import AttendanceService from '@/services/courses/Attendance';
import type { StudentAttendanceData } from '@/types/course/attendance';
// import { AttendanceService, type StudentAttendanceData } from '@/services/courses/attendance';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
  students: Array<{ id: string; names: string; email: string; username?: string }>;
  onSave: () => void;
}

const AttendanceFormModal = ({ 
  isOpen, 
  onClose, 
  lesson, 
  onSave 
}: AttendanceModalProps) => {
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceData[]>([]);
  const [localStatus, setLocalStatus] = useState<Record<string, AttendanceStatus>>({});
  const [localRemarks, setLocalRemarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && lesson?.id) {
      loadAttendance();
    }
  }, [isOpen, lesson?.id]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const response = await AttendanceService.getByLesson(lesson.id);
      
      setAttendanceData(response.students);
      
      // Initialize local state using student_id as key
      const statusMap: Record<string, AttendanceStatus> = {};
      const remarksMap: Record<string, string> = {};
      
      response.students.forEach(student => {
        statusMap[student.student_id] = (student.status as AttendanceStatus) || 'present';
        remarksMap[student.student_id] = student.remarks || '';
      });
      
      setLocalStatus(statusMap);
      setLocalRemarks(remarksMap);
    } catch (error) {
      console.error('Failed to load attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    present: Object.values(localStatus).filter(v => v === 'present').length,
    absent: Object.values(localStatus).filter(v => v === 'absent').length,
    late: Object.values(localStatus).filter(v => v === 'late').length,
    excused: Object.values(localStatus).filter(v => v === 'excused').length,
    total: attendanceData.length
  };

  const attendanceRate = stats.total > 0 
    ? Math.round((stats.present / stats.total) * 100) 
    : 0;

  const updateStatus = useCallback((studentId: string, status: AttendanceStatus) => {
    setLocalStatus(prev => ({ ...prev, [studentId]: status }));
  }, []);

  const updateRemarks = useCallback((studentId: string, value: string) => {
    setLocalRemarks(prev => ({ ...prev, [studentId]: value }));
  }, []);

  const markAll = useCallback((status: AttendanceStatus) => {
    const newStatus: Record<string, AttendanceStatus> = {};
    attendanceData.forEach(student => {
      newStatus[student.student_id] = status;
    });
    setLocalStatus(newStatus);
  }, [attendanceData]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare payload matching backend schema exactly
      const payload = {
        lesson_id: lesson.id,
        attendances: attendanceData.map(student => ({
          enrollment_id: student.enrollment_id, // Use enrollment_id from loaded data
          student_id: student.student_id,       // Backend will map if enrollment_id missing
          status: localStatus[student.student_id] || 'present',
          remarks: localRemarks[student.student_id] || ''
        }))
      };

      console.log('Saving attendance payload:', payload);

      await AttendanceService.bulkCreate(payload);

      toast.success('Attendance saved successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      const message = extractErrorMessage(error);
      toast.error(message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: AttendanceStatus) => {
    const config = {
      present: 'bg-success',
      absent: 'bg-danger',
      late: 'bg-warning',
      excused: 'bg-info'
    };
    return config[status] || 'bg-secondary';
  };

  const getStatusColor = (status: AttendanceStatus) => {
    const colors = {
      present: 'text-success',
      absent: 'text-danger',
      late: 'text-warning',
      excused: 'text-info'
    };
    return colors[status] || 'text-secondary';
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        overflowY: 'auto'
      }}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-lg"
        style={{ maxWidth: '900px', margin: '1.75rem auto' }}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg">
          
          <div className="modal-header bg-gradient bg-info text-white rounded-top-4 py-3 px-4">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="modal-title mb-1 fw-semibold">
                    <i className="fa fa-calendar-check me-2" />
                    Attendance Record
                  </h5>
                  <p className="mb-0 opacity-75 small">
                    {lesson.title} • {attendanceData.length} Students
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white opacity-100" 
                  onClick={onClose}
                  disabled={saving}
                  aria-label="Close"
                />
              </div>
            </div>
          </div>

          <div className="modal-body p-0">
            <div className="bg-light px-4 py-3 border-bottom">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-muted mb-1 small">
                    <i className="fa fa-calendar me-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={new Date().toISOString().split('T')[0]}
                    disabled
                  />
                </div>
                <div className="col-md-8">
                  <label className="form-label fw-semibold text-muted mb-1 small">
                    Quick Actions
                  </label>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm flex-grow-1"
                      onClick={() => markAll('present')}
                      disabled={loading || saving}
                    >
                      <i className="fa fa-check me-1" />
                      All Present
                    </button>
                    <button
                      className="btn btn-danger btn-sm flex-grow-1"
                      onClick={() => markAll('absent')}
                      disabled={loading || saving}
                    >
                      <i className="fa fa-times me-1" />
                      All Absent
                    </button>
                    <button
                      className="btn btn-warning btn-sm flex-grow-1"
                      onClick={() => markAll('late')}
                      disabled={loading || saving}
                    >
                      <i className="fa fa-clock me-1" />
                      All Late
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-white border-bottom">
              <div className="row g-0 text-center">
                <div className="col-3">
                  <div className="p-2 border-end">
                    <div className="text-success fw-bold fs-4">{stats.present}</div>
                    <div className="text-muted small">Present</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2 border-end">
                    <div className="text-danger fw-bold fs-4">{stats.absent}</div>
                    <div className="text-muted small">Absent</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2 border-end">
                    <div className="text-warning fw-bold fs-4">{stats.late}</div>
                    <div className="text-muted small">Late</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2">
                    <div className="fw-bold fs-4">{attendanceRate}%</div>
                    <div className="text-muted small">Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="px-0" 
              style={{ 
                maxHeight: 'calc(100vh - 450px)', 
                minHeight: '300px',
                overflowY: 'auto' 
              }}
            >
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" />
                  <p className="text-muted">Loading attendance data...</p>
                </div>
              ) : attendanceData.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fa fa-users fa-3x text-muted mb-3" />
                  <p className="text-muted">No enrolled students found</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {attendanceData.map((student) => {
                    const status = localStatus[student.student_id] || 'present';
                    
                    return (
                      <div 
                        key={student.student_id}
                        className="list-group-item border-0 p-3 border-bottom"
                      >
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center flex-grow-1">
                            <div 
                              className={`rounded-circle d-flex align-items-center justify-content-center me-3 bg-opacity-10 ${getStatusBadge(status)}`}
                              style={{ width: '42px', height: '42px', flexShrink: 0 }}
                            >
                              <span className={`fw-semibold small ${getStatusColor(status)}`}>
                                {(student.names || 'S')
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-medium">{student.names}</div>
                              <small className="text-muted">{student.email}</small>
                            </div>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2">
                            <select
                              className="form-select form-select-sm border-2"
                              style={{ minWidth: '140px' }}
                              value={status}
                              onChange={(e) => updateStatus(
                                student.student_id, 
                                e.target.value as AttendanceStatus
                              )}
                              disabled={saving}
                            >
                              <option value="present">✅ Present</option>
                              <option value="absent">❌ Absent</option>
                              <option value="late">⏰ Late</option>
                              <option value="excused">📝 Excused</option>
                            </select>
                            {student.is_recorded && (
                              <span className="badge bg-primary rounded-pill px-2">
                                Saved
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Add remarks (optional)"
                          value={localRemarks[student.student_id] || ''}
                          onChange={(e) => updateRemarks(student.student_id, e.target.value)}
                          disabled={saving}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer bg-light rounded-bottom-4 px-4 py-3">
            <div className="d-flex justify-content-between w-100 gap-2">
              <button 
                className="btn btn-outline-secondary px-4"
                onClick={onClose}
                disabled={saving}
              >
                <i className="fa fa-times me-2" />
                Cancel
              </button>
              
              <button 
                className="btn btn-info px-5 fw-semibold shadow-sm"
                onClick={handleSave}
                disabled={loading || saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fa fa-save me-2" />
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFormModal;

