// import { useState, useEffect } from 'react';

// // Types
// interface Course {
//   id: string;
//   title: string;
//   description: string;
//   code: string;
//   tutorId: string;
//   tutorName?: string;
//   status: 'active' | 'inactive';
//   enrolledStudents?: string[];
//   lessons?: any[];
//   created_at: string;
//   updated_at: string;
// }

// interface User {
//   id: string;
//   names: string;
//   email: string;
//   roles: string[];
//   is_active: boolean;
// }

// interface Enrollment {
//   id: string;
//   studentId: string;
//   studentName: string;
//   studentEmail: string;
//   courseId: string;
//   courseCode: string;
//   courseName: string;
//   enrolledAt: string;
//   status: 'active' | 'completed' | 'dropped';
//   progress: number;
// }

// interface EnrollmentStats {
//   totalEnrollments: number;
//   activeEnrollments: number;
//   totalStudents: number;
//   totalCourses: number;
//   studentsEnrolled: number;
//   coursesWithStudents: number;
// }

// // Helper functions
// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric' 
//   });
// };

// const getInitials = (name: string) => {
//   const parts = name.split(' ');
//   if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
//   return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
// };

// // Main Component
// const ManageEnrollments = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [students, setStudents] = useState<User[]>([]);
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'dropped'>('all');
//   const [showUnenrollModal, setShowUnenrollModal] = useState(false);
//   const [enrollmentToRemove, setEnrollmentToRemove] = useState<Enrollment | null>(null);

//   // Static fallback data
//   const staticStudents: User[] = [
//     { id: 's1', names: 'Edet James', email: 'edet.james@example.com', roles: ['student'], is_active: true },
//     { id: 's2', names: 'Sarah Williams', email: 'sarah.w@example.com', roles: ['student'], is_active: true },
//     { id: 's3', names: 'Michael Brown', email: 'michael.b@example.com', roles: ['student'], is_active: true },
//     { id: 's4', names: 'Emily Davis', email: 'emily.d@example.com', roles: ['student'], is_active: true },
//     { id: 's5', names: 'David Johnson', email: 'david.j@example.com', roles: ['student'], is_active: true },
//     { id: 's6', names: 'Jessica Taylor', email: 'jessica.t@example.com', roles: ['student'], is_active: true },
//     { id: 's7', names: 'Daniel Martinez', email: 'daniel.m@example.com', roles: ['student'], is_active: true },
//     { id: 's8', names: 'Sophia Anderson', email: 'sophia.a@example.com', roles: ['student'], is_active: true }
//   ];

//   const staticCourses: Course[] = [
//     {
//       id: 'c1',
//       title: 'Python Programming Fundamentals',
//       description: 'Learn the basics of Python programming',
//       code: 'PY101',
//       tutorId: 't1',
//       tutorName: 'Esther Ozue',
//       status: 'active',
//       enrolledStudents: ['s1', 's2', 's3', 's4', 's5'],
//       lessons: [1, 2, 3, 4, 5, 6, 7, 8],
//       created_at: '2024-01-10T09:00:00Z',
//       updated_at: '2024-01-15T14:30:00Z'
//     },
//     {
//       id: 'c2',
//       title: 'Web Development with React',
//       description: 'Master modern web development',
//       code: 'WD201',
//       tutorId: 't2',
//       tutorName: 'Michael Johnson',
//       status: 'active',
//       enrolledStudents: ['s1', 's3', 's6', 's7'],
//       lessons: [1, 2, 3, 4, 5, 6],
//       created_at: '2024-01-12T10:30:00Z',
//       updated_at: '2024-01-20T11:45:00Z'
//     },
//     {
//       id: 'c3',
//       title: 'Data Science and Machine Learning',
//       description: 'Explore data analysis and ML',
//       code: 'DS301',
//       tutorId: 't3',
//       tutorName: 'Sarah Williams',
//       status: 'active',
//       enrolledStudents: ['s2', 's5', 's8'],
//       lessons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//       created_at: '2024-01-15T08:00:00Z',
//       updated_at: '2024-01-22T16:20:00Z'
//     },
//     {
//       id: 'c4',
//       title: 'Mobile App Development',
//       description: 'Build cross-platform mobile apps',
//       code: 'MA401',
//       tutorId: 't2',
//       tutorName: 'Michael Johnson',
//       status: 'active',
//       enrolledStudents: ['s4'],
//       lessons: [1, 2, 3, 4],
//       created_at: '2024-02-01T09:30:00Z',
//       updated_at: '2024-02-05T10:15:00Z'
//     },
//     {
//       id: 'c5',
//       title: 'Database Design and SQL',
//       description: 'Learn relational databases',
//       code: 'DB202',
//       tutorId: 't4',
//       tutorName: 'David Brown',
//       status: 'active',
//       enrolledStudents: ['s1', 's2', 's3', 's5', 's6', 's7'],
//       lessons: [1, 2, 3, 4, 5],
//       created_at: '2024-01-18T11:00:00Z',
//       updated_at: '2024-01-25T13:40:00Z'
//     }
//   ];

//   const staticEnrollments: Enrollment[] = [
//     { id: 'e1', studentId: 's1', studentName: 'Edet James', studentEmail: 'edet.james@example.com', courseId: 'c1', courseCode: 'PY101', courseName: 'Python Programming Fundamentals', enrolledAt: '2024-01-15T10:00:00Z', status: 'active', progress: 65 },
//     { id: 'e2', studentId: 's1', studentName: 'Edet James', studentEmail: 'edet.james@example.com', courseId: 'c2', courseCode: 'WD201', courseName: 'Web Development with React', enrolledAt: '2024-01-16T11:30:00Z', status: 'active', progress: 45 },
//     { id: 'e3', studentId: 's1', studentName: 'Edet James', studentEmail: 'edet.james@example.com', courseId: 'c5', courseCode: 'DB202', courseName: 'Database Design and SQL', enrolledAt: '2024-01-20T09:00:00Z', status: 'active', progress: 30 },
//     { id: 'e4', studentId: 's2', studentName: 'Sarah Williams', studentEmail: 'sarah.w@example.com', courseId: 'c1', courseCode: 'PY101', courseName: 'Python Programming Fundamentals', enrolledAt: '2024-01-15T14:00:00Z', status: 'completed', progress: 100 },
//     { id: 'e5', studentId: 's2', studentName: 'Sarah Williams', studentEmail: 'sarah.w@example.com', courseId: 'c3', courseCode: 'DS301', courseName: 'Data Science and Machine Learning', enrolledAt: '2024-01-22T10:30:00Z', status: 'active', progress: 55 },
//     { id: 'e6', studentId: 's2', studentName: 'Sarah Williams', studentEmail: 'sarah.w@example.com', courseId: 'c5', courseCode: 'DB202', courseName: 'Database Design and SQL', enrolledAt: '2024-01-25T15:00:00Z', status: 'active', progress: 40 },
//     { id: 'e7', studentId: 's3', studentName: 'Michael Brown', studentEmail: 'michael.b@example.com', courseId: 'c1', courseCode: 'PY101', courseName: 'Python Programming Fundamentals', enrolledAt: '2024-01-16T09:00:00Z', status: 'active', progress: 75 },
//     { id: 'e8', studentId: 's3', studentName: 'Michael Brown', studentEmail: 'michael.b@example.com', courseId: 'c2', courseCode: 'WD201', courseName: 'Web Development with React', enrolledAt: '2024-01-20T11:00:00Z', status: 'active', progress: 50 },
//     { id: 'e9', studentId: 's3', studentName: 'Michael Brown', studentEmail: 'michael.b@example.com', courseId: 'c5', courseCode: 'DB202', courseName: 'Database Design and SQL', enrolledAt: '2024-01-26T10:00:00Z', status: 'dropped', progress: 15 },
//     { id: 'e10', studentId: 's4', studentName: 'Emily Davis', studentEmail: 'emily.d@example.com', courseId: 'c1', courseCode: 'PY101', courseName: 'Python Programming Fundamentals', enrolledAt: '2024-01-17T10:00:00Z', status: 'active', progress: 60 },
//     { id: 'e11', studentId: 's4', studentName: 'Emily Davis', studentEmail: 'emily.d@example.com', courseId: 'c4', courseCode: 'MA401', courseName: 'Mobile App Development', enrolledAt: '2024-02-05T14:00:00Z', status: 'active', progress: 25 },
//     { id: 'e12', studentId: 's5', studentName: 'David Johnson', studentEmail: 'david.j@example.com', courseId: 'c1', courseCode: 'PY101', courseName: 'Python Programming Fundamentals', enrolledAt: '2024-01-18T09:00:00Z', status: 'active', progress: 70 },
//     { id: 'e13', studentId: 's5', studentName: 'David Johnson', studentEmail: 'david.j@example.com', courseId: 'c3', courseCode: 'DS301', courseName: 'Data Science and Machine Learning', enrolledAt: '2024-01-23T11:00:00Z', status: 'active', progress: 35 },
//     { id: 'e14', studentId: 's5', studentName: 'David Johnson', studentEmail: 'david.j@example.com', courseId: 'c5', courseCode: 'DB202', courseName: 'Database Design and SQL', enrolledAt: '2024-01-27T10:00:00Z', status: 'active', progress: 45 },
//     { id: 'e15', studentId: 's6', studentName: 'Jessica Taylor', studentEmail: 'jessica.t@example.com', courseId: 'c2', courseCode: 'WD201', courseName: 'Web Development with React', enrolledAt: '2024-01-21T09:00:00Z', status: 'active', progress: 55 },
//     { id: 'e16', studentId: 's6', studentName: 'Jessica Taylor', studentEmail: 'jessica.t@example.com', courseId: 'c5', courseCode: 'DB202', courseName: 'Database Design and SQL', enrolledAt: '2024-01-28T14:00:00Z', status: 'active', progress: 20 },
//     { id: 'e17', studentId: 's7', studentName: 'Daniel Martinez', studentEmail: 'daniel.m@example.com', courseId: 'c2', courseCode: 'WD201', courseName: 'Web Development with React', enrolledAt: '2024-01-22T10:00:00Z', status: 'active', progress: 40 },
//     { id: 'e18', studentId: 's7', studentName: 'Daniel Martinez', studentEmail: 'daniel.m@example.com', courseId: 'c5', courseCode: 'DB202', courseName: 'Database Design and SQL', enrolledAt: '2024-01-29T09:00:00Z', status: 'active', progress: 30 },
//     { id: 'e19', studentId: 's8', studentName: 'Sophia Anderson', studentEmail: 'sophia.a@example.com', courseId: 'c3', courseCode: 'DS301', courseName: 'Data Science and Machine Learning', enrolledAt: '2024-01-24T11:00:00Z', status: 'active', progress: 50 }
//   ];

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       // Backend: const [c, s, e] = await Promise.all([fetch('/api/admin/courses'), ...])
//       setTimeout(() => {
//         setCourses(staticCourses);
//         setStudents(staticStudents);
//         setEnrollments(staticEnrollments);
//         setLoading(false);
//       }, 500);
//     } catch (error) {
//       console.error('Error:', error);
//       setCourses(staticCourses);
//       setStudents(staticStudents);
//       setEnrollments(staticEnrollments);
//       setLoading(false);
//     }
//   };

//   const calculateStats = (): EnrollmentStats => {
//     const enrolledStudentIds = new Set(enrollments.map(e => e.studentId));
//     const coursesWithStudentIds = new Set(enrollments.map(e => e.courseId));
    
//     return {
//       totalEnrollments: enrollments.length,
//       activeEnrollments: enrollments.filter(e => e.status === 'active').length,
//       totalStudents: students.length,
//       totalCourses: courses.length,
//       studentsEnrolled: enrolledStudentIds.size,
//       coursesWithStudents: coursesWithStudentIds.size
//     };
//   };

//   const stats = calculateStats();

//   const filteredEnrollments = enrollments.filter(enrollment => {
//     const matchesSearch = enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          enrollment.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          enrollment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const getAvailableCourses = () => {
//     if (!selectedStudent) return courses.filter(c => c.status === 'active');
//     const enrolledCourseIds = enrollments
//       .filter(e => e.studentId === selectedStudent && e.status !== 'dropped')
//       .map(e => e.courseId);
//     return courses.filter(c => c.status === 'active' && !enrolledCourseIds.includes(c.id));
//   };

//   const getCoursesForStudent = (studentId: string) => {
//     return enrollments.filter(e => e.studentId === studentId);
//   };

//   const getStudentWorkload = (studentId: string) => {
//     const studentEnrollments = enrollments.filter(e => e.studentId === studentId && e.status === 'active');
//     return studentEnrollments.length;
//   };

//   const handleEnrollStudent = async () => {
//     if (!selectedStudent || !selectedCourse) {
//       alert('Please select both a student and a course');
//       return;
//     }

//     const existingEnrollment = enrollments.find(
//       e => e.studentId === selectedStudent && e.courseId === selectedCourse && e.status !== 'dropped'
//     );
//     if (existingEnrollment) {
//       alert('This student is already enrolled in this course');
//       return;
//     }

//     try {
//       // Backend: await fetch('/api/admin/enrollments', { method: 'POST', ... })
//       const student = students.find(s => s.id === selectedStudent);
//       const course = courses.find(c => c.id === selectedCourse);
      
//       const newEnrollment: Enrollment = {
//         id: `e${enrollments.length + 1}`,
//         studentId: selectedStudent,
//         studentName: student?.names || '',
//         studentEmail: student?.email || '',
//         courseId: selectedCourse,
//         courseCode: course?.code || '',
//         courseName: course?.title || '',
//         enrolledAt: new Date().toISOString(),
//         status: 'active',
//         progress: 0
//       };

//       setEnrollments(prev => [...prev, newEnrollment]);
//       setSelectedStudent('');
//       setSelectedCourse('');
//       alert('Student enrolled successfully!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to enroll student');
//     }
//   };

//   const handleUnenroll = async () => {
//     if (!enrollmentToRemove) return;
//     try {
//       // Backend: await fetch(`/api/admin/enrollments/${enrollmentToRemove.id}`, { method: 'DELETE' })
//       setEnrollments(prev => prev.filter(e => e.id !== enrollmentToRemove.id));
//       setShowUnenrollModal(false);
//       setEnrollmentToRemove(null);
//       alert('Student unenrolled successfully!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to unenroll student');
//     }
//   };

//   const UnenrollModal = () => (
//     <div className={`modal fade ${showUnenrollModal ? 'show d-block' : ''}`} style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Confirm Unenroll</h5>
//             <button type="button" className="btn-close" onClick={() => setShowUnenrollModal(false)}></button>
//           </div>
//           <div className="modal-body">
//             <p>Are you sure you want to unenroll:</p>
//             <div className="alert alert-info mb-3">
//               <div className="mb-2"><strong>Student:</strong> {enrollmentToRemove?.studentName}</div>
//               <div><strong>Course:</strong> {enrollmentToRemove?.courseCode} - {enrollmentToRemove?.courseName}</div>
//               <div className="mt-2"><strong>Progress:</strong> {enrollmentToRemove?.progress}%</div>
//             </div>
//             <div className="alert alert-warning mb-0">
//               <i className="fa fa-exclamation-triangle me-2"></i>
//               The student will lose access to course materials and progress data.
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button className="btn btn-outline-secondary" onClick={() => setShowUnenrollModal(false)}>Cancel</button>
//             <button className="btn btn-danger" onClick={handleUnenroll}>Unenroll Student</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
//         <div className="spinner-border text-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-wrapper">
//       <div className="page-content bg-white p-4">
//         <div className="container-fluid">
//           <div className="mb-4">
//             <h4 className="mb-1">Enroll Students in Courses</h4>
//             <p className="text-muted mb-0">Manage student course enrollments and track progress</p>
//           </div>

//           {/* Stats */}
//           <div className="row mb-4">
//             <div className="col-md-3">
//               <div className="card bg-primary text-white">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <h3 className="mb-0">{stats.totalEnrollments}</h3>
//                       <p className="mb-0 small">Total Enrollments</p>
//                     </div>
//                     <i className="fa fa-graduation-cap fa-2x opacity-50"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card bg-success text-white">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <h3 className="mb-0">{stats.activeEnrollments}</h3>
//                       <p className="mb-0 small">Active Enrollments</p>
//                     </div>
//                     <i className="fa fa-check-circle fa-2x opacity-50"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card bg-info text-white">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <h3 className="mb-0">{stats.studentsEnrolled}/{stats.totalStudents}</h3>
//                       <p className="mb-0 small">Students Enrolled</p>
//                     </div>
//                     <i className="fa fa-user-graduate fa-2x opacity-50"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card bg-warning text-white">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <h3 className="mb-0">{stats.coursesWithStudents}/{stats.totalCourses}</h3>
//                       <p className="mb-0 small">Courses Active</p>
//                     </div>
//                     <i className="fa fa-book fa-2x opacity-50"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Enrollment Form */}
//           <div className="card mb-4">
//             <div className="card-header bg-light">
//               <h6 className="mb-0"><i className="fa fa-user-plus me-2"></i>New Enrollment</h6>
//             </div>
//             <div className="card-body">
//               <div className="row g-3">
//                 <div className="col-md-5">
//                   <label className="form-label">Select Student *</label>
//                   <select className="form-select" value={selectedStudent} onChange={(e) => {
//                     setSelectedStudent(e.target.value);
//                     setSelectedCourse('');
//                   }}>
//                     <option value="">Choose a student...</option>
//                     {students.filter(s => s.is_active).map(student => {
//                       const workload = getStudentWorkload(student.id);
//                       return (
//                         <option key={student.id} value={student.id}>
//                           {student.names} - {workload} active course(s)
//                         </option>
//                       );
//                     })}
//                   </select>
//                   {selectedStudent && <small className="text-muted">{students.find(s => s.id === selectedStudent)?.email}</small>}
//                 </div>
//                 <div className="col-md-5">
//                   <label className="form-label">Select Course *</label>
//                   <select className="form-select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
//                     <option value="">Choose a course...</option>
//                     {getAvailableCourses().map(course => (
//                       <option key={course.id} value={course.id}>
//                         {course.code} - {course.title} ({course.enrolledStudents?.length || 0} enrolled)
//                       </option>
//                     ))}
//                   </select>
//                   {selectedCourse && (
//                     <small className="text-muted">
//                       Tutor: {courses.find(c => c.id === selectedCourse)?.tutorName || 'Unassigned'}
//                     </small>
//                   )}
//                 </div>
//                 <div className="col-md-2 d-flex align-items-end">
//                   <button className="btn btn-primary w-100" onClick={handleEnrollStudent} disabled={!selectedStudent || !selectedCourse}>
//                     <i className="fa fa-plus me-2"></i>Enroll
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Search and Filter */}
//           <div className="card mb-4">
//             <div className="card-body">
//               <div className="row g-3">
//                 <div className="col-md-8">
//                   <div className="input-group">
//                     <span className="input-group-text"><i className="fa fa-search"></i></span>
//                     <input type="text" className="form-control" placeholder="Search by student name, course name or code..." 
//                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
//                     <option value="all">All Status</option>
//                     <option value="active">Active Only</option>
//                     <option value="completed">Completed Only</option>
//                     <option value="dropped">Dropped Only</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Enrollments Table */}
//           <div className="card mb-4">
//             <div className="card-header">
//               <h6 className="mb-0"><i className="fa fa-list me-2"></i>Current Enrollments ({filteredEnrollments.length})</h6>
//             </div>
//             <div className="card-body">
//               {filteredEnrollments.length === 0 ? (
//                 <div className="text-center py-4">
//                   <i className="fa fa-graduation-cap fa-3x text-muted mb-3"></i>
//                   <h5>No enrollments found</h5>
//                   <p className="text-muted">Try adjusting your search or enroll a student above</p>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-hover align-middle">
//                     <thead>
//                       <tr>
//                         <th>Student</th>
//                         <th>Course</th>
//                         <th className="text-center">Progress</th>
//                         <th className="text-center">Status</th>
//                         <th className="text-center">Enrolled Date</th>
//                         <th className="text-end">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredEnrollments.map(enrollment => (
//                         <tr key={enrollment.id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-2"
//                                    style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}>
//                                 {getInitials(enrollment.studentName)}
//                               </div>
//                               <div>
//                                 <strong>{enrollment.studentName}</strong>
//                                 <div className="text-muted small">{enrollment.studentEmail}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <div>
//                               <strong className="text-primary">{enrollment.courseCode}</strong>
//                               <div className="text-muted small">{enrollment.courseName}</div>
//                             </div>
//                           </td>
//                           <td className="text-center">
//                             <div style={{width: '80px', margin: '0 auto'}}>
//                               <div className="progress" style={{height: '8px'}}>
//                                 <div className="progress-bar" role="progressbar" 
//                                      style={{width: `${enrollment.progress}%`}}
//                                      aria-valuenow={enrollment.progress} aria-valuemin={0} aria-valuemax={100}></div>
//                               </div>
//                               <small className="text-muted">{enrollment.progress}%</small>
//                             </div>
//                           </td>
//                           <td className="text-center">
//                             <span className={`badge bg-${
//                               enrollment.status === 'active' ? 'success' : 
//                               enrollment.status === 'completed' ? 'primary' : 'secondary'
//                             }`}>
//                               {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
//                             </span>
//                           </td>
//                           <td className="text-center">
//                             <small className="text-muted">{formatDate(enrollment.enrolledAt)}</small>
//                           </td>
//                           <td className="text-end">
//                             <button className="btn btn-sm btn-outline-danger" onClick={() => {
//                               setEnrollmentToRemove(enrollment);                              setShowUnenrollModal(true);
//                             }}>
//                               <i className="fa fa-user-minus me-1"></i>Unenroll
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Student Overview */}
//           <div className="card mb-4">
//             <div className="card-header">
//               <h6 className="mb-0">
//                 <i className="fa fa-users me-2"></i>Student Enrollment Overview
//               </h6>
//             </div>
//             <div className="card-body">
//               <div className="row">
//                 {students.map(student => {
//                   const studentEnrollments = getCoursesForStudent(student.id);
//                   return (
//                     <div className="col-md-6 col-lg-4 mb-3" key={student.id}>
//                       <div className="border rounded p-3 h-100">
//                         <div className="d-flex align-items-center mb-2">
//                           <div
//                             className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
//                             style={{ width: '36px', height: '36px', fontSize: '13px', fontWeight: 'bold' }}
//                           >
//                             {getInitials(student.names)}
//                           </div>
//                           <div>
//                             <strong>{student.names}</strong>
//                             <div className="text-muted small">{student.email}</div>
//                           </div>
//                         </div>

//                         {studentEnrollments.length === 0 ? (
//                           <p className="text-muted small mb-0">No enrollments</p>
//                         ) : (
//                           <ul className="list-unstyled small mb-0">
//                             {studentEnrollments.map(e => (
//                               <li key={e.id} className="d-flex justify-content-between">
//                                 <span>{e.courseCode}</span>
//                                 <span
//                                   className={`text-${
//                                     e.status === 'active'
//                                       ? 'success'
//                                       : e.status === 'completed'
//                                       ? 'primary'
//                                       : 'secondary'
//                                   }`}
//                                 >
//                                   {e.status}
//                                 </span>
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Unenroll Confirmation Modal */}
//       {showUnenrollModal && <UnenrollModal />}
//     </div>
//   );
// };

// export default ManageEnrollments;


// // v2 - integrated with backend
// import { useState, useEffect } from 'react';
// import CourseService from '@/services/courses/CourseService';
// import { UserService } from '@/services/users/UserService';
// import toast from 'react-hot-toast';
// import type { User } from '@/types/auth';
// import type { Course } from '@/types/course';
// import type { Enrollment, EnrollmentStats } from '@/types/enrollment';
// import { formatDate } from '@/utils/format';
// import { getInitials } from '@/utils/helpers';
// import { EnrollmentService } from '@/services/courses/Enrollment';

// const ManageEnrollments: React.FC = () => {
//   // State
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [students, setStudents] = useState<User[]>([]);
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
//   const [stats, setStats] = useState<EnrollmentStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Form state
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [enrolling, setEnrolling] = useState(false);

//   // Filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'dropped'>('all');

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // Modal state
//   const [showUnenrollModal, setShowUnenrollModal] = useState(false);
//   const [enrollmentToRemove, setEnrollmentToRemove] = useState<Enrollment | null>(null);
//   const [unenrolling, setUnenrolling] = useState(false);

//   const [session, setSession] = useState("2026/2027");
//   const [term, setTerm] = useState("Q1.2026");

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm, filterStatus]);

//   // Fetch data when dependencies change
//   useEffect(() => {
//     fetchEnrollments();
//   }, [page, searchTerm, filterStatus]);

//   // Fetch initial data (students, courses, stats)
//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const fetchInitialData = async () => {
//     try {
//       const [studentsResponse, coursesResponse, statsResponse] = await Promise.all([
//         UserService.getAll({ role: 'student' }),
//         CourseService.getAll({ status: 'active' }),
//         EnrollmentService.getStats(),
//       ]);

//       setStudents(studentsResponse.data?.users || []);
//       setCourses(coursesResponse.data?.courses || []);
//       setStats(statsResponse.data || null);
//     } catch (error) {
//       console.error('Failed to fetch initial data:', error);
//       toast.error('Failed to load initial data');
//     }
//   };

//   const fetchEnrollments = async () => {
//     try {
//       setLoading(true);

//       const params: Record<string, any> = {
//         page,
//         page_size: pageSize,
//       };

//       if (searchTerm) params.search = searchTerm;
//       if (filterStatus !== 'all') params.status = filterStatus;

//       const response = await EnrollmentService.getAll(params);

//       const enrollmentsData = response.data?.enrollments || [];
//       const metaData = response.data?.meta || {};

//       setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);

//       const totalCount = metaData.total ?? enrollmentsData.length;
//       setTotal(totalCount);

//       const pages = Math.ceil(totalCount / pageSize);
//       setTotalPages(pages);
//     } catch (error: any) {
//       console.error('Failed to fetch enrollments:', error);
//       toast.error('Failed to load enrollments');
//       setEnrollments([]);
//       setTotal(0);
//       setTotalPages(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshData = () => {
//     fetchEnrollments();
//     fetchInitialData();
//   };

//   /* ------------------ Enrollment Actions ------------------ */
//   const getAvailableCourses = () => {
//     if (!selectedStudent) return courses;

//     const enrolledCourseIds = enrollments
//       .filter(e => e.student_id === selectedStudent && e.status !== 'dropped')
//       .map(e => e.course_id);

//     return courses.filter(c => !enrolledCourseIds.includes(c.id));
//   };

//   const handleEnrollStudent = async () => {
//     if (!selectedStudent || !selectedCourse) {
//       toast.error('Please select both a student and a course');
//       return;
//     }

//     try {
//       setEnrolling(true);

//       // await EnrollmentService.create({
//       //   student_id: selectedStudent,
//       //   course_id: selectedCourse,
//       // });
//       await EnrollmentService.create({
//       student_id: selectedStudent,
//       course_id: selectedCourse,
//       session,
//       term,
//     });


//       toast.success('Student enrolled successfully');
//       setSelectedStudent('');
//       setSelectedCourse('');
//       refreshData();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to enroll student');
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   const handleUnenroll = async () => {
//     if (!enrollmentToRemove) return;

//     try {
//       setUnenrolling(true);

//       await EnrollmentService.delete(enrollmentToRemove.id);

//       toast.success('Student unenrolled successfully');
//       setShowUnenrollModal(false);
//       setEnrollmentToRemove(null);

//       // If we deleted the last item on the page, go back a page
//       if (enrollments.length === 1 && page > 1) {
//         setPage(page - 1);
//       } else {
//         refreshData();
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to unenroll student');
//     } finally {
//       setUnenrolling(false);
//     }
//   };

//   /* ------------------ Helper Functions ------------------ */
//   const getStudentWorkload = (studentId: string) => {
//     return enrollments.filter(
//       e => e.student_id === studentId && e.status === 'active'
//     ).length;
//   };

//   const getCoursesForStudent = (studentId: string) => {
//     return enrollments.filter(e => e.student_id === studentId);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterStatus('all');
//     setPage(1);
//   };

//   /* ------------------ Pagination ------------------ */
//   const hasNextPage = page < totalPages;
//   const hasPrevPage = page > 1;
//   const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
//   const endItem = Math.min(page * pageSize, total);
//   const hasActiveFilters = searchTerm || filterStatus !== 'all';

//   if (loading && enrollments.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-wrapper">
//       <div className="page-content bg-white p-3 p-md-4">
//         <div className="container-fluid">
//           {/* Header */}
//           <div className="mb-4">
//             <h4 className="mb-1">Manage Enrollments</h4>
//             <p className="text-muted mb-0">Enroll students in courses and track progress</p>
//           </div>

//           {/* Stats */}
//           {stats && (
//               <div className="row g-3 mb-3 align-items-end">
//               <div className="col-6 col-md-3">
//                 <div className="card bg-primary text-white shadow-sm">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h3 className="mb-0">{stats.total_enrollments}</h3>
//                         <p className="mb-0 small opacity-75">Total Enrollments</p>
//                       </div>
//                       <i className="fa fa-graduation-cap fa-2x opacity-25" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-6 col-md-3">
//                 <div className="card bg-success text-white shadow-sm">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h3 className="mb-0">{stats.active_enrollments}</h3>
//                         <p className="mb-0 small opacity-75">Active</p>
//                       </div>
//                       <i className="fa fa-check-circle fa-2x opacity-25" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-6 col-md-3">
//                 <div className="card bg-info text-white shadow-sm">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h3 className="mb-0">
//                           {stats.students_enrolled}/{stats.total_students}
//                         </h3>
//                         <p className="mb-0 small opacity-75">Students Enrolled</p>
//                       </div>
//                       <i className="fa fa-user-graduate fa-2x opacity-25" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-6 col-md-3">
//                 <div className="card bg-warning text-white shadow-sm">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h3 className="mb-0">
//                           {stats.courses_with_students}/{stats.total_courses}
//                         </h3>
//                         <p className="mb-0 small opacity-75">Courses Active</p>
//                       </div>
//                       <i className="fa fa-book fa-2x opacity-25" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Enrollment Form */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-header bg-light">
//               <h6 className="mb-0">
//                 <i className="fa fa-user-plus me-2" />
//                 New Enrollment
//               </h6>
//             </div>
//             <div className="card-body">
//               <div className="row g-3 align-items-end">

//                 <div className="col-12 col-md-6">
//                   <label className="form-label">
//                     Select Student <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     value={selectedStudent}
//                     onChange={(e) => {
//                       setSelectedStudent(e.target.value);
//                       setSelectedCourse('');
//                     }}
//                     disabled={enrolling}
//                   >
//                     <option value="">Choose a student...</option>
//                     {students
//                       .filter(s => s.is_active)
//                       .map(student => {
//                         const workload = getStudentWorkload(student.id);
//                         return (
//                           <option key={student.id} value={student.id}>
//                             {student.names} - {workload} active course(s)
//                           </option>
//                         );
//                       })}
//                   </select>
//                   {selectedStudent && (
//                     <small className="text-muted">
//                       {students.find(s => s.id === selectedStudent)?.email}
//                     </small>
//                   )}
//                 </div>

//                 <div className="col-12 col-md-6">
//                   <label className="form-label">
//                     Select Course <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     value={selectedCourse}
//                     onChange={(e) => setSelectedCourse(e.target.value)}
//                     disabled={!selectedStudent || enrolling}
//                   >
//                     <option value="">Choose a course...</option>
//                     {getAvailableCourses().map(course => (
//                       <option key={course.id} value={course.id}>
//                         {course.code} - {course.title}
//                       </option>
//                     ))}
//                   </select>
//                   {selectedCourse && (
//                     <small className="text-muted">
//                       {courses.find(c => c.id === selectedCourse)?.description?.slice(0, 50)}
//                     </small>
//                   )}
//                 </div>

//                   {/*  */}
//                   <div className="col-12 col-md-2">
//   <label className="form-label">Session</label>
//   <input
//     type="text"
//     className="form-control"
//     placeholder="e.g., 2026/2027"
//     value={session}
//     onChange={(e) => setSession(e.target.value)}
//   />
// </div>

// <div className="col-12 col-md-2">
//   <label className="form-label">Term</label>
//   <input
//     type="text"
//     className="form-control"
//     placeholder="e.g., Q1.2026"
//     value={term}
//     onChange={(e) => setTerm(e.target.value)}
//   />
// </div>

//                   {/*  */}

//                 <div className="col-12 col-md-6 d-flex align-items-end">
//                   <button
//                     className="btn btn-primary w-100"
//                     onClick={handleEnrollStudent}
//                     disabled={!selectedStudent || !selectedCourse || enrolling}
//                   >
//                     {enrolling ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" />
//                         Enrolling...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fa fa-plus me-2" />
//                         Enroll
//                       </>
//                     )}
//                   </button>
//                 </div>

//               </div>
//             </div>
//           </div>

//           {/* Search and Filter */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-body">
//               <div className="row g-3 align-items-end">
//                 <div className="col-12 col-md-8">
//                   <label className="form-label small text-muted mb-1">Search</label>
//                   <div className="input-group">
//                     <span className="input-group-text bg-white">
//                       <i className="fa fa-search text-muted" />
//                     </span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Search by student name, email, or course..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     {searchTerm && (
//                       <button
//                         className="btn btn-outline-secondary"
//                         type="button"
//                         onClick={() => setSearchTerm('')}
//                       >
//                         <i className="fa fa-times" />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-12 col-md-4">
//                   <label className="form-label small text-muted mb-1">Status</label>
//                   <select
//                     className="form-select"
//                     value={filterStatus}
//                     onChange={(e) =>
//                       setFilterStatus(e.target.value as typeof filterStatus)
//                     }
//                   >
//                     <option value="all">All Statuses</option>
//                     <option value="active">Active Only</option>
//                     <option value="completed">Completed Only</option>
//                     <option value="dropped">Dropped Only</option>
//                   </select>
//                 </div>
//               </div>

//               {hasActiveFilters && (
//                 <div className="mt-3 pt-3 border-top">
//                   <div className="d-flex align-items-center gap-2 flex-wrap">
//                     <span className="small text-muted">Active filters:</span>
//                     {searchTerm && (
//                       <span className="badge bg-primary rounded-pill">
//                         <i className="fa fa-search me-1" />
//                         {searchTerm}
//                         <button
//                           type="button"
//                           className="btn-close btn-close-white ms-2"
//                           style={{ fontSize: '0.6rem' }}
//                           onClick={() => setSearchTerm('')}
//                         />
//                       </span>
//                     )}
//                     {filterStatus !== 'all' && (
//                       <span className="badge bg-info rounded-pill">
//                         <i className="fa fa-filter me-1" />
//                         Status: {filterStatus}
//                         <button
//                           type="button"
//                           className="btn-close btn-close-white ms-2"
//                           style={{ fontSize: '0.6rem' }}
//                           onClick={() => setFilterStatus('all')}
//                         />
//                       </span>
//                     )}
//                     <button
//                       className="btn btn-sm btn-outline-secondary ms-auto"
//                       onClick={clearFilters}
//                     >
//                       <i className="fa fa-times me-1" />
//                       Clear All
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="mt-3 pt-3 border-top">
//                 <p className="mb-0 small text-muted">
//                   {total > 0 ? (
//                     <>
//                       Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
//                       <strong>{total}</strong> enrollments
//                       {totalPages > 1 && (
//                         <span className="ms-2">
//                           (Page <strong>{page}</strong> of <strong>{totalPages}</strong>)
//                         </span>
//                       )}
//                     </>
//                   ) : (
//                     'No enrollments found'
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Enrollments Table */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-header bg-light">
//               <h6 className="mb-0">
//                 <i className="fa fa-list me-2" />
//                 Current Enrollments
//               </h6>
//             </div>
//             <div className="card-body p-0">
//               {loading ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary" />
//                 </div>
//               ) : enrollments.length === 0 ? (
//                 <div className="text-center py-5">
//                   <i className="fa fa-graduation-cap fa-3x text-muted mb-3" />
//                   <h5>No enrollments found</h5>
//                   <p className="text-muted">
//                     {hasActiveFilters
//                       ? 'Try adjusting your filters'
//                       : 'Enroll a student in a course to get started'}
//                   </p>
//                   {hasActiveFilters && (
//                     <button className="btn btn-sm btn-outline-primary" onClick={clearFilters}>
//                       Clear Filters
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <div className="table-responsive">
//                     <table className="table table-hover align-middle mb-0">
//                       <thead className="table-light">
//                         <tr>
//                           <th className="border-0">Student</th>
//                           <th className="border-0">Course</th>
//                           <th className="text-center border-0">Progress</th>
//                           <th className="text-center border-0">Status</th>
//                           <th className="text-center border-0">Enrolled</th>
//                           <th className="text-end border-0">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {enrollments.map(enrollment => {
//                           const student = enrollment.student || {};
//                           const course = enrollment.course || {};

//                           return (
//                             <tr key={enrollment.id}>
//                               <td>
//                                 <div className="d-flex align-items-center">
//                                   <div
//                                     className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-2"
//                                     style={{
//                                       width: '40px',
//                                       height: '40px',
//                                       fontSize: '14px',
//                                       fontWeight: 'bold',
//                                     }}
//                                   >
//                                     {getInitials(student.names || 'NA')}
//                                   </div>
//                                   <div>
//                                     <strong>{student.names || 'Unknown'}</strong>
//                                     <div className="text-muted small">
//                                       {student.email || 'No email'}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td>
//                                 <div>
//                                   <strong className="text-primary">{course.code || 'N/A'}</strong>
//                                   <div className="text-muted small">
//                                     {course.title || 'Unknown Course'}
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="text-center">
//                                 <div style={{ width: '80px', margin: '0 auto' }}>
//                                   <div className="progress" style={{ height: '8px' }}>
//                                     <div
//                                       className="progress-bar"
//                                       role="progressbar"
//                                       style={{ width: `${enrollment.progress || 0}%` }}
//                                       aria-valuenow={enrollment.progress || 0}
//                                       aria-valuemin={0}
//                                       aria-valuemax={100}
//                                     />
//                                   </div>
//                                   <small className="text-muted">{enrollment.progress || 0}%</small>
//                                 </div>
//                               </td>
//                               <td className="text-center">
//                                 <span
//                                   className={`badge bg-${
//                                     enrollment.status === 'active'
//                                       ? 'success'
//                                       : enrollment.status === 'completed'
//                                       ? 'primary'
//                                       : 'secondary'
//                                   }`}
//                                 >
//                                   {enrollment.status?.charAt(0).toUpperCase() +
//                                     enrollment.status?.slice(1)}
//                                 </span>
//                               </td>
//                               <td className="text-center">
//                                 <small className="text-muted">
//                                   {formatDate(enrollment.enrolled_at)}
//                                 </small>
//                               </td>
//                               <td className="text-end">
//                                 <button
//                                   className="btn btn-sm btn-outline-danger"
//                                   onClick={() => {
//                                     setEnrollmentToRemove(enrollment);
//                                     setShowUnenrollModal(true);
//                                   }}
//                                 >
//                                   <i className="fa fa-user-minus me-1" />
//                                   Unenroll
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="d-flex justify-content-between align-items-center p-3 border-top">
//                       <button
//                         className="btn btn-outline-secondary btn-sm"
//                         disabled={!hasPrevPage}
//                         onClick={() => setPage(p => p - 1)}
//                       >
//                         <i className="fa fa-chevron-left me-1" />
//                         Previous
//                       </button>

//                       <span className="small text-muted">
//                         Page <strong>{page}</strong> of <strong>{totalPages}</strong>
//                       </span>

//                       <button
//                         className="btn btn-outline-secondary btn-sm"
//                         disabled={!hasNextPage}
//                         onClick={() => setPage(p => p + 1)}
//                       >
//                         Next
//                         <i className="fa fa-chevron-right ms-1" />
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Student Overview */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-header bg-light">
//               <h6 className="mb-0">
//                 <i className="fa fa-users me-2" />
//                 Student Enrollment Overview
//               </h6>
//             </div>
//             <div className="card-body">
//               <div className="row g-3">
//                 {students.map(student => {
//                   const studentEnrollments = getCoursesForStudent(student.id);
//                   return (
//                     <div className="col-12 col-md-6 col-lg-4" key={student.id}>
//                       <div className="border rounded p-3 h-100">
//                         <div className="d-flex align-items-center mb-2">
//                           <div
//                             className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
//                             style={{
//                               width: '36px',
//                               height: '36px',
//                               fontSize: '13px',
//                               fontWeight: 'bold',
//                             }}
//                           >
//                             {getInitials(student.names)}
//                           </div>
//                           <div>
//                             <strong>{student.names}</strong>
//                             <div className="text-muted small">{student.email}</div>
//                           </div>
//                         </div>

//                         {studentEnrollments.length === 0 ? (
//                           <p className="text-muted small mb-0">No enrollments</p>
//                         ) : (
//                           <ul className="list-unstyled small mb-0">
//                             {studentEnrollments.map(e => {
//                               const course = e.course || {};
//                               return (
//                                 <li
//                                   key={e.id}
//                                   className="d-flex justify-content-between align-items-center mb-1"
//                                 >
//                                   <span className="text-truncate me-2">
//                                     {course.code || 'N/A'}
//                                   </span>
//                                   <span
//                                     className={`badge bg-${
//                                       e.status === 'active'
//                                         ? 'success'
//                                         : e.status === 'completed'
//                                         ? 'primary'
//                                         : 'secondary'
//                                     }`}
//                                   >
//                                     {e.status}
//                                   </span>
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Unenroll Confirmation Modal */}
//       {showUnenrollModal && enrollmentToRemove && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
//           onClick={() => !unenrolling && setShowUnenrollModal(false)}
//         >
//           <div
//             className="modal-dialog modal-dialog-centered"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content">
//               <div className="modal-header border-0">
//                 <h5 className="modal-title">Confirm Unenroll</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowUnenrollModal(false)}
//                   disabled={unenrolling}
//                 />
//               </div>
//               <div className="modal-body">
//                 <p>Are you sure you want to unenroll this student?</p>
//                 <div className="alert alert-info mb-3">
//                   <div className="mb-2">
//                     <strong>Student:</strong>{' '}
//                     {enrollmentToRemove.student?.names || 'Unknown'}
//                   </div>
//                   <div className="mb-2">
//                     <strong>Course:</strong>{' '}
//                     {enrollmentToRemove.course?.code || 'N/A'} -{' '}
//                     {enrollmentToRemove.course?.title || 'Unknown'}
//                   </div>
//                   <div>
//                     <strong>Progress:</strong> {enrollmentToRemove.progress || 0}%
//                   </div>
//                 </div>
//                 <div className="alert alert-warning mb-0">
//                   <i className="fa fa-exclamation-triangle me-2" />
//                   The student will lose access to course materials and their progress data.
//                 </div>
//               </div>
//               <div className="modal-footer border-0">
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={() => setShowUnenrollModal(false)}
//                   disabled={unenrolling}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-danger"
//                   onClick={handleUnenroll}
//                   disabled={unenrolling}
//                 >
//                   {unenrolling ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" />
//                       Unenrolling...
//                     </>
//                   ) : (
//                     <>
//                       <i className="fa fa-user-minus me-2" />
//                       Unenroll Student
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageEnrollments;

// // v3 - resonsive
// // v2 - integrated with backend - Responsive & DRY
// import { useState, useEffect } from 'react';
// import CourseService from '@/services/courses/CourseService';
// import { UserService } from '@/services/users/UserService';
// import toast from 'react-hot-toast';
// import type { User } from '@/types/auth';
// import type { Course } from '@/types/course';
// import type { Enrollment, EnrollmentStats } from '@/types/enrollment';
// import { formatDate } from '@/utils/format';
// import { getInitials } from '@/utils/helpers';
// import { EnrollmentService } from '@/services/courses/Enrollment';

// // ============================================================================
// // REUSABLE COMPONENTS (DRY Principle)
// // ============================================================================

// interface StatCardProps {
//   value: number | string;
//   label: string;
//   icon: string;
//   bgColor: string;
// }

// const StatCard: React.FC<StatCardProps> = ({ value, label, icon, bgColor }) => (
//   <div className="col-6 col-md-3">
//     <div className={`card ${bgColor} text-white shadow-sm`}>
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-center">
//           <div>
//             <h3 className="mb-0">{value}</h3>
//             <p className="mb-0 small opacity-75">{label}</p>
//           </div>
//           <i className={`${icon} fa-2x opacity-25`} />
//         </div>
//       </div>
//     </div>
//   </div>
// );

// interface FormSelectProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   options: Array<{ value: string; label: string; disabled?: boolean }>;
//   disabled?: boolean;
//   required?: boolean;
//   hint?: string;
//   placeholder?: string;
// }

// const FormSelect: React.FC<FormSelectProps> = ({
//   label,
//   value,
//   onChange,
//   options,
//   disabled = false,
//   required = false,
//   hint,
//   placeholder = 'Choose...'
// }) => (
//   <div className="col-12 col-md-6 col-lg-3">
//     <label className="form-label">
//       {label} {required && <span className="text-danger">*</span>}
//     </label>
//     <select
//       className="form-select"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       disabled={disabled}
//     >
//       <option value="">{placeholder}</option>
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value} disabled={opt.disabled}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//     {hint && <small className="text-muted d-block mt-1">{hint}</small>}
//   </div>
// );

// interface FormInputProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   colClass?: string;
// }

// const FormInput: React.FC<FormInputProps> = ({
//   label,
//   value,
//   onChange,
//   placeholder,
//   colClass = 'col-12 col-md-6 col-lg-3'
// }) => (
//   <div className={colClass}>
//     <label className="form-label">{label}</label>
//     <input
//       type="text"
//       className="form-control"
//       placeholder={placeholder}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//     />
//   </div>
// );

// interface ButtonProps {
//   onClick: () => void;
//   disabled?: boolean;
//   loading?: boolean;
//   variant?: 'primary' | 'secondary' | 'danger' | 'outline-secondary' | 'outline-danger' | 'outline-primary';
//   size?: 'sm' | 'md' | 'lg';
//   icon?: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const Button: React.FC<ButtonProps> = ({
//   onClick,
//   disabled = false,
//   loading = false,
//   variant = 'primary',
//   size = 'md',
//   icon,
//   children,
//   className = ''
// }) => {
//   const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  
//   return (
//     <button
//       className={`btn btn-${variant} ${sizeClass} ${className}`}
//       onClick={onClick}
//       disabled={disabled || loading}
//     >
//       {loading ? (
//         <>
//           <span className="spinner-border spinner-border-sm me-2" />
//           {children}
//         </>
//       ) : (
//         <>
//           {icon && <i className={`${icon} me-2`} />}
//           {children}
//         </>
//       )}
//     </button>
//   );
// };

// interface FilterBadgeProps {
//   children: React.ReactNode;
//   onRemove: () => void;
//   icon?: string;
// }

// const FilterBadge: React.FC<FilterBadgeProps> = ({ children, onRemove, icon }) => (
//   <span className="badge bg-primary rounded-pill">
//     {icon && <i className={`${icon} me-1`} />}
//     {children}
//     <button
//       type="button"
//       className="btn-close btn-close-white ms-2"
//       style={{ fontSize: '0.6rem' }}
//       onClick={onRemove}
//     />
//   </span>
// );

// interface EmptyStateProps {
//   icon: string;
//   title: string;
//   description: string;
//   actionLabel?: string;
//   onAction?: () => void;
// }

// const EmptyState: React.FC<EmptyStateProps> = ({
//   icon,
//   title,
//   description,
//   actionLabel,
//   onAction
// }) => (
//   <div className="text-center py-5">
//     <i className={`${icon} fa-3x text-muted mb-3`} />
//     <h5>{title}</h5>
//     <p className="text-muted">{description}</p>
//     {actionLabel && onAction && (
//       <button className="btn btn-sm btn-outline-primary" onClick={onAction}>
//         {actionLabel}
//       </button>
//     )}
//   </div>
// );

// interface StudentAvatarProps {
//   name: string;
//   size?: number;
//   bgColor?: string;
// }

// const StudentAvatar: React.FC<StudentAvatarProps> = ({
//   name,
//   size = 40,
//   bgColor = 'bg-success'
// }) => (
//   <div
//     className={`rounded-circle ${bgColor} text-white d-flex align-items-center justify-content-center`}
//     style={{
//       width: `${size}px`,
//       height: `${size}px`,
//       fontSize: `${size * 0.35}px`,
//       fontWeight: 'bold',
//       flexShrink: 0
//     }}
//   >
//     {getInitials(name || 'NA')}
//   </div>
// );

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// const ManageEnrollments: React.FC = () => {
//   // State
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [students, setStudents] = useState<User[]>([]);
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
//   const [stats, setStats] = useState<EnrollmentStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Form state
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [session, setSession] = useState('2026/2027');
//   const [term, setTerm] = useState('Q1.2026');
//   const [enrolling, setEnrolling] = useState(false);

//   // Filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'dropped'>('all');

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // Modal state
//   const [showUnenrollModal, setShowUnenrollModal] = useState(false);
//   const [enrollmentToRemove, setEnrollmentToRemove] = useState<Enrollment | null>(null);
//   const [unenrolling, setUnenrolling] = useState(false);

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm, filterStatus]);

//   // Fetch data when dependencies change
//   useEffect(() => {
//     fetchEnrollments();
//   }, [page, searchTerm, filterStatus]);

//   // Fetch initial data
//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const fetchInitialData = async () => {
//     try {
//       const [studentsResponse, coursesResponse, statsResponse] = await Promise.all([
//         UserService.getAll({ role: 'student' }),
//         CourseService.getAll({ status: 'active' }),
//         EnrollmentService.getStats(),
//       ]);

//       setStudents(studentsResponse.data?.users || []);
//       setCourses(coursesResponse.data?.courses || []);
//       setStats(statsResponse.data || null);
//     } catch (error) {
//       console.error('Failed to fetch initial data:', error);
//       toast.error('Failed to load initial data');
//     }
//   };

//   const fetchEnrollments = async () => {
//     try {
//       setLoading(true);
//       const params: Record<string, any> = { page, page_size: pageSize };

//       if (searchTerm) params.search = searchTerm;
//       if (filterStatus !== 'all') params.status = filterStatus;

//       const response = await EnrollmentService.getAll(params);
//       const enrollmentsData = response.data?.enrollments || [];
//       const metaData = response.data?.meta || {};

//       setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
//       const totalCount = metaData.total ?? enrollmentsData.length;
//       setTotal(totalCount);
//       setTotalPages(Math.ceil(totalCount / pageSize));
//     } catch (error: any) {
//       console.error('Failed to fetch enrollments:', error);
//       toast.error('Failed to load enrollments');
//       setEnrollments([]);
//       setTotal(0);
//       setTotalPages(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshData = () => {
//     fetchEnrollments();
//     fetchInitialData();
//   };

//   // ============================================================================
//   // ENROLLMENT ACTIONS
//   // ============================================================================

//   const getAvailableCourses = () => {
//     if (!selectedStudent) return courses;
//     const enrolledCourseIds = enrollments
//       .filter(e => e.student_id === selectedStudent && e.status !== 'dropped')
//       .map(e => e.course_id);
//     return courses.filter(c => !enrolledCourseIds.includes(c.id));
//   };

//   const handleEnrollStudent = async () => {
//     if (!selectedStudent || !selectedCourse) {
//       toast.error('Please select both a student and a course');
//       return;
//     }

//     try {
//       setEnrolling(true);
//       await EnrollmentService.create({
//         student_id: selectedStudent,
//         course_id: selectedCourse,
//         session,
//         term,
//       });

//       toast.success('Student enrolled successfully');
//       setSelectedStudent('');
//       setSelectedCourse('');
//       refreshData();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to enroll student');
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   const handleUnenroll = async () => {
//     if (!enrollmentToRemove) return;

//     try {
//       setUnenrolling(true);
//       await EnrollmentService.delete(enrollmentToRemove.id);

//       toast.success('Student unenrolled successfully');
//       setShowUnenrollModal(false);
//       setEnrollmentToRemove(null);

//       if (enrollments.length === 1 && page > 1) {
//         setPage(page - 1);
//       } else {
//         refreshData();
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to unenroll student');
//     } finally {
//       setUnenrolling(false);
//     }
//   };

//   // ============================================================================
//   // HELPER FUNCTIONS
//   // ============================================================================

//   const getStudentWorkload = (studentId: string) => {
//     return enrollments.filter(
//       e => e.student_id === studentId && e.status === 'active'
//     ).length;
//   };

//   const getCoursesForStudent = (studentId: string) => {
//     return enrollments.filter(e => e.student_id === studentId);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterStatus('all');
//     setPage(1);
//   };

//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'active': return 'bg-success';
//       case 'completed': return 'bg-primary';
//       case 'dropped': return 'bg-secondary';
//       default: return 'bg-secondary';
//     }
//   };

//   // ============================================================================
//   // COMPUTED VALUES
//   // ============================================================================

//   const hasNextPage = page < totalPages;
//   const hasPrevPage = page > 1;
//   const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
//   const endItem = Math.min(page * pageSize, total);
//   const hasActiveFilters = searchTerm || filterStatus !== 'all';

//   const studentOptions = students
//     .filter(s => s.is_active)
//     .map(student => ({
//       value: student.id,
//       label: `${student.names} - ${getStudentWorkload(student.id)} active course(s)`
//     }));

//   const courseOptions = getAvailableCourses().map(course => ({
//     value: course.id,
//     label: `${course.code} - ${course.title}`
//   }));

//   const statusOptions = [
//     { value: 'all', label: 'All Statuses' },
//     { value: 'active', label: 'Active Only' },
//     { value: 'completed', label: 'Completed Only' },
//     { value: 'dropped', label: 'Dropped Only' }
//   ];

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   if (loading && enrollments.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-wrapper">
//       <div className="page-content bg-white p-3 p-md-4">
//         <div className="container-fluid">
//           {/* Header */}
//           <div className="mb-4">
//             <h4 className="mb-1">Manage Enrollments</h4>
//             <p className="text-muted mb-0">Enroll students in courses and track progress</p>
//           </div>

//           {/* Stats */}
//           {stats && (
//             <div className="row g-3 mb-3">
//               <StatCard
//                 value={stats.total_enrollments}
//                 label="Total Enrollments"
//                 icon="fa fa-graduation-cap"
//                 bgColor="bg-primary"
//               />
//               <StatCard
//                 value={stats.active_enrollments}
//                 label="Active"
//                 icon="fa fa-check-circle"
//                 bgColor="bg-success"
//               />
//               <StatCard
//                 value={`${stats.students_enrolled}/${stats.total_students}`}
//                 label="Students Enrolled"
//                 icon="fa fa-user-graduate"
//                 bgColor="bg-info"
//               />
//               <StatCard
//                 value={`${stats.courses_with_students}/${stats.total_courses}`}
//                 label="Courses Active"
//                 icon="fa fa-book"
//                 bgColor="bg-warning"
//               />
//             </div>
//           )}

//           {/* Enrollment Form */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-header bg-light">
//               <h6 className="mb-0">
//                 <i className="fa fa-user-plus me-2" />
//                 New Enrollment
//               </h6>
//             </div>
//             <div className="card-body">
//               <div className="row g-3 align-items-end">
//                 <FormSelect
//                   label="Select Student"
//                   value={selectedStudent}
//                   onChange={(value) => {
//                     setSelectedStudent(value);
//                     setSelectedCourse('');
//                   }}
//                   options={studentOptions}
//                   disabled={enrolling}
//                   required
//                   placeholder="Choose a student..."
//                   hint={selectedStudent ? students.find(s => s.id === selectedStudent)?.email : undefined}
//                 />

//                 <FormSelect
//                   label="Select Course"
//                   value={selectedCourse}
//                   onChange={setSelectedCourse}
//                   options={courseOptions}
//                   disabled={!selectedStudent || enrolling}
//                   required
//                   placeholder="Choose a course..."
//                   hint={selectedCourse ? courses.find(c => c.id === selectedCourse)?.description?.slice(0, 50) : undefined}
//                 />

//                 <FormInput
//                   label="Session"
//                   value={session}
//                   onChange={setSession}
//                   placeholder="e.g., 2026/2027"
//                 />

//                 <FormInput
//                   label="Term"
//                   value={term}
//                   onChange={setTerm}
//                   placeholder="e.g., Q1.2026"
//                 />

//                 <div className="col-12 col-lg-6">
//                   <Button
//                     onClick={handleEnrollStudent}
//                     disabled={!selectedStudent || !selectedCourse}
//                     loading={enrolling}
//                     icon="fa fa-plus"
//                     className="w-100"
//                   >
//                     {enrolling ? 'Enrolling...' : 'Enroll'}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Search and Filter */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-body">
//               <div className="row g-3 align-items-end">
//                 <div className="col-12 col-md-8">
//                   <label className="form-label small text-muted mb-1">Search</label>
//                   <div className="input-group">
//                     <span className="input-group-text bg-white">
//                       <i className="fa fa-search text-muted" />
//                     </span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Search by student name, email, or course..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     {searchTerm && (
//                       <button
//                         className="btn btn-outline-secondary"
//                         type="button"
//                         onClick={() => setSearchTerm('')}
//                       >
//                         <i className="fa fa-times" />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-12 col-md-4">
//                   <label className="form-label small text-muted mb-1">Status</label>
//                   <select
//                     className="form-select"
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
//                   >
//                     {statusOptions.map(opt => (
//                       <option key={opt.value} value={opt.value}>{opt.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {hasActiveFilters && (
//                 <div className="mt-3 pt-3 border-top">
//                   <div className="d-flex align-items-center gap-2 flex-wrap">
//                     <span className="small text-muted">Active filters:</span>
//                     {searchTerm && (
//                       <FilterBadge icon="fa fa-search" onRemove={() => setSearchTerm('')}>
//                         {searchTerm}
//                       </FilterBadge>
//                     )}
//                     {filterStatus !== 'all' && (
//                       <FilterBadge icon="fa fa-filter" onRemove={() => setFilterStatus('all')}>
//                         Status: {filterStatus}
//                       </FilterBadge>
//                     )}
//                     <button
//                       className="btn btn-sm btn-outline-secondary ms-auto"
//                       onClick={clearFilters}
//                     >
//                       <i className="fa fa-times me-1" />
//                       Clear All
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="mt-3 pt-3 border-top">
//                 <p className="mb-0 small text-muted">
//                   {total > 0 ? (
//                     <>
//                       Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
//                       <strong>{total}</strong> enrollments
//                       {totalPages > 1 && (
//                         <span className="ms-2">
//                           (Page <strong>{page}</strong> of <strong>{totalPages}</strong>)
//                         </span>
//                       )}
//                     </>
//                   ) : (
//                     'No enrollments found'
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Enrollments Table */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-header bg-light">
//               <h6 className="mb-0">
//                 <i className="fa fa-list me-2" />
//                 Current Enrollments
//               </h6>
//             </div>
//             <div className="card-body p-0">
//               {loading ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary" />
//                 </div>
//               ) : enrollments.length === 0 ? (
//                 <EmptyState
//                   icon="fa fa-graduation-cap"
//                   title="No enrollments found"
//                   description={hasActiveFilters ? 'Try adjusting your filters' : 'Enroll a student in a course to get started'}
//                   actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
//                   onAction={hasActiveFilters ? clearFilters : undefined}
//                 />
//               ) : (
//                 <>
//                   <div className="table-responsive">
//                     <table className="table table-hover align-middle mb-0">
//                       <thead className="table-light">
//                         <tr>
//                           <th className="border-0">Student</th>
//                           <th className="border-0">Course</th>
//                           <th className="text-center border-0 d-none d-md-table-cell">Progress</th>
//                           <th className="text-center border-0">Status</th>
//                           <th className="text-center border-0 d-none d-lg-table-cell">Enrolled</th>
//                           <th className="text-end border-0">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {enrollments.map(enrollment => {
//                           const student = enrollment.student || {};
//                           const course = enrollment.course || {};

//                           return (
//                             <tr key={enrollment.id}>
//                               <td>
//                                 <div className="d-flex align-items-center">
//                                   <StudentAvatar name={student.names || 'NA'} />
//                                   <div className="ms-2">
//                                     <div className="fw-bold text-truncate" style={{ maxWidth: '150px' }}>
//                                       {student.names || 'Unknown'}
//                                     </div>
//                                     <div className="text-muted small text-truncate d-none d-sm-block" style={{ maxWidth: '150px' }}>
//                                       {student.email || 'No email'}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td>
//                                 <div className="fw-bold text-primary text-truncate" style={{ maxWidth: '120px' }}>
//                                   {course.code || 'N/A'}
//                                 </div>
//                                 <div className="text-muted small text-truncate d-none d-sm-block" style={{ maxWidth: '150px' }}>
//                                   {course.title || 'Unknown Course'}
//                                 </div>
//                               </td>
//                               <td className="text-center d-none d-md-table-cell">
//                                 <div style={{ width: '80px', margin: '0 auto' }}>
//                                   <div className="progress" style={{ height: '8px' }}>
//                                     <div
//                                       className="progress-bar"
//                                       role="progressbar"
//                                       style={{ width: `${enrollment.progress || 0}%` }}
//                                       aria-valuenow={enrollment.progress || 0}
//                                       aria-valuemin={0}
//                                       aria-valuemax={100}
//                                     />
//                                   </div>
//                                   <small className="text-muted">{enrollment.progress || 0}%</small>
//                                 </div>
//                               </td>
//                               <td className="text-center">
//                                 <span className={`badge ${getStatusBadgeClass(enrollment.status || '')}`}>
//                                   {enrollment.status?.charAt(0).toUpperCase() + enrollment.status?.slice(1)}
//                                 </span>
//                               </td>
//                               <td className="text-center d-none d-lg-table-cell">
//                                 <small className="text-muted">
//                                   {formatDate(enrollment.enrolled_at)}
//                                 </small>
//                               </td>
//                               <td className="text-end">
//                                 <Button
//                                   variant="outline-danger"
//                                   size="sm"
//                                   icon="fa fa-user-minus"
//                                   onClick={() => {
//                                     setEnrollmentToRemove(enrollment);
//                                     setShowUnenrollModal(true);
//                                   }}
//                                 >
//                                   <span className="d-none d-sm-inline">Unenroll</span>
//                                 </Button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap gap-2">
//                       <Button
//                         variant="outline-secondary"
//                         size="sm"
//                         icon="fa fa-chevron-left"
//                         disabled={!hasPrevPage}
//                         onClick={() => setPage(p => p - 1)}
//                       >
//                         <span className="d-none d-sm-inline">Previous</span>
//                       </Button>

//                       <span className="small text-muted">
//                         Page <strong>{page}</strong> of <strong>{totalPages}</strong>
//                       </span>

//                       <Button
//                         variant="outline-secondary"
//                         size="sm"
//                         disabled={!hasNextPage}
//                         onClick={() => setPage(p => p + 1)}
//                       >
//                         <span className="d-none d-sm-inline">Next</span>
//                         <i className="fa fa-chevron-right ms-2" />
//                       </Button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Student Overview */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-header bg-light">
//               <h6 className="mb-0">
//                 <i className="fa fa-users me-2" />
//                 Student Enrollment Overview
//               </h6>
//             </div>
//             <div className="card-body">
//               <div className="row g-3">
//                 {students.map(student => {
//                   const studentEnrollments = getCoursesForStudent(student.id);
//                   return (
//                     <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={student.id}>
//                       <div className="border rounded p-3 h-100">
//                         <div className="d-flex align-items-center mb-2">
//                           <StudentAvatar name={student.names} size={36} bgColor="bg-primary" />
//                           <div className="ms-2 flex-grow-1 overflow-hidden">
//                             <div className="fw-bold text-truncate">{student.names}</div>
//                             <div className="text-muted small text-truncate">{student.email}</div>
//                           </div>
//                         </div>

//                         {studentEnrollments.length === 0 ? (
//                           <p className="text-muted small mb-0">No enrollments</p>
//                         ) : (
//                           <ul className="list-unstyled small mb-0">
//                             {studentEnrollments.map(e => {
//                               const course = e.course || {};
//                               return (
//                                 <li
//                                   key={e.id}
//                                   className="d-flex justify-content-between align-items-center mb-1"
//                                 >
//                                   <span className="text-truncate me-2">
//                                     {course.code || 'N/A'}
//                                   </span>
//                                   <span className={`badge ${getStatusBadgeClass(e.status || '')}`}>
//                                     {e.status}
//                                   </span>
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Unenroll Confirmation Modal */}
//       {showUnenrollModal && enrollmentToRemove && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
//           onClick={() => !unenrolling && setShowUnenrollModal(false)}
//         >
//           <div
//             className="modal-dialog modal-dialog-centered"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content">
//               <div className="modal-header border-0">
//                 <h5 className="modal-title">Confirm Unenroll</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowUnenrollModal(false)}
//                   disabled={unenrolling}
//                 />
//               </div>
//               <div className="modal-body">
//                 <p>Are you sure you want to unenroll this student?</p>
//                 <div className="alert alert-info mb-3">
//                   <div className="mb-2">
//                     <strong>Student:</strong>{' '}
//                     {enrollmentToRemove.student?.names || 'Unknown'}
//                   </div>
//                   <div className="mb-2">
//                     <strong>Course:</strong>{' '}
//                     {enrollmentToRemove.course?.code || 'N/A'} -{' '}
//                     {enrollmentToRemove.course?.title || 'Unknown'}
//                   </div>
//                   <div>
//                     <strong>Progress:</strong> {enrollmentToRemove.progress || 0}%
//                   </div>
//                 </div>
//                 <div className="alert alert-warning mb-0">
//                   <i className="fa fa-exclamation-triangle me-2" />
//                   The student will lose access to course materials and their progress data.
//                 </div>
//               </div>
//               <div className="modal-footer border-0">
//                 <Button
//                   variant="outline-secondary"
//                   onClick={() => setShowUnenrollModal(false)}
//                   disabled={unenrolling}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={handleUnenroll}
//                   loading={unenrolling}
//                   icon="fa fa-user-minus"
//                 >
//                   {unenrolling ? 'Unenrolling...' : 'Unenroll Student'}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageEnrollments;

// 



// RESPONSIVE v4
// v4 - Fully responsive and professional
import { useState, useEffect, useCallback } from 'react';
import CourseService from '@/services/courses/CourseService';
import { UserService } from '@/services/users/UserService';
import toast from 'react-hot-toast';
import type { User } from '@/types/auth';
import type { Course } from '@/types/course';
import type { Enrollment, EnrollmentFilters, EnrollmentStats } from '@/types/enrollment';
import { formatDate } from '@/utils/format';
import { getInitials } from '@/utils/helpers';
import { EnrollmentService } from '@/services/courses/Enrollment';

// ============================================================================
// REUSABLE COMPONENTS (DRY Principle)
// ============================================================================

interface StatCardProps {
  value: number | string;
  label: string;
  icon: string;
  bgColor: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, bgColor, loading }) => (
  <div className="col-6 col-md-3 mb-3">
    <div className={`card ${bgColor} text-white shadow-sm h-100`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex-grow-1">
            <h3 className="mb-1 fw-bold">
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status" />
              ) : (
                value
              )}
            </h3>
            <p className="mb-0 small opacity-75 text-truncate">{label}</p>
          </div>
          <i className={`${icon} fa-2x opacity-25 ms-2 flex-shrink-0`} />
        </div>
      </div>
    </div>
  </div>
);

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

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline-secondary' | 'outline-danger' | 'outline-primary' | 'light';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  children: React.ReactNode;
  className?: string;
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'sm',
  icon,
  children,
  className = '',
  block = false,
  type = 'button'
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const blockClass = block ? 'w-100' : '';
  
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${blockClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          {children}
        </>
      ) : (
        <>
          {icon && <i className={`${icon} me-2`} />}
          {children}
        </>
      )}
    </button>
  );
};

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

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  small?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  small = false
}) => (
  <div className={`text-center py-${small ? '4' : '5'}`}>
    <i className={`${icon} ${small ? 'fa-2x' : 'fa-3x'} text-muted mb-3`} />
    <h5 className={small ? 'h6' : ''}>{title}</h5>
    <p className={`text-muted ${small ? 'small' : ''} mb-3`}>{description}</p>
    {actionLabel && onAction && (
      <Button
        variant="outline-primary"
        size={small ? 'sm' : 'md'}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    )}
  </div>
);

interface StudentAvatarProps {
  name: string;
  size?: number;
  bgColor?: string;
  className?: string;
}

const StudentAvatar: React.FC<StudentAvatarProps> = ({
  name,
  size = 36,
  bgColor = 'bg-primary',
  className = ''
}) => (
  <div
    className={`rounded-circle ${bgColor} text-white d-flex align-items-center justify-content-center ${className}`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${Math.max(10, size * 0.35)}px`,
      fontWeight: 'bold',
      flexShrink: 0
    }}
    title={name}
  >
    {getInitials(name || 'NA')}
  </div>
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
  /*
  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { 
        page, 
        page_size: pageSize,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        course_id: filterCourse !== 'all' ? filterCourse : undefined,
        search: searchTerm || undefined
      };

      const response = await EnrollmentService.getAll(params);
      const enrollmentsData = response.data?.enrollments || [];
      const metaData = response.data?.page_meta || {};

      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      const totalCount = metaData.total ?? enrollmentsData.length;
      setTotal(totalCount);
      setTotalPages(Math.ceil(totalCount / pageSize));
    } catch (error: any) {
      console.error('Failed to fetch enrollments:', error);
      toast.error('Failed to load enrollments');
      setEnrollments([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterStatus, filterCourse, pageSize]);
  */
 
const fetchEnrollments = useCallback(async () => {
  try {
    setLoading(true);
    
    const params: EnrollmentFilters = { 
      page, 
      page_size: pageSize,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      course_id: filterCourse !== 'all' ? filterCourse : undefined,
      search: searchTerm || undefined,
      include_relations: true,  // ← Always include relations for list view
    };

    const response = await EnrollmentService.getAll(params);
    
    // Updated path to match backend response structure
    const enrollmentsData = response.data?.enrollments || [];
    const metaData = response.data?.page_meta || {};

    setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    
    const totalCount = metaData.total ?? enrollmentsData.length;
    setTotal(totalCount);
    setTotalPages(metaData.total_pages ?? Math.ceil(totalCount / pageSize));
    
  } catch (error: any) {
    console.error('Failed to fetch enrollments:', error);
    toast.error('Failed to load enrollments');
    setEnrollments([]);
    setTotal(0);
    setTotalPages(0);
  } finally {
    setLoading(false);
  }
}, [page, searchTerm, filterStatus, filterCourse, pageSize]);

  // Fetch initial data
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

      setStudents(studentsResponse.data?.users || []);
      setCourses(coursesResponse.data?.courses || []);
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
                      const student = enrollment.student || {};
                      const course = enrollment.course || {};

                      return (
                        <div key={enrollment.id} className="border-bottom p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center">
                              <StudentAvatar name={student.names || 'NA'} size={40} />
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
                            const student = enrollment.student || {};
                            const course = enrollment.course || {};

                            return (
                              <tr key={enrollment.id}>
                                <td className="ps-4">
                                  <div className="d-flex align-items-center">
                                    <StudentAvatar name={student.names || 'NA'} />
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
                              <StudentAvatar name={student.names} size={40} bgColor="bg-primary" />
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
                                          <div className="fw-semibold">{course.code || 'N/A'}</div>
                                          <div className="text-muted">{course.title?.slice(0, 20)}...</div>
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
                          <StudentAvatar 
                            name={enrollmentToRemove.student?.names || 'Unknown'} 
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