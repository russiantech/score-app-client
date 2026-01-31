// import { useState } from 'react';

// const ASSESSMENT_TYPES = ['Quiz', 'Assignment', 'Project', 'Exam'];

// const ScoreModal = ({ lesson, students, onClose }) => {
//   const [scores, setScores] = useState({});

//   const updateScore = (studentId, type, value) => {
//     setScores(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [type]: value,
//       },
//     }));
//   };

//   const saveScores = () => {
//     alert('Scores saved successfully (mock)');
//     onClose();
//   };

//   return (
//     <div className="modal fade show d-block modal-fullscreen-sm-down">
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">

//           <div className="modal-header">
//             <h6 className="mb-0">
//               Record Scores – {lesson.title}
//             </h6>
//             <button className="btn-close" onClick={onClose} />
//           </div>

//           <div className="modal-body">
//             <div className="table-responsive">
//               <table className="table table-bordered align-middle">
//                 <thead>
//                   <tr>
//                     <th>Student</th>
//                     {ASSESSMENT_TYPES.map(type => (
//                       <th key={type}>{type}</th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {students.map(student => (
//                     <tr key={student.id}>
//                       <td>{student.name}</td>
//                       {ASSESSMENT_TYPES.map(type => (
//                         <td key={type}>
//                           <input
//                             type="number"
//                             className="form-control"
//                             placeholder="0"
//                             value={scores?.[student.id]?.[type] || ''}
//                             onChange={e =>
//                               updateScore(student.id, type, e.target.value)
//                             }
//                           />
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button className="btn btn-outline-secondary" onClick={onClose}>
//               Cancel
//             </button>
//             <button className="btn btn-primary" onClick={saveScores}>
//               Save All Scores
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScoreModal;




// // v2 - useCallback for performance
// // Further enhanced version of Design #1
// import { useState, useCallback } from 'react';

// // Configurable assessments - could come from backend
// const ASSESSMENT_CONFIG = [
//   { id: 'quiz', label: 'Quiz', maxScore: 20, weight: 0.2 },
//   { id: 'assignment', label: 'Assignment', maxScore: 30, weight: 0.3 },
//   { id: 'project', label: 'Project', maxScore: 50, weight: 0.3 },
//   { id: 'exam', label: 'Exam', maxScore: 100, weight: 0.4 },
// ];

// const ScoreModal = ({ lesson, students, onClose, onSave }) => {
//   const [scores, setScores] = useState(() => 
//     // Initialize with existing data or empty
//     students.reduce((acc, student) => ({
//       ...acc,
//       [student.id]: ASSESSMENT_CONFIG.reduce((sAcc, assessment) => ({
//         ...sAcc,
//         [assessment.id]: student.scores?.[assessment.id] || ''
//       }), {})
//     }), {})
//   );

//   // Memoized update for better performance
//   const updateScore = useCallback((studentId, assessmentId, value) => {
//     setScores(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [assessmentId]: Math.min(
//           value,
//           ASSESSMENT_CONFIG.find(a => a.id === assessmentId)?.maxScore || 100
//         )
//       }
//     }));
//   }, []);

//   // Calculate totals
//   const calculateTotal = (studentScores) => {
//     return ASSESSMENT_CONFIG.reduce((total, assessment) => {
//       const score = studentScores[assessment.id];
//       if (score && !isNaN(score)) {
//         return total + (score * assessment.weight);
//       }
//       return total;
//     }, 0).toFixed(1);
//   };

//   return (
//     <div className="modal fade show d-block modal-fullscreen-lg-down">
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">
          
//           <div className="modal-header bg-light">
//             <h5 className="modal-title mb-0">
//               <i className="bi bi-clipboard-data me-2"></i>
//               Record Scores – {lesson.title}
//               <small className="text-muted d-block fs-6 mt-1">
//                 {students.length} students • Use Tab to navigate
//               </small>
//             </h5>
//             <button className="btn-close" onClick={onClose} />
//           </div>

//           <div className="modal-body p-0">
//             <div className="table-responsive" style={{ maxHeight: '65vh' }}>
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light sticky-top">
//                   <tr>
//                     <th className="sticky-left bg-white" style={{ zIndex: 3 }}>
//                       <span className="d-inline-block" style={{ minWidth: '150px' }}>
//                         Student
//                       </span>
//                     </th>
//                     {ASSESSMENT_CONFIG.map(assessment => (
//                       <th key={assessment.id} className="text-center">
//                         <div>{assessment.label}</div>
//                         <small className="text-muted fw-normal">
//                           Max: {assessment.maxScore}
//                         </small>
//                       </th>
//                     ))}
//                     <th className="text-center fw-bold bg-light">
//                       Total
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map(student => (
//                     <tr key={student.id}>
//                       <td className="sticky-left bg-white fw-medium">
//                         {student.name}
//                       </td>
//                       {ASSESSMENT_CONFIG.map(assessment => (
//                         <td key={assessment.id} className="text-center">
//                           <input
//                             type="number"
//                             className="form-control form-control-sm text-center"
//                             min="0"
//                             max={assessment.maxScore}
//                             value={scores[student.id]?.[assessment.id] || ''}
//                             onChange={(e) => 
//                               updateScore(student.id, assessment.id, e.target.value)
//                             }
//                             onFocus={(e) => e.target.select()}
//                             placeholder="0"
//                             style={{ width: '70px', display: 'inline-block' }}
//                           />
//                         </td>
//                       ))}
//                       <td className="text-center fw-bold bg-light-subtle">
//                         {calculateTotal(scores[student.id])}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="modal-footer bg-light">
//             <div className="d-flex justify-content-between w-100">
//               <div>
//                 <button className="btn btn-outline-secondary" onClick={onClose}>
//                   Cancel
//                 </button>
//               </div>
//               <div className="d-flex gap-2">
//                 <button 
//                   className="btn btn-outline-primary"
//                   onClick={() => {/* Clear all functionality */}}
//                 >
//                   Clear All
//                 </button>
//                 <button 
//                   className="btn btn-primary"
//                   onClick={() => onSave(scores)}
//                 >
//                   <i className="bi bi-check2 me-1"></i>
//                   Save All Scores
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScoreModal;




// // v4
// import { useState, useCallback, useEffect, useRef } from 'react';

// // Assessment configuration with auto-grading
// const ASSESSMENT_CONFIG = [
//   { 
//     id: 'assess', 
//     label: 'Assess', 
//     maxScore: 10, 
//     weight: 0.25,
//     description: 'Continuous Assessment',
//     color: 'primary'
//   },
//   { 
//     id: 'assign', 
//     label: 'Assign', 
//     maxScore: 10, 
//     weight: 0.25,
//     description: 'Assignment Score',
//     color: 'success'
//   },
//   { 
//     id: 'project', 
//     label: 'Project', 
//     maxScore: 10, 
//     weight: 0.20,
//     description: 'Module Project (Optional)',
//     color: 'warning',
//     optional: true
//   },
//   { 
//     id: 'exam', 
//     label: 'Exam', 
//     maxScore: 10, 
//     weight: 0.30,
//     description: 'Final Examination',
//     color: 'danger'
//   },
// ];

// const ScoreModal = ({ lesson, students, onClose, onSave }) => {
//   const [scores, setScores] = useState(() => 
//     students.reduce((acc, student) => ({
//       ...acc,
//       [student.id]: ASSESSMENT_CONFIG.reduce((sAcc, assessment) => ({
//         ...sAcc,
//         [assessment.id]: student.scores?.[assessment.id] || ''
//       }), {})
//     }), {})
//   );

//   const [autoGradeMode, setAutoGradeMode] = useState(true);
//   const [gradingScale] = useState({
//     A: { min: 8, max: 10, grade: 'A', color: 'success' },
//     B: { min: 6, max: 7.9, grade: 'B', color: 'info' },
//     C: { min: 4, max: 5.9, grade: 'C', color: 'warning' },
//     D: { min: 2, max: 3.9, grade: 'D', color: 'secondary' },
//     F: { min: 0, max: 1.9, grade: 'F', color: 'danger' }
//   });

//   const firstInputRef = useRef(null);
//   const modalRef = useRef(null);

//   // Focus first input on mount
//   useEffect(() => {
//     if (firstInputRef.current && students.length > 0) {
//       setTimeout(() => firstInputRef.current.focus(), 100);
//     }
    
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, []);

//   // Memoized update with auto-grading
//   const updateScore = useCallback((studentId, assessmentId, value) => {
//     let processedValue = value;
    
//     // Validate and process input
//     if (value !== '') {
//       const numValue = parseFloat(value);
      
//       // Auto-grade: Scale to maxScore if value > 10
//       if (autoGradeMode && numValue > 10) {
//         const assessment = ASSESSMENT_CONFIG.find(a => a.id === assessmentId);
//         const scaledValue = (numValue / 100) * assessment.maxScore;
//         processedValue = Math.min(scaledValue, assessment.maxScore).toFixed(1);
//       } else {
//         // Ensure within bounds
//         const assessment = ASSESSMENT_CONFIG.find(a => a.id === assessmentId);
//         processedValue = Math.min(Math.max(numValue, 0), assessment.maxScore);
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

//   // Calculate total with weighting
//   const calculateTotal = useCallback((studentScores) => {
//     let total = 0;
//     let totalWeight = 0;
    
//     ASSESSMENT_CONFIG.forEach(assessment => {
//       const score = studentScores[assessment.id];
//       if (score && !isNaN(score) && score !== '') {
//         // If project is optional and not filled, skip
//         if (assessment.optional && (!score || score === '')) {
//           return;
//         }
//         total += (parseFloat(score) * assessment.weight);
//         totalWeight += assessment.weight;
//       }
//     });
    
//     // Normalize if optional project is missing
//     if (totalWeight < 1) {
//       total = (total / totalWeight) * 1;
//     }
    
//     return Math.min(total, 10).toFixed(1);
//   }, []);

//   // Get grade letter based on score
//   const getGrade = useCallback((score) => {
//     const numScore = parseFloat(score);
//     for (const grade in gradingScale) {
//       if (numScore >= gradingScale[grade].min && numScore <= gradingScale[grade].max) {
//         return gradingScale[grade];
//       }
//     }
//     return gradingScale.F;
//   }, [gradingScale]);

//   // Clear all scores
//   const clearAllScores = () => {
//     setScores(students.reduce((acc, student) => ({
//       ...acc,
//       [student.id]: ASSESSMENT_CONFIG.reduce((sAcc, assessment) => ({
//         ...sAcc,
//         [assessment.id]: ''
//       }), {})
//     }), {}));
//   };

//   // Handle save with validation
//   const handleSave = () => {
//     onSave(scores);
//   };

//   // Calculate class statistics
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
//         ref={modalRef}
//         className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
//         style={{
//           maxWidth: '95vw',
//           margin: '1rem auto',
//           height: 'calc(100vh - 2rem)'
//         }}
//       >
//         <div className="modal-content rounded-4 border-0 shadow-lg h-100">
          
//           {/* Modal Header */}
//           <div className="modal-header bg-gradient-primary text-white rounded-top-4 py-3 px-4">
//             <div className="w-100">
//               <div className="d-flex justify-content-between align-items-start">
//                 <div className="flex-grow-1 me-3">
//                   <div className="d-flex align-items-center mb-2">
//                     <i className="bi bi-journal-text fs-4 me-2"></i>
//                     <h5 className="modal-title mb-0 fw-bold">
//                       Record Scores
//                     </h5>
//                   </div>
//                   <div className="d-flex align-items-center flex-wrap gap-2">
//                     <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1 d-inline-flex align-items-center">
//                       <i className="bi bi-book me-2 fs-6"></i>
//                       <span className="fw-medium text-truncate" style={{ maxWidth: '300px' }} title={lesson.title}>
//                         {lesson.title}
//                       </span>
//                     </div>
//                     <div className="bg-white bg-opacity-25 rounded-pill px-3 py-1 d-inline-flex align-items-center">
//                       <i className="bi bi-people me-2 fs-6"></i>
//                       <span>{students.length} Students</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white opacity-100 ms-2 flex-shrink-0" 
//                   onClick={onClose}
//                   aria-label="Close"
//                   style={{ marginTop: '0.5rem' }}
//                 />
//               </div>
              
//               {/* Grading Controls */}
//               <div className="d-flex flex-wrap align-items-center gap-2 mt-2 pt-2 border-top border-white border-opacity-25">
//                 <div className="d-flex align-items-center flex-wrap gap-2">
//                   <div className="form-check form-switch mb-0">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="autoGradeSwitch"
//                       checked={autoGradeMode}
//                       onChange={(e) => setAutoGradeMode(e.target.checked)}
//                     />
//                     <label className="form-check-label ms-2 fw-medium" htmlFor="autoGradeSwitch">
//                       Auto-grade
//                     </label>
//                   </div>
//                 </div>
                
//                 <div className="d-flex gap-1 ms-auto flex-wrap">
//                   <span className="badge bg-success rounded-pill px-2 py-1 fs-7">A:8-10</span>
//                   <span className="badge bg-info rounded-pill px-2 py-1 fs-7">B:6-7.9</span>
//                   <span className="badge bg-warning rounded-pill px-2 py-1 fs-7">C:4-5.9</span>
//                   <span className="badge bg-secondary rounded-pill px-2 py-1 fs-7">D:2-3.9</span>
//                   <span className="badge bg-danger rounded-pill px-2 py-1 fs-7">F:0-1.9</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Modal Body */}
//           <div className="modal-body p-0 d-flex flex-column">
//             <div className="table-responsive flex-grow-1" style={{ minHeight: 0 }}>
//               <table className="table table-hover align-middle mb-0" style={{ tableLayout: 'fixed' }}>
//                 <thead className="table-light sticky-top" style={{ top: 0, zIndex: 10 }}>
//                   <tr>
//                     {/* Student Column - Reduced Width */}
//                     <th 
//                       className="sticky-left bg-white align-middle px-2 py-2"
//                       style={{ 
//                         width: '130px',
//                         left: 0,
//                         zIndex: 12,
//                         boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
//                         borderRight: '1px solid #dee2e6'
//                       }}
//                     >
//                       <div className="fw-semibold text-truncate small">Student</div>
//                       <small className="text-muted fw-normal" style={{ fontSize: '0.7rem' }}>Click to focus</small>
//                     </th>
                    
//                     {/* Assessment Columns */}
//                     {ASSESSMENT_CONFIG.map((assessment) => (
//                       <th 
//                         key={assessment.id} 
//                         className={`text-center align-middle px-1 py-2 ${assessment.optional ? 'bg-light-warning' : ''}`}
//                         style={{ 
//                           width: '105px',
//                           borderLeft: '1px solid #dee2e6'
//                         }}
//                       >
//                         <div className="fw-semibold mb-1 small">{assessment.label}</div>
//                         <div className="d-flex align-items-center justify-content-center gap-1">
//                           <span className={`badge bg-${assessment.color} rounded-pill fs-7 px-2 py-1`}>
//                             /{assessment.maxScore}
//                           </span>
//                           {assessment.optional && (
//                             <i className="bi bi-info-circle text-warning fs-7" title="Optional"></i>
//                           )}
//                         </div>
//                         <small className="text-muted d-block fw-normal mt-1 fs-7">
//                           {assessment.weight * 100}%
//                         </small>
//                       </th>
//                     ))}
                    
//                     {/* Total Column - Reduced Width */}
//                     <th 
//                       className="text-center fw-bold bg-light align-middle sticky-right px-2 py-2"
//                       style={{
//                         width: '80px',
//                         right: 0,
//                         zIndex: 11,
//                         boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
//                         borderLeft: '1px solid #dee2e6'
//                       }}
//                     >
//                       <div className="mb-1 small">Total</div>
//                       <small className="text-muted fw-normal fs-7">/10</small>
//                     </th>
//                   </tr>
//                 </thead>
                
//                 <tbody>
//                   {students.map((student, rowIndex) => {
//                     const totalScore = calculateTotal(scores[student.id]);
//                     const gradeInfo = getGrade(totalScore);
                    
//                     return (
//                       <tr key={student.id} className="border-bottom" style={{ height: '60px' }}>
//                         {/* Student Name Column - Sticky */}
//                         <td 
//                           className="sticky-left bg-white align-middle px-2 py-1"
//                           style={{
//                             left: 0,
//                             zIndex: 9,
//                             boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
//                             borderRight: '1px solid #dee2e6',
//                             width: '130px'
//                           }}
//                         >
//                           <div className="d-flex align-items-center h-100">
//                             <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2 flex-shrink-0"
//                               style={{ 
//                                 width: '28px', 
//                                 height: '28px',
//                                 backgroundColor: `hsl(${rowIndex * 137.5 % 360}, 70%, 90%)`
//                               }}>
//                               <span className="text-dark fw-semibold small">
//                                 {student.username.split(' ').map(n => n[0]).join('')}
//                               </span>
//                             </div>
//                             <div className="text-truncate flex-grow-1" style={{ minWidth: 0 }}>
//                               <div className="fw-medium text-truncate small" title={student.username}>
//                                 {student.username}
//                               </div>
//                               {/* <small className="text-muted d-block text-truncate fs-7">
//                                 {student.email ? student.email.substring(0, 12) + '...' : student.id}
//                               </small> */}
//                             </div>
                            
//                           </div>
//                         </td>
                        
//                         {/* Assessment Inputs - Filling full cell */}
//                         {ASSESSMENT_CONFIG.map((assessment, colIndex) => {
//                           const isFirstInput = rowIndex === 0 && colIndex === 0;
//                           const inputId = `score-${student.id}-${assessment.id}`;
                          
//                           return (
//                             <td key={assessment.id} className="text-center align-middle p-1 h-100">
//                               <div className="position-relative h-100">
//                                 <input
//                                   ref={isFirstInput ? firstInputRef : null}
//                                   id={inputId}
//                                   type="number"
//                                   className={`form-control rounded-2 text-center h-100 px-1 ${assessment.optional ? 'bg-light-warning-subtle' : ''}`}
//                                   min="0"
//                                   max={assessment.maxScore}
//                                   step="0.1"
//                                   value={scores[student.id]?.[assessment.id] || ''}
//                                   onChange={(e) => updateScore(student.id, assessment.id, e.target.value)}
//                                   onFocus={(e) => e.target.select()}
//                                   placeholder="0"
//                                   style={{ 
//                                     width: '100%',
//                                     height: '100%',
//                                     minHeight: '40px',
//                                     borderWidth: '1px',
//                                     borderColor: `var(--bs-${assessment.color})`,
//                                     fontSize: '0.9rem',
//                                     padding: '0.25rem'
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     e.target.style.boxShadow = `0 0 0 2px rgba(var(--bs-${assessment.color}-rgb), 0.1)`;
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.target.style.boxShadow = 'none';
//                                   }}
//                                   aria-label={`${assessment.label} score for ${student.username}`}
//                                 />
//                               </div>
//                             </td>
//                           );
//                         })}
                        
//                         {/* Total Column - Sticky Right */}
//                         <td 
//                           className="text-center align-middle fw-bold sticky-right bg-light-subtle px-2 py-1 h-100"
//                           style={{
//                             right: 0,
//                             zIndex: 8,
//                             boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
//                             borderLeft: '1px solid #dee2e6',
//                             width: '80px'
//                           }}
//                         >
//                           <div className="d-flex flex-column align-items-center justify-content-center h-100">
//                             <span 
//                               className={`badge bg-${gradeInfo.color} rounded-2 fs-6 px-2 py-1 w-100`}
//                               style={{ lineHeight: 1.2 }}
//                             >
//                               {totalScore}
//                             </span>
//                             <div className="mt-1">
//                               <span 
//                                 className={`badge bg-${gradeInfo.color} bg-opacity-10 text-${gradeInfo.color} rounded-1 px-1 py-0`}
//                                 style={{ fontSize: '0.7rem' }}
//                               >
//                                 {gradeInfo.grade}
//                               </span>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Compact Stats Bar */}
//             {students.length > 0 && (
//               <div className="border-top bg-light px-3 py-2">
//                 <div className="row g-2">

//                   {/* <div className="col-3">
//                     <div className="d-flex align-items-center">
//                       <div className="rounded-circle bg-primary bg-opacity-10 p-1 me-2">
//                         <i className="bi bi-people-fill text-primary fs-6"></i>
//                       </div>
//                       <div>
//                         <div className="text-muted fs-7">Students</div>
//                         <div className="fw-semibold fs-6">{students.length}</div>
//                       </div>
//                     </div>
//                   </div> */}

//                   <div className="col-4">
//                     <div className="d-flex align-items-center">
//                       <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2">
//                         <i className="bi bi-check-circle-fill text-success fs-6"></i>
//                       </div>
//                       <div>
//                         <div className="text-muted fs-7">Scores</div>
//                         <div className="fw-semibold fs-6">
//                           {stats.scoresEntered}/{students.length * ASSESSMENT_CONFIG.length}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-4">
//                     <div className="d-flex align-items-center">
//                       <div className="rounded-circle bg-info bg-opacity-10 p-1 me-2">
//                         <i className="bi bi-graph-up text-info fs-6"></i>
//                       </div>
//                       <div>
//                         <div className="text-muted fs-7">Average</div>
//                         <div className="fw-semibold fs-6">{stats.average}</div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-4">
//                     <div className="d-flex align-items-center">
//                       <div className="rounded-circle bg-warning bg-opacity-10 p-1 me-2">
//                         <i className="bi bi-star-fill text-warning fs-6"></i>
//                       </div>
//                       <div>
//                         <div className="text-muted fs-7">Top</div>
//                         <div className="fw-semibold fs-6">{stats.maxScore}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Modal Footer */}
//           <div className="modal-footer bg-light rounded-bottom-4 px-3 py-2">
//             <div className="d-flex flex-wrap justify-content-between w-100 gap-2">
//               <div className="d-flex flex-wrap gap-2">
//                 <button 
//                   className="btn btn-outline-secondary rounded-2 px-3 py-1 fs-7"
//                   onClick={onClose}
//                 >
//                   <i className="bi bi-x-lg me-1"></i>
//                   Cancel
//                 </button>
//                 <button 
//                   className="btn btn-outline-danger rounded-2 px-3 py-1 fs-7"
//                   onClick={clearAllScores}
//                 >
//                   <i className="bi bi-trash me-1"></i>
//                   Clear All
//                 </button>
//               </div>
              
//               <div className="d-flex flex-wrap gap-2">
//                 <button 
//                   className="btn btn-primary rounded-2 px-4 py-1 fw-semibold fs-7"
//                   onClick={handleSave}
//                 >
//                   <i className="bi bi-check-lg me-1"></i>
//                   Save All Scores
//                 </button>
//               </div>
//             </div>
            
//             <div className="w-100 mt-2 pt-2 border-top">
//               <div className="d-flex align-items-center justify-content-center text-muted fs-7">
//                 <i className="bi bi-info-circle me-1"></i>
//                 <span>Use <kbd>Tab</kbd> to navigate • Scores over 10 auto-scale to /10</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScoreModal;


// v5 - claude
import { useState, useEffect, useCallback } from 'react';
import { ASSESSMENT_CONFIG, GRADING_SCALE } from '@/configs/courses'
import { Button } from '@/components/buttons/Button'
const ScoreModal = ({ lesson, course, students, onClose, onSave }) => {
  const [scores, setScores] = useState(() => 
    students.reduce((acc, student) => ({
      ...acc,
      [student.id]: ASSESSMENT_CONFIG.reduce((sAcc, assessment) => ({
        ...sAcc,
        [assessment.id]: ''
      }), {})
    }), {})
  );
  const [autoGradeMode, setAutoGradeMode] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const updateScore = useCallback((studentId, assessmentId, value) => {
    let processedValue = value;
    
    if (value !== '') {
      const numValue = parseFloat(value);
      const assessment = ASSESSMENT_CONFIG.find(a => a.id === assessmentId);
      
      if (autoGradeMode && numValue > 10) {
        const scaledValue = (numValue / 100) * assessment.maxScore;
        processedValue = Math.min(scaledValue, assessment.maxScore).toFixed(1);
      } else {
        processedValue = Math.min(Math.max(numValue, 0), assessment.maxScore);
      }
    }

    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [assessmentId]: processedValue
      }
    }));
  }, [autoGradeMode]);

  const calculateTotal = useCallback((studentScores) => {
    let total = 0;
    let totalWeight = 0;
    
    ASSESSMENT_CONFIG.forEach(assessment => {
      const score = studentScores[assessment.id];
      if (score && !isNaN(score) && score !== '') {
        if (assessment.optional && (!score || score === '')) return;
        total += (parseFloat(score) * assessment.weight);
        totalWeight += assessment.weight;
      }
    });
    
    if (totalWeight < 1) {
      total = (total / totalWeight) * 1;
    }
    
    return Math.min(total, 10).toFixed(1);
  }, []);

  const getGrade = useCallback((score) => {
    const numScore = parseFloat(score);
    for (const grade in GRADING_SCALE) {
      if (numScore >= GRADING_SCALE[grade].min && numScore <= GRADING_SCALE[grade].max) {
        return GRADING_SCALE[grade];
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
      }), {})
    }), {}));
  };

  const calculateStats = useCallback(() => {
    const totals = students.map(student => 
      parseFloat(calculateTotal(scores[student.id])) || 0
    );
    const average = totals.reduce((a, b) => a + b, 0) / totals.length;
    const maxScore = Math.max(...totals);
    const scoresEntered = Object.values(scores).reduce((count, studentScores) => 
      count + Object.values(studentScores).filter(s => s !== '' && s !== undefined).length, 0
    );

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
          
          {/* Header */}
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
              
              {/* Controls */}
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

          {/* Body */}
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
                        <span className={`badge bg-${assessment.color} rounded-pill`}>/{assessment.maxScore}</span>
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
                  {students.map((student, idx) => {
                    const totalScore = calculateTotal(scores[student.id]);
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
                              max={assessment.maxScore}
                              step="0.1"
                              value={scores[student.id]?.[assessment.id] || ''}
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
            
            {/* Stats */}
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

          {/* Footer */}
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