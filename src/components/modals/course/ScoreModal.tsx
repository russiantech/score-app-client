
// // v5 - 
// import { useState, useEffect, useCallback } from 'react';
// import { ASSESSMENT_CONFIG, GRADING_SCALE } from '@/configs/courses'
// import { Button } from '@/components/buttons/Button'
// import type { ScoreModalProps } from '@/types/course/score';

// const ScoreModal = ({ lesson, course, students, onClose, onSave }: ScoreModalProps) => {
//   const [scores, setScores] = useState(() => 
//     students.reduce((acc, student) => ({
//       ...acc,
//       [student.id]: ASSESSMENT_CONFIG.reduce((sAcc, assessment) => ({
//         ...sAcc,
//         [assessment.id]: ''
//       }), {})
//     }), {})
//   );
//   const [autoGradeMode, setAutoGradeMode] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, []);

//   const updateScore = useCallback((studentId: string | number, assessmentId: any, value: string) => {
//     let processedValue = value;
    
//     if (value !== '') {
//       const numValue = parseFloat(value);
//       const assessment = ASSESSMENT_CONFIG.find(a => a.id === assessmentId);
      
//       if (autoGradeMode && numValue > 10) {
//         const scaledValue = (numValue / 100) * assessment.maxScore;
//         processedValue = Math.min(scaledValue, assessment.maxScore).toFixed(1);
//       } else {
//         processedValue = Math.min(Math.max(numValue, 0), assessment.maxScore).toString();
//       }
//     }

//     setScores(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [assessmentId]: processedValue
//       }
//     }));
//   }, [autoGradeMode]);

//   const calculateTotal = useCallback((studentScores: { [x: string]: any; }) => {
//     let total = 0;
//     let totalWeight = 0;
    
//     ASSESSMENT_CONFIG.forEach(assessment => {
//       const score = studentScores[assessment.id];
//       if (score && !isNaN(score) && score !== '') {
//         if (assessment.optional && (!score || score === '')) return;
//         total += (parseFloat(score) * assessment.weight);
//         totalWeight += assessment.weight;
//       }
//     });
    
//     if (totalWeight < 1) {
//       total = (total / totalWeight) * 1;
//     }
    
//     return Math.min(total, 10).toFixed(1);
//   }, []);

//   const getGrade = useCallback((score: string) => {
//     const numScore = parseFloat(score);
//     for (const grade in GRADING_SCALE) {
//       if (numScore >= GRADING_SCALE[grade].min && numScore <= GRADING_SCALE[grade].max) {
//         return GRADING_SCALE[grade];
//       }
//     }
//     return GRADING_SCALE.F;
//   }, []);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await onSave(scores);
//     } catch (error) {
//       console.error('Save error:', error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const clearAllScores = () => {
//     setScores(students.reduce((acc, student) => ({
//       ...acc,
//       [student.id]: ASSESSMENT_CONFIG.reduce((sAcc, assessment) => ({
//         ...sAcc,
//         [assessment.id]: ''
//       }), {})
//     }), {}));
//   };

//   const calculateStats = useCallback(() => {
//     const totals = students.map(student => 
//       parseFloat(calculateTotal(scores[student.id])) || 0
//     );
//     const average = totals.reduce((a, b) => a + b, 0) / totals.length;
//     const maxScore = Math.max(...totals);
//     const scoresEntered = Object.values(scores).reduce((count, studentScores) => 
//       count + Object.values(studentScores).filter(s => s !== '' && s !== undefined).length, 0
//     );

//     return {
//       average: isNaN(average) ? '0.0' : average.toFixed(1),
//       maxScore: maxScore === -Infinity ? '0.0' : maxScore.toFixed(1),
//       scoresEntered
//     };
//   }, [students, scores, calculateTotal]);

//   const stats = calculateStats();

//   return (
//     <div 
//       className="modal fade show d-block" 
//       style={{ 
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         zIndex: 1050
//       }}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div 
//         className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
//         style={{
//           maxWidth: '95vw',
//           margin: '1rem auto',
//           height: 'calc(100vh - 2rem)'
//         }}
//       >
//         <div className="modal-content rounded-4 border-0 shadow-lg h-100">
          
//           {/* Header */}
//           <div className="modal-header bg-primary text-white rounded-top-4 py-3 px-4">
//             <div className="w-100">
//               <div className="d-flex justify-content-between align-items-start">
//                 <div className="flex-grow-1 me-3">
//                   <div className="d-flex align-items-center mb-2">
//                     <i className="fa fa-journal-text fs-4 me-2"></i>
//                     <h5 className="modal-title mb-0 fw-bold">Record Scores</h5>
//                   </div>
//                   <div className="d-flex align-items-center flex-wrap gap-2">
//                     <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1 d-inline-flex align-items-center">
//                       <i className="fa fa-book me-2 fs-6"></i>
//                       <span className="fw-medium">{course?.code || 'N/A'}: {lesson.title}</span>
//                     </div>
//                     <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1 d-inline-flex align-items-center">
//                       <i className="fa fa-users me-2 fs-6"></i>
//                       <span>{students.length} Students</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white opacity-100 ms-2 flex-shrink-0" 
//                   onClick={onClose}
//                   aria-label="Close"
//                 />
//               </div>
              
//               {/* Controls */}
//               <div className="d-flex flex-wrap align-items-center gap-2 mt-2 pt-2 border-top border-white border-opacity-25">
//                 <div className="form-check form-switch mb-0">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="autoGradeSwitch"
//                     checked={autoGradeMode}
//                     onChange={(e) => setAutoGradeMode(e.target.checked)}
//                   />
//                   <label className="form-check-label ms-2 fw-medium" htmlFor="autoGradeSwitch">
//                     Auto-grade
//                   </label>
//                 </div>
                
//                 <div className="d-flex gap-1 ms-auto flex-wrap">
//                   <span className="badge bg-success rounded-pill px-2 py-1">A:8-10</span>
//                   <span className="badge bg-info rounded-pill px-2 py-1">B:6-7.9</span>
//                   <span className="badge bg-warning rounded-pill px-2 py-1">C:4-5.9</span>
//                   <span className="badge bg-secondary rounded-pill px-2 py-1">D:2-3.9</span>
//                   <span className="badge bg-danger rounded-pill px-2 py-1">F:0-1.9</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="modal-body p-0 d-flex flex-column">
//             <div className="table-responsive flex-grow-1" style={{ minHeight: 0 }}>
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light sticky-top" style={{ top: 0, zIndex: 10 }}>
//                   <tr>
//                     <th className="sticky-left bg-white align-middle px-2 py-2" style={{ width: '150px', left: 0, zIndex: 12, boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }}>
//                       <div className="fw-semibold">Student</div>
//                     </th>
                    
//                     {ASSESSMENT_CONFIG.map((assessment) => (
//                       <th key={assessment.id} className="text-center align-middle px-1 py-2" style={{ width: '110px' }}>
//                         <div className="fw-semibold mb-1">{assessment.label}</div>
//                         <span className={`badge bg-${assessment.color} rounded-pill`}>/{assessment.maxScore}</span>
//                         <small className="text-muted d-block mt-1">{assessment.weight * 100}%</small>
//                       </th>
//                     ))}
                    
//                     <th className="text-center fw-bold bg-light align-middle sticky-right px-2 py-2" style={{ width: '100px', right: 0, zIndex: 11, boxShadow: '-2px 0 4px rgba(0,0,0,0.1)' }}>
//                       <div className="mb-1">Total</div>
//                       <small className="text-muted">/10</small>
//                     </th>
//                   </tr>
//                 </thead>
                
//                 <tbody>
//                   {students.map((student, idx) => {
//                     const totalScore = calculateTotal(scores[student.id]);
//                     const gradeInfo = getGrade(totalScore);
                    
//                     return (
//                       <tr key={student.id}>
//                         <td className="sticky-left bg-white align-middle px-2 py-1" style={{ left: 0, zIndex: 9, boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }}>
//                           <div className="d-flex align-items-center">
//                             <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
//                               <span className="fw-semibold small">{student.username?.substring(0, 2).toUpperCase() || 'ST'}</span>
//                             </div>
//                             <div className="text-truncate">
//                               <div className="fw-medium small">{student.username || student.names}</div>
//                             </div>
//                           </div>
//                         </td>
                        
//                         {ASSESSMENT_CONFIG.map((assessment) => (
//                           <td key={assessment.id} className="text-center align-middle p-1">
//                             <input
//                               type="number"
//                               className="form-control rounded-2 text-center"
//                               min="0"
//                               max={assessment.maxScore}
//                               step="0.1"
//                               value={scores[student.id]?.[assessment.id] || ''}
//                               onChange={(e) => updateScore(student.id, assessment.id, e.target.value)}
//                               onFocus={(e) => e.target.select()}
//                               placeholder="0"
//                               style={{ borderColor: `var(--bs-${assessment.color})` }}
//                             />
//                           </td>
//                         ))}
                        
//                         <td className="text-center align-middle fw-bold sticky-right bg-light px-2 py-1" style={{ right: 0, zIndex: 8, boxShadow: '-2px 0 4px rgba(0,0,0,0.1)' }}>
//                           <span className={`badge bg-${gradeInfo.color} fs-6 px-2 py-1`}>{totalScore}</span>
//                           <div className="mt-1">
//                             <span className={`badge bg-${gradeInfo.color} bg-opacity-10 text-${gradeInfo.color}`}>{gradeInfo.grade}</span>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Stats */}
//             <div className="border-top bg-light px-3 py-2">
//               <div className="row g-2">
//                 <div className="col-4">
//                   <div className="d-flex align-items-center">
//                     <i className="fa fa-check-circle text-success me-2"></i>
//                     <div>
//                       <div className="text-muted small">Scores</div>
//                       <div className="fw-semibold">{stats.scoresEntered}/{students.length * ASSESSMENT_CONFIG.length}</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-4">
//                   <div className="d-flex align-items-center">
//                     <i className="fa fa-chart-line text-info me-2"></i>
//                     <div>
//                       <div className="text-muted small">Average</div>
//                       <div className="fw-semibold">{stats.average}</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-4">
//                   <div className="d-flex align-items-center">
//                     <i className="fa fa-star text-warning me-2"></i>
//                     <div>
//                       <div className="text-muted small">Top</div>
//                       <div className="fw-semibold">{stats.maxScore}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="modal-footer bg-light rounded-bottom-4 px-3 py-2">
//             <div className="d-flex justify-content-between w-100 gap-2">
//               <div className="d-flex gap-2">
//                 <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
//                 <Button variant="outline-danger" onClick={clearAllScores}>Clear All</Button>
//               </div>
//               <Button variant="primary" loading={saving} onClick={handleSave}>
//                 Save All Scores
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScoreModal;




// v2
// src/components/modals/course/ScoreModal.tsx
import { useState, useEffect, useCallback } from 'react';
import { ASSESSMENT_CONFIG, GRADING_SCALE } from '@/configs/courses';
import { Button } from '@/components/buttons/Button';
import type { AllScores, ScoreModalProps, StudentScores } from '@/types/course/score';


const ScoreModal = ({ lesson, course, students, onClose, onSave }: ScoreModalProps) => {
  const [scores, setScores] = useState<AllScores>(() => 
    students.reduce((acc, student) => ({
      ...acc,
      [student.id]: ASSESSMENT_CONFIG.reduce((sAcc, assessment) => ({
        ...sAcc,
        [assessment.id]: ''
      }), {} as StudentScores)
    }), {} as AllScores)
  );
  const [autoGradeMode, setAutoGradeMode] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const updateScore = useCallback((studentId: string, assessmentId: string, value: string) => {
    let processedValue = value;
    
    if (value !== '') {
      const numValue = parseFloat(value);
      const assessment = ASSESSMENT_CONFIG.find(a => a.id === assessmentId);
      
      if (assessment) {
        if (autoGradeMode && numValue > 10) {
          const scaledValue = (numValue / 100) * assessment.max_score;
          processedValue = Math.min(scaledValue, assessment.max_score).toFixed(1);
        } else {
          processedValue = Math.min(Math.max(numValue, 0), assessment.max_score).toString();
        }
      }
    }

    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [assessmentId]: processedValue
      }
    }));
  }, [autoGradeMode]);

  const calculateTotal = useCallback((studentScores: StudentScores): string => {
    let total = 0;
    let totalWeight = 0;
    
    ASSESSMENT_CONFIG.forEach(assessment => {
      const score = studentScores?.[assessment.id];
      if (score && !isNaN(parseFloat(score)) && score !== '') {
        if (assessment.optional && (!score || score === '')) return;
        total += (parseFloat(score) * assessment.weight);
        totalWeight += assessment.weight;
      }
    });
    
    if (totalWeight < 1 && totalWeight > 0) {
      total = (total / totalWeight) * 1;
    }
    
    return Math.min(total, 10).toFixed(1);
  }, []);

  const getGrade = useCallback((score: string) => {
    const numScore = parseFloat(score);
    const grades = Object.keys(GRADING_SCALE) as Array<keyof typeof GRADING_SCALE>;
    
    for (const gradeKey of grades) {
      const gradeInfo = GRADING_SCALE[gradeKey];
      if (numScore >= gradeInfo.min && numScore <= gradeInfo.max) {
        return gradeInfo;
      }
    }
    return GRADING_SCALE.F;
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(scores);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const clearAllScores = () => {
    setScores(students.reduce((acc, student) => ({
      ...acc,
      [student.id]: ASSESSMENT_CONFIG.reduce((sAcc, assessment) => ({
        ...sAcc,
        [assessment.id]: ''
      }), {} as StudentScores)
    }), {} as AllScores));
  };

  const calculateStats = useCallback(() => {
    const totals = students.map(student => {
      const studentScores = scores[student.id] || {};
      return parseFloat(calculateTotal(studentScores)) || 0;
    });
    
    const average = totals.reduce((a, b) => a + b, 0) / totals.length;
    const maxScore = Math.max(...totals, 0);
    
    const scoresEntered = students.reduce((count, student) => {
      const studentScores = scores[student.id] || {};
      const entered = Object.values(studentScores).filter(s => s !== '' && s !== undefined).length;
      return count + entered;
    }, 0);

    return {
      average: isNaN(average) ? '0.0' : average.toFixed(1),
      maxScore: maxScore === -Infinity ? '0.0' : maxScore.toFixed(1),
      scoresEntered
    };
  }, [students, scores, calculateTotal]);

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
        zIndex: 1050
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        style={{
          maxWidth: '95vw',
          margin: '1rem auto',
          height: 'calc(100vh - 2rem)'
        }}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg h-100">
          
          <div className="modal-header bg-primary text-white rounded-top-4 py-3 px-4">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 me-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fa fa-journal-text fs-4 me-2"></i>
                    <h5 className="modal-title mb-0 fw-bold">Record Scores</h5>
                  </div>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1 d-inline-flex align-items-center">
                      <i className="fa fa-book me-2 fs-6"></i>
                      <span className="fw-medium">{course?.code || 'N/A'}: {lesson.title}</span>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1 d-inline-flex align-items-center">
                      <i className="fa fa-users me-2 fs-6"></i>
                      <span>{students.length} Students</span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white opacity-100 ms-2 flex-shrink-0" 
                  onClick={onClose}
                  aria-label="Close"
                />
              </div>
              
              <div className="d-flex flex-wrap align-items-center gap-2 mt-2 pt-2 border-top border-white border-opacity-25">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoGradeSwitch"
                    checked={autoGradeMode}
                    onChange={(e) => setAutoGradeMode(e.target.checked)}
                  />
                  <label className="form-check-label ms-2 fw-medium" htmlFor="autoGradeSwitch">
                    Auto-grade
                  </label>
                </div>
                
                <div className="d-flex gap-1 ms-auto flex-wrap">
                  <span className="badge bg-success rounded-pill px-2 py-1">A:8-10</span>
                  <span className="badge bg-info rounded-pill px-2 py-1">B:6-7.9</span>
                  <span className="badge bg-warning rounded-pill px-2 py-1">C:4-5.9</span>
                  <span className="badge bg-secondary rounded-pill px-2 py-1">D:2-3.9</span>
                  <span className="badge bg-danger rounded-pill px-2 py-1">F:0-1.9</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body p-0 d-flex flex-column">
            <div className="table-responsive flex-grow-1" style={{ minHeight: 0 }}>
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light sticky-top" style={{ top: 0, zIndex: 10 }}>
                  <tr>
                    <th className="sticky-left bg-white align-middle px-2 py-2" style={{ width: '150px', left: 0, zIndex: 12, boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }}>
                      <div className="fw-semibold">Student</div>
                    </th>
                    
                    {ASSESSMENT_CONFIG.map((assessment) => (
                      <th key={assessment.id} className="text-center align-middle px-1 py-2" style={{ width: '110px' }}>
                        <div className="fw-semibold mb-1">{assessment.label}</div>
                        <span className={`badge bg-${assessment.color} rounded-pill`}>/{assessment.max_score}</span>
                        <small className="text-muted d-block mt-1">{assessment.weight * 100}%</small>
                      </th>
                    ))}
                    
                    <th className="text-center fw-bold bg-light align-middle sticky-right px-2 py-2" style={{ width: '100px', right: 0, zIndex: 11, boxShadow: '-2px 0 4px rgba(0,0,0,0.1)' }}>
                      <div className="mb-1">Total</div>
                      <small className="text-muted">/10</small>
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {students.map((student) => {
                    const studentScores = scores[student.id] || {};
                    const totalScore = calculateTotal(studentScores);
                    const gradeInfo = getGrade(totalScore);
                    
                    return (
                      <tr key={student.id}>
                        <td className="sticky-left bg-white align-middle px-2 py-1" style={{ left: 0, zIndex: 9, boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }}>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                              <span className="fw-semibold small">{student.username?.substring(0, 2).toUpperCase() || 'ST'}</span>
                            </div>
                            <div className="text-truncate">
                              <div className="fw-medium small">{student.username || student.names}</div>
                            </div>
                          </div>
                        </td>
                        
                        {ASSESSMENT_CONFIG.map((assessment) => (
                          <td key={assessment.id} className="text-center align-middle p-1">
                            <input
                              type="number"
                              className="form-control rounded-2 text-center"
                              min="0"
                              max={assessment.max_score}
                              step="0.1"
                              value={studentScores[assessment.id] || ''}
                              onChange={(e) => updateScore(student.id, assessment.id, e.target.value)}
                              onFocus={(e) => e.target.select()}
                              placeholder="0"
                              style={{ borderColor: `var(--bs-${assessment.color})` }}
                            />
                          </td>
                        ))}
                        
                        <td className="text-center align-middle fw-bold sticky-right bg-light px-2 py-1" style={{ right: 0, zIndex: 8, boxShadow: '-2px 0 4px rgba(0,0,0,0.1)' }}>
                          <span className={`badge bg-${gradeInfo.color} fs-6 px-2 py-1`}>{totalScore}</span>
                          <div className="mt-1">
                            <span className={`badge bg-${gradeInfo.color} bg-opacity-10 text-${gradeInfo.color}`}>{gradeInfo.grade}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="border-top bg-light px-3 py-2">
              <div className="row g-2">
                <div className="col-4">
                  <div className="d-flex align-items-center">
                    <i className="fa fa-check-circle text-success me-2"></i>
                    <div>
                      <div className="text-muted small">Scores</div>
                      <div className="fw-semibold">{stats.scoresEntered}/{students.length * ASSESSMENT_CONFIG.length}</div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="d-flex align-items-center">
                    <i className="fa fa-chart-line text-info me-2"></i>
                    <div>
                      <div className="text-muted small">Average</div>
                      <div className="fw-semibold">{stats.average}</div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="d-flex align-items-center">
                    <i className="fa fa-star text-warning me-2"></i>
                    <div>
                      <div className="text-muted small">Top</div>
                      <div className="fw-semibold">{stats.maxScore}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light rounded-bottom-4 px-3 py-2">
            <div className="d-flex justify-content-between w-100 gap-2">
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
                <Button variant="outline-danger" onClick={clearAllScores}>Clear All</Button>
              </div>
              <Button variant="primary" loading={saving} onClick={handleSave}>
                Save All Scores
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;

