// src/components/modals/course/CourseProjectModal.tsx
// Course-level project scoring interface

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/utils/helpers';
import type { Course } from '@/types/course';
import { ScoreService } from '@/services/courses/Score';

interface CourseProjectScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onSave: () => void;
}

interface ProjectRubricItem {
  id: string;
  title: string;
  max_score: number;
  weight: number;
}

interface StudentProjectData {
  enrollment_id: string;
  student_id: string;
  names: string;
  email: string;
  username?: string;
  rubric_scores: Record<string, number>;
  total_score: number;
  max_score: number;
  percentage: number;
  grade: string | null;
  remarks: string;
  score_id: string | null;
  is_recorded: boolean;
}

const CourseProjectScoreModal = ({ 
  isOpen, 
  onClose, 
  course, 
  onSave 
}: CourseProjectScoreModalProps) => {
  const [students, setStudents] = useState<StudentProjectData[]>([]);
  const [rubricItems, setRubricItems] = useState<ProjectRubricItem[]>([
    { id: 'req', title: 'Requirements', max_score: 25, weight: 0.25 },
    { id: 'impl', title: 'Implementation', max_score: 35, weight: 0.35 },
    { id: 'doc', title: 'Documentation', max_score: 20, weight: 0.20 },
    { id: 'pres', title: 'Presentation', max_score: 20, weight: 0.20 }
  ]);
  const [localScores, setLocalScores] = useState<Record<string, Record<string, number>>>({});
  const [localRemarks, setLocalRemarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRubricConfig, setShowRubricConfig] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  useEffect(() => {
    if (isOpen && course?.id) {
      loadProjectScores();
    }
  }, [isOpen, course?.id]);

  const loadProjectScores = async () => {
    try {
      setLoading(true);
      const response = await ScoreService.getByCourse(course.id);
      
      setStudents(response.students);
      
      if (response.rubric_items?.length > 0) {
        setRubricItems(response.rubric_items);
      }
      
      // Initialize local state
      const scoresMap: Record<string, Record<string, number>> = {};
      const remarksMap: Record<string, string> = {};
      
      response.students.forEach(student => {
        scoresMap[student.student_id] = student.rubric_scores || {};
        remarksMap[student.student_id] = student.remarks || '';
      });
      
      setLocalScores(scoresMap);
      setLocalRemarks(remarksMap);
    } catch (error) {
      console.error('Failed to load project scores:', error);
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 55) return 'D+';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'info';
    if (grade.startsWith('D')) return 'warning';
    return 'danger';
  };

  const updateRubricScore = useCallback((studentId: string, rubricId: string, value: string) => {
    const rubric = rubricItems.find(r => r.id === rubricId);
    if (!rubric) return;
    
    const numValue = parseFloat(value) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), rubric.max_score);
    
    setLocalScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [rubricId]: clampedValue
      }
    }));
  }, [rubricItems]);

  const updateRemarks = useCallback((studentId: string, value: string) => {
    setLocalRemarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  }, []);

  const calculateStudentTotal = (studentId: string) => {
    let totalScore = 0;
    let maxTotal = 0;
    
    rubricItems.forEach(rubric => {
      const score = localScores[studentId]?.[rubric.id] || 0;
      totalScore += score;
      maxTotal += rubric.max_score;
    });
    
    const percentage = maxTotal > 0 ? (totalScore / maxTotal) * 100 : 0;
    
    return {
      totalScore,
      maxTotal,
      percentage,
      grade: calculateGrade(percentage)
    };
  };

  const addRubricItem = () => {
    const newItem: ProjectRubricItem = {
      id: `item_${Date.now()}`,
      title: 'New Criterion',
      max_score: 10,
      weight: 0.1
    };
    setRubricItems([...rubricItems, newItem]);
  };

  const updateRubricItem = (id: string, updates: Partial<ProjectRubricItem>) => {
    setRubricItems(rubricItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeRubricItem = (id: string) => {
    if (!window.confirm('Remove this criterion?')) return;
    setRubricItems(rubricItems.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        course_id: course.id,
        columns: rubricItems.map((rubric, index) => ({
          id: rubric.id,
          type: 'project',
          title: rubric.title,
          max_score: rubric.max_score,
          weight: rubric.weight,
          order: index + 1
        })),
        scores: students.map(student => ({
          enrollment_id: student.enrollment_id,
          student_id: student.student_id,
          column_scores: rubricItems.map(rubric => ({
            column_id: rubric.id,
            score: localScores[student.student_id]?.[rubric.id] || 0,
            remarks: localRemarks[student.student_id] || ''
          }))
        }))
      };

      await ScoreService.bulkCreateCourse(payload);

      toast.success('Project scores saved successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      const message = extractErrorMessage(error);
      toast.error(message || 'Failed to save project scores');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent, 
    studentId: string, 
    rubricId: string, 
    rowIndex: number, 
    colIndex: number
  ) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = rowIndex + 1;
      if (nextRow < students.length) {
        const nextId = `${students[nextRow].student_id}_${rubricId}`;
        inputRefs.current[nextId]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = rowIndex - 1;
      if (prevRow >= 0) {
        const prevId = `${students[prevRow].student_id}_${rubricId}`;
        inputRefs.current[prevId]?.focus();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextCol = colIndex + 1;
      if (nextCol < rubricItems.length) {
        const nextId = `${studentId}_${rubricItems[nextCol].id}`;
        inputRefs.current[nextId]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevCol = colIndex - 1;
      if (prevCol >= 0) {
        const prevId = `${studentId}_${rubricItems[prevCol].id}`;
        inputRefs.current[prevId]?.focus();
      }
    }
  };

  if (!isOpen) return null;

  const totalMaxScore = rubricItems.reduce((sum, r) => sum + r.max_score, 0);

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
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: '90vh',
          margin: '0.75rem auto'
        }}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg h-100 d-flex flex-column">
          
          {/* Header */}
          <div className="modal-header bg-success text-white rounded-top-4 py-3 px-4 flex-shrink-0">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 me-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fa fa-project-diagram fs-4 me-2" />
                    <h5 className="modal-title mb-0 fw-bold">Course Project - {course.title}</h5>
                  </div>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1">
                      <i className="fa fa-users me-1" />
                      <span>{students.length} Students</span>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1">
                      <i className="fa fa-list me-1" />
                      <span>{rubricItems.length} Criteria</span>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1">
                      <i className="fa fa-star me-1" />
                      <span>Total: {totalMaxScore} marks</span>
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

          {/* Rubric Configuration */}
          <div className="px-4 py-3 bg-light border-bottom flex-shrink-0">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Project Rubric</h6>
              <div className="btn-group btn-group-sm gap-1">
                <button
                  className="btn btn-outline-success rounded"
                  onClick={addRubricItem}
                  disabled={loading || saving}
                >
                  <i className="fa fa-plus me-1" />
                  Add Criterion
                </button>
                <button
                  className="btn btn-outline-secondary rounded"
                  onClick={() => setShowRubricConfig(!showRubricConfig)}
                >
                  <i className={`fa fa-${showRubricConfig ? 'eye-slash' : 'eye'} me-1`} />
                  {showRubricConfig ? 'Hide' : 'Show'} Config
                </button>
              </div>
            </div>
            
            {showRubricConfig && (
              <div className="d-flex gap-2 overflow-auto pb-2">
                {rubricItems.map(rubric => (
                  <div key={rubric.id} className="card" style={{ minWidth: '200px' }}>
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-success">Criterion</span>
                        <button
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => removeRubricItem(rubric.id)}
                          disabled={saving}
                        >
                          <i className="fa fa-times" />
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2"
                        value={rubric.title}
                        onChange={e => updateRubricItem(rubric.id, { title: e.target.value })}
                        placeholder="Criterion name"
                        disabled={saving}
                      />
                      <div className="row g-1">
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={rubric.max_score}
                            onChange={e => updateRubricItem(rubric.id, { max_score: parseInt(e.target.value) || 10 })}
                            min="1"
                            placeholder="Max"
                            disabled={saving}
                          />
                          <small className="text-muted">Max Score</small>
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={Math.round(rubric.weight * 100)}
                            onChange={e => updateRubricItem(rubric.id, { weight: (parseInt(e.target.value) || 0) / 100 })}
                            min="0"
                            max="100"
                            placeholder="Weight"
                            disabled={saving}
                          />
                          <small className="text-muted">Weight %</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Score Table */}
          <div className="flex-grow-1 overflow-hidden">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center py-5">
                  <div className="spinner-border text-success mb-3" />
                  <p className="text-muted">Loading project scores...</p>
                </div>
              </div>
            ) : (
              <div className="table-responsive h-100">
                <table className="table table-hover table-sm align-middle mb-0">
                  <thead className="table-light sticky-top" style={{ top: 0, zIndex: 10 }}>
                    <tr>
                      <th className="px-2 py-2" style={{ width: '200px', position: 'sticky', left: 0, backgroundColor: 'inherit', zIndex: 11 }}>
                        Student
                      </th>
                      {rubricItems.map(rubric => (
                        <th key={rubric.id} className="text-center px-1 py-2" style={{ minWidth: '100px' }}>
                          <div className="fw-semibold small">{rubric.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                            /{rubric.max_score}
                          </div>
                        </th>
                      ))}
                      <th className="text-center px-2 py-2 bg-light" style={{ width: '120px', position: 'sticky', right: 0, zIndex: 11 }}>
                        <div className="fw-bold">Total</div>
                        <div className="text-muted small">/{totalMaxScore}</div>
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {students.map((student, rowIndex) => {
                      const totals = calculateStudentTotal(student.student_id);
                      
                      return (
                        <tr key={student.student_id}>
                          <td className="px-2 py-1" style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 9 }}>
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                                style={{ width: '28px', height: '28px', flexShrink: 0 }}
                              >
                                <span className="fw-semibold" style={{ fontSize: '0.7rem' }}>
                                  {(student.names || 'S').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.85rem' }}>
                                <div className="fw-medium">{student.names}</div>
                              </div>
                            </div>
                          </td>
                          
                          {rubricItems.map((rubric, colIndex) => (
                            <td key={rubric.id} className="text-center px-1 py-1">
                              <input
                                ref={el => {
                                  if (el) inputRefs.current[`${student.student_id}_${rubric.id}`] = el;
                                }}
                                type="number"
                                className="form-control form-control-sm text-center"
                                style={{ fontSize: '0.85rem' }}
                                min="0"
                                max={rubric.max_score}
                                step="0.5"
                                value={localScores[student.student_id]?.[rubric.id] || ''}
                                onChange={e => updateRubricScore(student.student_id, rubric.id, e.target.value)}
                                onKeyDown={e => handleKeyDown(e, student.student_id, rubric.id, rowIndex, colIndex)}
                                onFocus={e => e.target.select()}
                                placeholder="0"
                                disabled={saving}
                              />
                            </td>
                          ))}
                          
                          <td className="text-center px-2 py-1 bg-light" style={{ position: 'sticky', right: 0, zIndex: 8 }}>
                            <div className="fw-bold">{totals.totalScore}/{totals.maxTotal}</div>
                            <div className="small">{Math.round(totals.percentage)}%</div>
                            <span className={`badge bg-${getGradeColor(totals.grade)}`}>
                              {totals.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
                className="btn btn-success px-5 fw-semibold shadow-sm"
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
                    Save Project Scores
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

export default CourseProjectScoreModal;