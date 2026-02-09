// src/components/modals/course/ModuleExamModal.tsx
// Module-level exam scoring interface

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { calculateGrade, extractErrorMessage, getGradeColor } from '@/utils/helpers';
import type { ModuleExamScoreModalProps, StudentExamData } from '@/types/course/module';
import { ScoreService } from '@/services/courses/Score';

const ModuleExamScoreModal = ({ 
  isOpen, 
  onClose, 
  module, 
  onSave 
}: ModuleExamScoreModalProps) => {
  const [students, setStudents] = useState<StudentExamData[]>([]);
  const [localScores, setLocalScores] = useState<Record<string, number>>({});
  const [localRemarks, setLocalRemarks] = useState<Record<string, string>>({});
  const [maxScore, setMaxScore] = useState(100);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  useEffect(() => {
    if (isOpen && module?.id) {
      loadExamScores();
    }
  }, [isOpen, module?.id]);

  const loadExamScores = async () => {
    try {
      setLoading(true);
      const response = await ScoreService.getByModule(module.id);
      
      setStudents(response.students);
      
      // Get max score from first student or default
      const firstMax = response.students[0]?.max_score || 100;
      setMaxScore(firstMax);
      
      // Initialize local state
      const scoresMap: Record<string, number> = {};
      const remarksMap: Record<string, string> = {};
      
      // response.students.forEach(student => {
      //   scoresMap[student.student_id] = student.exam_score || 0;
      //   remarksMap[student.student_id] = student.remarks || '';
      // });
      
      // Add type annotation:      
      response.students.forEach((student: StudentExamData) => {
        scoresMap[student.student_id] = student.exam_score || 0;
        remarksMap[student.student_id] = student.remarks || '';
      });
            
      setLocalScores(scoresMap);
      setLocalRemarks(remarksMap);
    } catch (error) {
      console.error('Failed to load exam scores:', error);
      toast.error('Failed to load exam data');
    } finally {
      setLoading(false);
    }
  };

  const updateScore = useCallback((studentId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), maxScore);
    
    setLocalScores(prev => ({
      ...prev,
      [studentId]: clampedValue
    }));
  }, [maxScore]);

  const updateRemarks = useCallback((studentId: string, value: string) => {
    setLocalRemarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        module_id: module.id,
        columns: [
          {
            id: 'module_exam',
            type: 'exam',
            title: `${module.title} - Exam`,
            max_score: maxScore,
            weight: 1.0,
            order: 1
          }
        ],
        scores: students.map(student => ({
          enrollment_id: student.enrollment_id,
          student_id: student.student_id,
          column_scores: [
            {
              column_id: 'module_exam',
              score: localScores[student.student_id] || 0,
              remarks: localRemarks[student.student_id] || ''
            }
          ]
        }))
      };

      await ScoreService.bulkCreateModule(payload);

      toast.success('Exam scores saved successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      const message = extractErrorMessage(error);
      toast.error(message || 'Failed to save exam scores');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, _studentId: string, rowIndex: number) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = rowIndex + 1;
      if (nextRow < students.length) {
        inputRefs.current[students[nextRow].student_id]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = rowIndex - 1;
      if (prevRow >= 0) {
        inputRefs.current[students[prevRow].student_id]?.focus();
      }
    }
  };

  const calculateStats = () => {
    const scores = Object.values(localScores);
    if (scores.length === 0) return { avg: 0, highest: 0, lowest: 0, passRate: 0 };
    
    const total = scores.reduce((sum, s) => sum + s, 0);
    const avg = total / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passed = scores.filter(s => (s / maxScore * 100) >= 50).length;
    const passRate = (passed / scores.length) * 100;
    
    return {
      avg: Math.round(avg * 10) / 10,
      highest,
      lowest,
      passRate: Math.round(passRate)
    };
  };

  if (!isOpen) return null;

  const stats = calculateStats();

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
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '90vh',
          margin: '0.75rem auto'
        }}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg h-100 d-flex flex-column">
          
          {/* Header */}
          <div className="modal-header bg-danger text-white rounded-top-4 py-3 px-4 flex-shrink-0">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 me-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fa fa-file-text fs-4 me-2" />
                    <h5 className="modal-title mb-0 fw-bold">Module Exam - {module.title}</h5>
                  </div>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1">
                      <i className="fa fa-users me-1" />
                      <span>{students.length} Students</span>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1">
                      <i className="fa fa-chart-bar me-1" />
                      <span>Avg: {stats.avg}/{maxScore}</span>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1">
                      <i className="fa fa-check-circle me-1" />
                      <span>Pass Rate: {stats.passRate}%</span>
                    </div>
                  </div>
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

          {/* Max Score Configuration */}
          <div className="px-4 py-3 bg-light border-bottom flex-shrink-0">
            <div className="row align-items-center">
              <div className="col-md-6">
                <label className="form-label fw-semibold mb-1">Maximum Score</label>
                <input
                  type="number"
                  className="form-control"
                  value={maxScore}
                  onChange={e => setMaxScore(parseInt(e.target.value) || 100)}
                  min="1"
                  disabled={saving}
                  placeholder="100"
                />
              </div>
              <div className="col-md-6">
                <div className="alert alert-info mb-0 py-2">
                  <small>
                    <i className="fa fa-info-circle me-1" />
                    Enter the total marks for this module exam. Grades will be calculated automatically.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Score Table */}
          <div className="flex-grow-1 overflow-hidden">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center py-5">
                  <div className="spinner-border text-danger mb-3" />
                  <p className="text-muted">Loading exam scores...</p>
                </div>
              </div>
            ) : (
              <div className="table-responsive h-100">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light sticky-top" style={{ top: 0, zIndex: 10 }}>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th style={{ width: '250px' }}>Student</th>
                      <th className="text-center" style={{ width: '150px' }}>
                        Score (/{maxScore})
                      </th>
                      <th className="text-center" style={{ width: '100px' }}>
                        Percentage
                      </th>
                      <th className="text-center" style={{ width: '80px' }}>
                        Grade
                      </th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {students.map((student, index) => {
                      const score = localScores[student.student_id] || 0;
                      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                      const grade = calculateGrade(percentage);
                      
                      return (
                        <tr key={student.student_id}>
                          <td className="text-muted">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                                style={{ width: '32px', height: '32px', flexShrink: 0 }}
                              >
                                <span className="fw-semibold small">
                                  {(student.names || 'S').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="fw-medium">{student.names}</div>
                                <small className="text-muted">{student.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <input
                              ref={el => {
                                if (el) inputRefs.current[student.student_id] = el;
                              }}
                              type="number"
                              className="form-control form-control-lg text-center fw-bold"
                              min="0"
                              max={maxScore}
                              step="0.5"
                              value={score || ''}
                              onChange={e => updateScore(student.student_id, e.target.value)}
                              onKeyDown={e => handleKeyDown(e, student.student_id, index)}
                              onFocus={e => e.target.select()}
                              placeholder="0"
                              disabled={saving}
                            />
                          </td>
                          <td className="text-center">
                            <span className="fs-5 fw-semibold">
                              {Math.round(percentage)}%
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={`badge bg-${getGradeColor(grade)} fs-6 px-3 py-2`}>
                              {grade}
                            </span>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={localRemarks[student.student_id] || ''}
                              onChange={e => updateRemarks(student.student_id, e.target.value)}
                              placeholder="Optional feedback..."
                              disabled={saving}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Statistics Bar */}
          <div className="px-4 py-2 bg-light border-top flex-shrink-0">
            <div className="row text-center">
              <div className="col-3">
                <small className="text-muted d-block">Average</small>
                <strong className="fs-5">{stats.avg}/{maxScore}</strong>
              </div>
              <div className="col-3">
                <small className="text-muted d-block">Highest</small>
                <strong className="fs-5 text-success">{stats.highest}/{maxScore}</strong>
              </div>
              <div className="col-3">
                <small className="text-muted d-block">Lowest</small>
                <strong className="fs-5 text-danger">{stats.lowest}/{maxScore}</strong>
              </div>
              <div className="col-3">
                <small className="text-muted d-block">Pass Rate</small>
                <strong className="fs-5 text-primary">{stats.passRate}%</strong>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light rounded-bottom-4 px-4 py-3 flex-shrink-0">
            <div className="d-flex justify-content-between w-100 gap-2">
              <button
                className="btn btn-outline-secondary px-4"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger px-5 fw-semibold shadow-sm"
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
                    Save Exam Scores
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

export default ModuleExamScoreModal;

