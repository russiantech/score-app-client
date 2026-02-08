
// // v2
// import { useState, useCallback, useEffect } from 'react';

// const AttendanceModal = ({ lesson, students, onClose, onSave }) => {
//   const [attendance, setAttendance] = useState(() =>
//     students.reduce((acc, student) => ({
//       ...acc,
//       [student.id]: student.attendance || true // Default to present
//     }), {})
//   );

//   const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
//   const [sessionType, setSessionType] = useState('regular');
//   const [notes, setNotes] = useState('');

//   // Attendance status counters
//   const stats = {
//     present: Object.values(attendance).filter(v => v === true).length,
//     absent: Object.values(attendance).filter(v => v === false).length,
//     total: students.length
//   };

//   // Toggle attendance with animation
//   const toggleAttendance = useCallback((studentId) => {
//     setAttendance(prev => ({
//       ...prev,
//       [studentId]: !prev[studentId]
//     }));
//   }, []);

//   // Mark all present/absent
//   const markAll = useCallback((status) => {
//     setAttendance(students.reduce((acc, student) => ({
//       ...acc,
//       [student.id]: status
//     }), {}));
//   }, [students]);

//   // Save attendance
//   const handleSave = () => {
//     const attendanceData = {
//       lessonId: lesson.id,
//       date: attendanceDate,
//       sessionType,
//       notes,
//       attendance,
//       stats
//     };
//     onSave(attendanceData);
//   };

//   return (
//     <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//       <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content rounded-4 border-0 shadow-lg">
          
//           {/* Modal Header */}
//           <div className="modal-header bg-gradient-success text-white rounded-top-4 py-3 px-4">
//             <div className="w-100">
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <h5 className="modal-title mb-1 fw-semibold">
//                     <i className="bi bi-calendar-check me-2"></i>
//                     Attendance Record
//                   </h5>
//                   <p className="mb-0 opacity-75">
//                     {lesson.title} • {students.length} Students
//                   </p>
//                 </div>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white opacity-100" 
//                   onClick={onClose}
//                   aria-label="Close"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Attendance Controls */}
//           <div className="modal-body p-0">
//             <div className="bg-light px-4 py-3 border-bottom">
//               <div className="row g-3">
//                 <div className="col-md-4">
//                   <label className="form-label fw-semibold text-muted mb-1">
//                     <i className="bi bi-calendar me-1"></i>
//                     Date
//                   </label>
//                   <input
//                     type="date"
//                     className="form-control rounded-3"
//                     value={attendanceDate}
//                     onChange={(e) => setAttendanceDate(e.target.value)}
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label fw-semibold text-muted mb-1">
//                     <i className="bi bi-clock me-1"></i>
//                     Session Type
//                   </label>
//                   <select
//                     className="form-select rounded-3"
//                     value={sessionType}
//                     onChange={(e) => setSessionType(e.target.value)}
//                   >
//                     <option value="regular">Regular Class</option>
//                     <option value="lab">Lab Session</option>
//                     <option value="tutorial">Tutorial</option>
//                     <option value="exam">Exam Session</option>
//                     <option value="makeup">Make-up Class</option>
//                   </select>
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label fw-semibold text-muted mb-1">
//                     Quick Actions
//                   </label>
//                   <div className="d-flex gap-2">
//                     <button
//                       className="btn btn-success btn-sm rounded-3 flex-grow-1"
//                       onClick={() => markAll(true)}
//                     >
//                       <i className="bi bi-check-lg me-1"></i>
//                       All Present
//                     </button>
//                     <button
//                       className="btn btn-danger btn-sm rounded-3 flex-grow-1"
//                       onClick={() => markAll(false)}
//                     >
//                       <i className="bi bi-x-lg me-1"></i>
//                       All Absent
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Attendance Stats */}
//             <div className="px-4 py-3 bg-white">
//               <div className="row g-0 text-center">
//                 <div className="col-4">
//                   <div className="p-3 border-end">
//                     <div className="text-success fw-bold fs-3">{stats.present}</div>
//                     <div className="text-muted small">Present</div>
//                   </div>
//                 </div>
//                 <div className="col-4">
//                   <div className="p-3 border-end">
//                     <div className="text-danger fw-bold fs-3">{stats.absent}</div>
//                     <div className="text-muted small">Absent</div>
//                   </div>
//                 </div>
//                 <div className="col-4">
//                   <div className="p-3">
//                     <div className="fw-bold fs-3">
//                       {stats.present > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
//                     </div>
//                     <div className="text-muted small">Attendance Rate</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Students List */}
//             <div className="px-4 py-3" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
//               <div className="list-group border-0">
//                 {students.map((student, index) => (
//                   <div 
//                     key={student.id}
//                     className={`list-group-item border-0 p-3 ${index < students.length - 1 ? 'border-bottom' : ''}`}
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <div className="d-flex align-items-center">
//                         <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
//                           attendance[student.id] ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
//                         }`}
//                           style={{ width: '44px', height: '44px' }}>
//                           <span className={`fw-semibold ${
//                             attendance[student.id] ? 'text-success' : 'text-danger'
//                           }`}>
//                             {student.name.split(' ').map(n => n[0]).join('')}
//                           </span>
//                         </div>
//                         <div>
//                           <div className="fw-medium">{student.name}</div>
//                           <small className="text-muted">{student.contact}</small>
//                         </div>
//                       </div>
                      
//                       <div className="d-flex align-items-center gap-3">
//                         <div className="d-flex align-items-center gap-2">
//                           <span className={`badge rounded-pill ${attendance[student.id] ? 'bg-success' : 'bg-danger'}`}>
//                             {attendance[student.id] ? 'Present' : 'Absent'}
//                           </span>
//                           <div className="form-check form-switch">
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               role="switch"
//                               style={{ width: '3em', height: '1.5em' }}
//                               checked={attendance[student.id]}
//                               onChange={() => toggleAttendance(student.id)}
//                               id={`attendance-${student.id}`}
//                             />
//                             <label className="form-check-label visually-hidden" htmlFor={`attendance-${student.id}`}>
//                               Attendance for {student.name}
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Notes Section */}
//             <div className="border-top px-4 py-3">
//               <label className="form-label fw-semibold text-muted mb-2">
//                 <i className="bi bi-pencil me-1"></i>
//                 Additional Notes
//               </label>
//               <textarea
//                 className="form-control rounded-3"
//                 rows="2"
//                 placeholder="Add notes about today's session, reasons for absences, etc."
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Modal Footer */}
//           <div className="modal-footer bg-light rounded-bottom-4 px-4 py-3">
//             <div className="d-flex flex-wrap justify-content-between w-100 gap-2">
//               <button 
//                 className="btn btn-outline-secondary rounded-3 px-4"
//                 onClick={onClose}
//               >
//                 <i className="bi bi-x-lg me-2"></i>
//                 Cancel
//               </button>
              
//               <div className="d-flex gap-2">
//                 <button 
//                   className="btn btn-outline-primary rounded-3 px-4"
//                   onClick={() => {
//                     // Generate PDF/Report
//                     alert('Attendance report generated (mock)');
//                   }}
//                 >
//                   <i className="bi bi-download me-2"></i>
//                   Export
//                 </button>
//                 <button 
//                   className="btn btn-success rounded-3 px-5 fw-semibold shadow-sm"
//                   onClick={handleSave}
//                 >
//                   <i className="bi bi-save me-2"></i>
//                   Save Attendance
//                 </button>
//               </div>
//             </div>
            
//             <div className="w-100 mt-3 pt-3 border-top">
//               <div className="text-muted small">
//                 <i className="bi bi-info-circle me-2"></i>
//                 Attendance records are saved to student profiles and can be exported as reports.
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceModal;






// v2
// src/components/modals/course/AttendanceModal.tsx
import { useState, useCallback } from 'react';
import type { Lesson } from '@/types/course/lesson';

interface Student {
  id: string;
  name: string;
  names?: string;
  contact?: string;
  attendance?: boolean;
}

interface AttendanceData {
  lessonId: string;
  date: string;
  sessionType: string;
  notes: string;
  attendance: Record<string, boolean>;
  stats: {
    present: number;
    absent: number;
    total: number;
  };
}

interface AttendanceModalProps {
  lesson: Lesson;
  students: Student[];
  onClose: () => void;
  onSave: (data: AttendanceData) => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ 
  lesson, 
  students, 
  onClose, 
  onSave 
}) => {
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() =>
    students.reduce((acc, student) => ({
      ...acc,
      [student.id]: student.attendance ?? true
    }), {})
  );

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [sessionType, setSessionType] = useState('regular');
  const [notes, setNotes] = useState('');

  const stats = {
    present: Object.values(attendance).filter(v => v === true).length,
    absent: Object.values(attendance).filter(v => v === false).length,
    total: students.length
  };

  const toggleAttendance = useCallback((studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  }, []);

  const markAll = useCallback((status: boolean) => {
    setAttendance(students.reduce((acc, student) => ({
      ...acc,
      [student.id]: status
    }), {}));
  }, [students]);

  const handleSave = () => {
    const attendanceData: AttendanceData = {
      lessonId: lesson.id,
      date: attendanceDate,
      sessionType,
      notes,
      attendance,
      stats
    };
    onSave(attendanceData);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          
          <div className="modal-header bg-gradient-success text-white rounded-top-4 py-3 px-4">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="modal-title mb-1 fw-semibold">
                    <i className="bi bi-calendar-check me-2"></i>
                    Attendance Record
                  </h5>
                  <p className="mb-0 opacity-75">
                    {lesson.title} • {students.length} Students
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white opacity-100" 
                  onClick={onClose}
                  aria-label="Close"
                />
              </div>
            </div>
          </div>

          <div className="modal-body p-0">
            <div className="bg-light px-4 py-3 border-bottom">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-muted mb-1">
                    <i className="bi bi-calendar me-1"></i>
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-muted mb-1">
                    <i className="bi bi-clock me-1"></i>
                    Session Type
                  </label>
                  <select
                    className="form-select rounded-3"
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value)}
                  >
                    <option value="regular">Regular Class</option>
                    <option value="lab">Lab Session</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="exam">Exam Session</option>
                    <option value="makeup">Make-up Class</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-muted mb-1">
                    Quick Actions
                  </label>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm rounded-3 flex-grow-1"
                      onClick={() => markAll(true)}
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      All Present
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-3 flex-grow-1"
                      onClick={() => markAll(false)}
                    >
                      <i className="bi bi-x-lg me-1"></i>
                      All Absent
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-white">
              <div className="row g-0 text-center">
                <div className="col-4">
                  <div className="p-3 border-end">
                    <div className="text-success fw-bold fs-3">{stats.present}</div>
                    <div className="text-muted small">Present</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 border-end">
                    <div className="text-danger fw-bold fs-3">{stats.absent}</div>
                    <div className="text-muted small">Absent</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3">
                    <div className="fw-bold fs-3">
                      {stats.present > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                    </div>
                    <div className="text-muted small">Attendance Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              <div className="list-group border-0">
                {students.map((student, index) => (
                  <div 
                    key={student.id}
                    className={`list-group-item border-0 p-3 ${index < students.length - 1 ? 'border-bottom' : ''}`}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          attendance[student.id] ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
                        }`}
                          style={{ width: '44px', height: '44px' }}>
                          <span className={`fw-semibold ${
                            attendance[student.id] ? 'text-success' : 'text-danger'
                          }`}>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="fw-medium">{student.name}</div>
                          <small className="text-muted">{student.contact || 'No contact'}</small>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge rounded-pill ${attendance[student.id] ? 'bg-success' : 'bg-danger'}`}>
                            {attendance[student.id] ? 'Present' : 'Absent'}
                          </span>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              style={{ width: '3em', height: '1.5em' }}
                              checked={attendance[student.id]}
                              onChange={() => toggleAttendance(student.id)}
                              id={`attendance-${student.id}`}
                            />
                            <label className="form-check-label visually-hidden" htmlFor={`attendance-${student.id}`}>
                              Attendance for {student.name}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-top px-4 py-3">
              <label className="form-label fw-semibold text-muted mb-2">
                <i className="bi bi-pencil me-1"></i>
                Additional Notes
              </label>
              <textarea
                className="form-control rounded-3"
                rows={2}
                placeholder="Add notes about today's session, reasons for absences, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer bg-light rounded-bottom-4 px-4 py-3">
            <div className="d-flex flex-wrap justify-content-between w-100 gap-2">
              <button 
                className="btn btn-outline-secondary rounded-3 px-4"
                onClick={onClose}
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancel
              </button>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary rounded-3 px-4"
                  onClick={() => {
                    alert('Attendance report generated (mock)');
                  }}
                >
                  <i className="bi bi-download me-2"></i>
                  Export
                </button>
                <button 
                  className="btn btn-success rounded-3 px-5 fw-semibold shadow-sm"
                  onClick={handleSave}
                >
                  <i className="bi bi-save me-2"></i>
                  Save Attendance
                </button>
              </div>
            </div>
            
            <div className="w-100 mt-3 pt-3 border-top">
              <div className="text-muted small">
                <i className="bi bi-info-circle me-2"></i>
                Attendance records are saved to student profiles and can be exported as reports.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
