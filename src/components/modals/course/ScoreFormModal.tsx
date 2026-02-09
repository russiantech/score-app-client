// src/components/modals/course/FlexibleScoreModal.tsx
// Complete working score modal with proper state management

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/utils/helpers';
import { ScoreService } from '@/services/courses/Score';
import type { ScoreType, ScoreColumn, FlexibleScoreModalProps, StudentScoreData } from '@/types/course/score';


const ScoreFormModal = ({ 
  isOpen, 
  onClose, 
  lesson, 
  onSave 
}: FlexibleScoreModalProps) => {
  const [scoreData, setScoreData] = useState<StudentScoreData[]>([]);
  const [columns, setColumns] = useState<ScoreColumn[]>([]);
  const [localScores, setLocalScores] = useState<Record<string, Record<string, number>>>({});
  const [localRemarks, setLocalRemarks] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  useEffect(() => {
    if (isOpen && lesson?.id) {
      loadScores();
    }
  }, [isOpen, lesson?.id]);

  const loadScores = async () => {
    try {
      setLoading(true);
      const response = await ScoreService.getByLesson(lesson.id);
      
      setScoreData(response.students);
      setColumns(response.columns || getDefaultColumns());
      
      // Initialize local state from loaded data
      const scoresMap: Record<string, Record<string, number>> = {};
      const remarksMap: Record<string, Record<string, string>> = {};
      
      response.students.forEach(student => {
        scoresMap[student.student_id] = {};
        remarksMap[student.student_id] = {};
        
        Object.entries(student.scores || {}).forEach(([columnId, scoreData]) => {
          scoresMap[student.student_id][columnId] = scoreData.score;
          remarksMap[student.student_id][columnId] = scoreData.remarks || '';
        });
      });
      
      setLocalScores(scoresMap);
      setLocalRemarks(remarksMap);
    } catch (error) {
      console.error('Failed to load scores:', error);
      toast.error('Failed to load score data');
      
      // Initialize with defaults on error
      const defaultCols = getDefaultColumns();
      setColumns(defaultCols);
      initializeEmptyScores(defaultCols);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultColumns = (): ScoreColumn[] => [
    {
      id: 'temp_homework',
      type: 'homework',
      title: 'Homework',
      max_score: 30,
      weight: 0.3,
      order: 1,
      marksObtained: undefined,
      totalMarks: undefined,
      percentage: undefined,
      grade: function (_grade: any): unknown {
        throw new Error('Function not implemented.');
      }
    },
    {
      id: 'temp_classwork',
      type: 'classwork',
      title: 'Classwork',
      max_score: 20,
      weight: 0.2,
      order: 2,
      marksObtained: undefined,
      totalMarks: undefined,
      percentage: undefined,
      grade: function (_grade: any): unknown {
        throw new Error('Function not implemented.');
      }
    },
    {
      id: 'temp_quiz',
      type: 'quiz',
      title: 'Quiz',
      max_score: 50,
      weight: 0.5,
      order: 3,
      marksObtained: undefined,
      totalMarks: undefined,
      percentage: undefined,
      grade: function (): unknown {
        throw new Error('Function not implemented.');
      }
    }
  ];

  const initializeEmptyScores = (cols: ScoreColumn[]) => {
    const scoresMap: Record<string, Record<string, number>> = {};
    const remarksMap: Record<string, Record<string, string>> = {};
    
    scoreData.forEach(student => {
      scoresMap[student.student_id] = {};
      remarksMap[student.student_id] = {};
      cols.forEach(col => {
        scoresMap[student.student_id][col.id] = 0;
        remarksMap[student.student_id][col.id] = '';
      });
    });
    
    setLocalScores(scoresMap);
    setLocalRemarks(remarksMap);
  };

  const addColumn = (type: ScoreType) => {
    const newColumn: ScoreColumn = {
      id: `temp_${type}_${Date.now()}`,
      type,
      title: type === 'homework' ? 'New Homework' :
        type === 'classwork' ? 'New Classwork' :
          'New Assessment',
      max_score: 100,
      weight: 0.1,
      order: columns.length + 1,
      marksObtained: undefined,
      totalMarks: undefined,
      percentage: undefined,
      grade: function (): unknown {
        throw new Error('Function not implemented.');
      }
    };
    
    setColumns([...columns, newColumn]);
    
    // Initialize scores for new column
    const newScores = { ...localScores };
    const newRemarks = { ...localRemarks };
    
    Object.keys(newScores).forEach(studentId => {
      newScores[studentId][newColumn.id] = 0;
      newRemarks[studentId][newColumn.id] = '';
    });
    
    setLocalScores(newScores);
    setLocalRemarks(newRemarks);
  };

  const updateColumn = (columnId: string, updates: Partial<ScoreColumn>) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const removeColumn = (columnId: string) => {
    if (!window.confirm('Remove this column and all its scores?')) return;
    
    setColumns(columns.filter(col => col.id !== columnId));
    
    // Remove scores for this column
    const newScores = { ...localScores };
    const newRemarks = { ...localRemarks };
    
    Object.keys(newScores).forEach(studentId => {
      delete newScores[studentId][columnId];
      delete newRemarks[studentId][columnId];
    });
    
    setLocalScores(newScores);
    setLocalRemarks(newRemarks);
  };

  const normalizeWeights = () => {
    toast.success('Disabled temporarily as it\'s not applicable for current scoring system.');
    // return;

    const totalWeight = columns.reduce((sum, col) => sum + col.weight, 0);
    if (totalWeight === 0) return;
    
    setColumns(columns.map(col => ({
      ...col,
      weight: col.weight / totalWeight
    })));
    
    toast.success('Weights normalized to 100%');
  };

  const updateScore = useCallback((studentId: string, columnId: string, value: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column) return;
    
    const numValue = parseFloat(value) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), column.max_score);
    
    setLocalScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [columnId]: clampedValue
      }
    }));
  }, [columns]);


  const calculateTotal = (studentId: string): { total: number; percentage: number; grade: string } => {
    let weightedSum = 0;
    let totalWeight = 0;
    
    columns.forEach(col => {
      const score = localScores[studentId]?.[col.id] || 0;
      const percentage = col.max_score > 0 ? score / col.max_score : 0;
      weightedSum += percentage * col.weight * 100;
      totalWeight += col.weight;
    });
    
    const finalPercentage = totalWeight > 0 ? weightedSum / totalWeight : 0;
    
    let grade = 'F';
    if (finalPercentage >= 90) grade = 'A+';
    else if (finalPercentage >= 80) grade = 'A';
    else if (finalPercentage >= 75) grade = 'B+';
    else if (finalPercentage >= 70) grade = 'B';
    else if (finalPercentage >= 65) grade = 'C+';
    else if (finalPercentage >= 60) grade = 'C';
    else if (finalPercentage >= 55) grade = 'D+';
    else if (finalPercentage >= 50) grade = 'D';
    
    return {
      total: Math.round(finalPercentage * 10) / 10,
      percentage: Math.round(finalPercentage),
      grade
    };
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'info';
    if (grade.startsWith('D')) return 'warning';
    return 'danger';
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare payload matching backend schema
      const payload = {
        lesson_id: lesson.id,
        columns: columns.map(col => ({
          id: col.id,
          type: col.type,
          title: col.title,
          description: col.description || null,
          max_score: col.max_score,
          weight: col.weight,
          order: col.order
        })),
        scores: scoreData.map(student => ({
          enrollment_id: student.enrollment_id, // Use enrollment_id from loaded data
          student_id: student.student_id,
          column_scores: columns.map(col => ({
            column_id: col.id,
            score: localScores[student.student_id]?.[col.id] || 0,
            remarks: localRemarks[student.student_id]?.[col.id] || ''
          }))
        }))
      };

      console.log('Saving payload:', payload);

      await ScoreService.bulkCreate(payload);

      toast.success('Scores saved successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      const message = extractErrorMessage(error);
      toast.error(message || 'Failed to save scores');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, studentId: string, columnId: string, rowIndex: number, colIndex: number) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = rowIndex + 1;
      if (nextRow < scoreData.length) {
        const nextId = `${scoreData[nextRow].student_id}_${columnId}`;
        inputRefs.current[nextId]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = rowIndex - 1;
      if (prevRow >= 0) {
        const prevId = `${scoreData[prevRow].student_id}_${columnId}`;
        inputRefs.current[prevId]?.focus();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextCol = colIndex + 1;
      if (nextCol < columns.length) {
        const nextId = `${studentId}_${columns[nextCol].id}`;
        inputRefs.current[nextId]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevCol = colIndex - 1;
      if (prevCol >= 0) {
        const prevId = `${studentId}_${columns[prevCol].id}`;
        inputRefs.current[prevId]?.focus();
      }
    }
  };

  if (!isOpen) return null;

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
    maxWidth: '1100px',
    height: '90vh',
    margin: '0.75rem auto'
  }}
>


        <div className="modal-content rounded-4 border-0 shadow-lg h-100 d-flex flex-column">
          
          {/* Header */}
          <div className="modal-header bg-primary text-white rounded-top-4 py-3 px-4 flex-shrink-0">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-start">

                <div className="flex-grow-1 me-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fa fa-table fs-4 me-2" />
                    <h5 className="modal-title mb-0 fw-bold">Score Sheet - {lesson.title}</h5>
                  </div>

                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1">
                      <i className="fa fa-users me-1" />
                      <span>{scoreData.length} Students</span>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1">
                      <i className="fa fa-columns me-1" />
                      <span>{columns.length} Score Columns</span>
                    </div>

                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1 gap-1">
                      {/* <i className="fa fa-columns me-1" /> */}
                      <span className="badge bg-success rounded-pill px-2 py-1">A:8-10</span><span className="badge bg-info rounded-pill px-2 py-1">B:6-7.9</span><span className="badge bg-warning rounded-pill px-2 py-1">C:4-5.9</span><span className="badge bg-secondary rounded-pill px-2 py-1">D:2-3.9</span><span className="badge bg-danger rounded-pill px-2 py-1">F:0-1.9</span>
                    </div>

                  </div>
                  
                </div>
                
                
                <button 
                  type="button" 
                  className="btn-close btn-close-danger opacity-100" 
                  onClick={onClose}
                  disabled={saving}
                  aria-label="Close"
                />

              </div>
            </div>
          </div>

          {/* Column Configuration */}
          <div className="px-4 py-3 bg-light border-bottom flex-shrink-0">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Score Columns</h6>
              <div className="btn-group btn-group-sm gap-1" role="group">
                <button
                  className="btn btn-outline-success rounded"
                  onClick={() => addColumn('homework')}
                  disabled={loading || saving}
                >
                  <i className="fa fa-plus me-1" />
                  Homework
                </button>
                <button
                  className="btn btn-outline-info rounded"
                  onClick={() => addColumn('classwork')}
                  disabled={loading || saving}
                >
                  <i className="fa fa-plus me-1" />
                  Classwork
                </button>
                <button
                  className="btn btn-outline-primary rounded"
                  onClick={() => addColumn('quiz')}
                  disabled={loading || saving}
                >
                  <i className="fa fa-plus me-1" />
                  Custom
                </button>
                <button
                  className="btn btn-outline-warning rounded disabled"
                  onClick={normalizeWeights}
                  disabled={loading || saving}
                  title="Normalize all weights to sum to 100%"
                >
                  <i className="fa fa-balance-scale me-1" />
                  Normalize
                </button>
              </div>
            </div>
            
            <div className="d-flex gap-2 overflow-auto pb-2">
              {columns.map(col => (
                <div key={col.id} className="card" style={{ minWidth: '200px' }}>
                  <div className="card-body p-2">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className={`badge bg-${col.type === 'homework' ? 'success' : col.type === 'classwork' ? 'info' : 'primary'}`}>
                        {col.type}
                      </span>
                      <button
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={() => removeColumn(col.id)}
                        disabled={saving}
                      >
                        <i className="fa fa-times" />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      value={col.title}
                      onChange={e => updateColumn(col.id, { title: e.target.value })}
                      placeholder="Title"
                      disabled={saving}
                    />
                    <div className="row g-1">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={col.max_score}
                          onChange={e => updateColumn(col.id, { max_score: parseInt(e.target.value) || 100 })}
                          min="1"
                          placeholder="Max"
                          disabled={saving}
                        />
                        <small className="text-muted">Max</small>
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={Math.round(col.weight * 100)}
                          onChange={e => updateColumn(col.id, { weight: (parseInt(e.target.value) || 0) / 100 })}
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
          </div>

          {/* Score Table */}
          <div className="flex-grow-1 overflow-hidden">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" />
                  <p className="text-muted">Loading scores...</p>
                </div>
              </div>
            ) : (
              <div className="table-responsive h-100">
                <table className="table table-hover table-sm align-middle mb-0">
                  <thead className="table-light sticky-top" style={{ top: 0, zIndex: 10 }}>
                    <tr>
                      <th className="px-2 py-2" style={{ width: '200px', position: 'sticky', left: 0, backgroundColor: 'inherit', zIndex: 11 }}>
                        Students
                      </th>
                      {columns.map(col => (
                        <th key={col.id} className="text-center px-1 py-2" style={{ minWidth: '100px' }}>
                          <div className="fw-semibold small">{col.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                            /{col.max_score} ({Math.round(col.weight * 100)}%)
                          </div>
                        </th>
                      ))}
                      <th className="text-center px-2 py-2 bg-light" style={{ width: '100px', position: 'sticky', right: 0, zIndex: 11 }}>
                        <div className="fw-bold">Total</div>
                        <div className="text-muted small">Grade</div>
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {scoreData.map((student, rowIndex) => {
                      const totals = calculateTotal(student.student_id);
                      
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
                          
                          {columns.map((col, colIndex) => (
                            <td key={col.id} className="text-center px-1 py-1">
                              <input
                                ref={el => {
                                  if (el) inputRefs.current[`${student.student_id}_${col.id}`] = el;
                                }}
                                type="number"
                                className="form-control form-control-sm text-center"
                                style={{ fontSize: '0.85rem' }}
                                min="0"
                                max={col.max_score}
                                step="0.5"
                                value={localScores[student.student_id]?.[col.id] || ''}
                                onChange={e => updateScore(student.student_id, col.id, e.target.value)}
                                onKeyDown={e => handleKeyDown(e, student.student_id, col.id, rowIndex, colIndex)}
                                onFocus={e => e.target.select()}
                                placeholder="0"
                                disabled={saving}
                              />
                            </td>
                          ))}
                          
                          <td className="text-center px-2 py-1 bg-light" style={{ position: 'sticky', right: 0, zIndex: 8 }}>
                            <div className="fw-bold">{totals.percentage}%</div>
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
                className="btn btn-primary px-5 fw-semibold shadow-sm"
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
                    Save All Scores
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

export default ScoreFormModal;
