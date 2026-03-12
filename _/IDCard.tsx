// // src/pages/student/IDCard.tsx
// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { IDCardService } from '@/services/idcard/IDCardService';
// import toast from 'react-hot-toast';
// import html2canvas from 'html2canvas';
// import type { CourseEnrollment } from '@/types/idcard';

// const IDCard: React.FC = () => {
//   const { auth } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [courses, setCourses] = useState<CourseEnrollment[]>([]);
//   const [selectedCourseId, setSelectedCourseId] = useState('');
//   const [photoPreview, setPhotoPreview] = useState<string>('');
//   const [showPreview, setShowPreview] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const cardRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const data = await IDCardService.getStudentData(auth!.user.id);
//       // console.log('STUDENT DATA', data)
//       setCourses(data?.data?.courses);
//       setPhotoPreview(data.student.profile_picture || '');
//       if (data.courses.length > 0) {
//         setSelectedCourseId(data.courses[0].course.id);
//       }
//     } catch (error) {
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error('Photo must be less than 2MB');
//       return;
//     }

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please upload an image file');
//       return;
//     }

//     try {
//       const result = await IDCardService.uploadPhoto(auth!.user.id, file);
//       setPhotoPreview(result.photo_url);
//       toast.success('Photo uploaded successfully');
//     } catch (error) {
//       toast.error('Failed to upload photo');
//     }
//   };

//   const handleGeneratePreview = () => {
//     if (!selectedCourseId) {
//       toast.error('Please select a course');
//       return;
//     }
//     if (!photoPreview) {
//       toast.error('Please upload a photo');
//       return;
//     }
//     setShowPreview(true);
//   };

//   const handleDownload = async () => {
//     if (!cardRef.current) return;

//     try {
//       setGenerating(true);
//       const canvas = await html2canvas(cardRef.current, {
//         scale: 3,
//         backgroundColor: '#ffffff',
//       });

//       canvas.toBlob((blob) => {
//         if (!blob) return;
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `${auth?.user.names.replace(/\s+/g, '_')}_ID_Card.png`;
//         link.click();
//         URL.revokeObjectURL(url);
//         toast.success('ID Card downloaded!');
//       }, 'image/png');
//     } catch (error) {
//       toast.error('Failed to generate ID card');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (courses?.length === 0) {
//     return (
//       <div className="text-center py-5">
//         <i className="fa fa-id-card fa-3x text-muted mb-3" />
//         <h5>No Course Enrollments</h5>
//         <p className="text-muted">You need to be enrolled in a course to generate an ID card.</p>
//       </div>
//     );
//   }

//   const selectedCourse = courses?.find(c => c?.id === selectedCourseId);

//   return (
//     <div className="container-fluid py-4">
//       <div className="mb-4">
//         <h4 className="mb-1">Student ID Card</h4>
//         <p className="text-muted mb-0">Generate your official student identification card</p>
//       </div>

//       <div className="row g-4">
//         {/* Configuration */}
//         <div className="col-lg-5">
//           <div className="card">
//             <div className="card-header bg-primary text-white">
//               <h6 className="mb-0"><i className="fa fa-cog me-2" />Configuration</h6>
//             </div>
//             <div className="card-body">
              
//               {/* Student Info */}
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">Student Information</label>
//                 <div className="p-3 bg-light rounded">
//                   <div className="mb-2">
//                     <small className="text-muted">Name:</small>
//                     <div className="fw-semibold">{auth?.user.names}</div>
//                   </div>
//                   <div className="mb-2">
//                     <small className="text-muted">Email:</small>
//                     <div>{auth?.user.email}</div>
//                   </div>
//                   <div>
//                     <small className="text-muted">Student ID:</small>
//                     <div className="fw-semibold">{auth?.user.username || auth?.user.id.slice(0, 8).toUpperCase()}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Course Selection */}
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">
//                   Select Course <span className="text-danger">*</span>
//                 </label>
//                 <select 
//                   className="form-select"
//                   value={selectedCourseId}
//                   onChange={(e) => setSelectedCourseId(e.target.value)}
//                 >
//                   <option value="">Choose course...</option>
//                   {courses?.map(c => (
//                     <option key={c.id} value={c.id}>
//                       {c.code} - {c.title}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Photo Upload */}
//               <div className="mb-3">
//                 <label className="form-label fw-semibold">
//                   Profile Photo <span className="text-danger">*</span>
//                 </label>
                
//                 {photoPreview ? (
//                   <div className="text-center mb-3">
//                     <img 
//                       src={photoPreview} 
//                       alt="Preview" 
//                       className="img-thumbnail"
//                       style={{ width: '150px', height: '150px', objectFit: 'cover' }}
//                     />
//                     <div className="mt-2">
//                       <button 
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => setPhotoPreview('')}
//                       >
//                         <i className="fa fa-times me-1" />Remove
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div 
//                     className="border border-2 border-dashed rounded p-4 text-center"
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => document.getElementById('photoInput')?.click()}
//                   >
//                     <i className="fa fa-camera fa-3x text-muted mb-2" />
//                     <p className="mb-0 text-muted">Click to upload photo</p>
//                     <small className="text-muted">JPG, PNG • Max 2MB</small>
//                   </div>
//                 )}
                
//                 <input
//                   id="photoInput"
//                   type="file"
//                   className="d-none"
//                   accept="image/*"
//                   onChange={handlePhotoUpload}
//                 />
//               </div>

//               {/* Actions */}
//               <button 
//                 className="btn btn-primary w-100"
//                 onClick={handleGeneratePreview}
//                 disabled={!selectedCourseId || !photoPreview}
//               >
//                 <i className="fa fa-eye me-2" />Generate Preview
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Preview */}
//         <div className="col-lg-7">
//           {showPreview ? (
//             <div className="card">
//               <div className="card-header bg-white">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h6 className="mb-0"><i className="fa fa-id-card me-2" />Preview</h6>
//                   <button 
//                     className="btn btn-success btn-sm"
//                     onClick={handleDownload}
//                     disabled={generating}
//                   >
//                     {generating ? (
//                       <><span className="spinner-border spinner-border-sm me-2" />Generating...</>
//                     ) : (
//                       <><i className="fa fa-download me-2" />Download</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//               <div className="card-body d-flex justify-content-center p-4">
//                 <div ref={cardRef}>
//                   <IDCardDisplay
//                     studentName={auth!.user.names}
//                     studentId={auth!.user.username || auth!.user.id.slice(0, 8).toUpperCase()}
//                     email={auth!.user.email}
//                     phone={auth!.user.phone}
//                     courseName={selectedCourse?.course.title || ''}
//                     courseCode={selectedCourse?.course.code || ''}
//                     photo={photoPreview}
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="card">
//               <div className="card-body text-center p-5" style={{ minHeight: '500px' }}>
//                 <i className="fa fa-id-card fa-5x text-muted mb-3" />
//                 <h5>No Preview</h5>
//                 <p className="text-muted">Select a course and upload your photo to generate a preview</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ID Card Display Component (Standard Credit Card Size)
// interface IDCardDisplayProps {
//   studentName: string;
//   studentId: string;
//   email: string;
//   phone?: string;
//   courseName: string;
//   courseCode: string;
//   photo: string;
// }

// const IDCardDisplay: React.FC<IDCardDisplayProps> = ({
//   studentName,
//   studentId,
//   email,
//   phone,
//   courseName,
//   courseCode,
//   photo
// }) => {
//   const currentYear = new Date().getFullYear();
//   const validUntil = new Date(currentYear + 1, 11, 31).toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric' 
//   });

//   return (
//     <div 
//       style={{
//         width: '856px',
//         height: '540px',
//         backgroundColor: '#ffffff',
//         borderRadius: '16px',
//         overflow: 'hidden',
//         boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
//         fontFamily: 'Arial, sans-serif',
//         position: 'relative'
//       }}
//     >
//       {/* Header */}
//       <div 
//         style={{
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           padding: '24px 32px',
//           color: 'white'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <div 
//               style={{
//                 width: '60px',
//                 height: '60px',
//                 backgroundColor: 'white',
//                 borderRadius: '12px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontWeight: 'bold',
//                 color: '#667eea',
//                 fontSize: '24px'
//               }}
//             >
//               DA
//             </div>
//             <div>
//               <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
//                 Dunistech Academy
//               </div>
//               <div style={{ fontSize: '14px', opacity: 0.9 }}>
//                 Student Identification Card
//               </div>
//             </div>
//           </div>
//           <div 
//             style={{
//               backgroundColor: 'rgba(255,255,255,0.2)',
//               padding: '8px 16px',
//               borderRadius: '8px',
//               fontSize: '12px',
//               fontWeight: '600'
//             }}
//           >
//             {currentYear}/{currentYear + 1}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div style={{ padding: '32px', display: 'flex', gap: '32px' }}>
//         {/* Photo */}
//         <div style={{ flexShrink: 0 }}>
//           <div 
//             style={{
//               width: '180px',
//               height: '220px',
//               borderRadius: '12px',
//               overflow: 'hidden',
//               border: '4px solid #667eea',
//               backgroundColor: '#f3f4f6'
//             }}
//           >
//             {photo ? (
//               <img 
//                 src={photo} 
//                 alt="Student" 
//                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//               />
//             ) : (
//               <div 
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '48px',
//                   color: '#9ca3af'
//                 }}
//               >
//                 <i className="fa fa-user" />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Info */}
//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
//           <div>
//             <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
//               STUDENT NAME
//             </div>
//             <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', lineHeight: '1.2' }}>
//               {studentName}
//             </div>
//           </div>

//           <div>
//             <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
//               STUDENT ID
//             </div>
//             <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea', fontFamily: 'monospace', letterSpacing: '2px' }}>
//               {studentId}
//             </div>
//           </div>

//           <div>
//             <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
//               COURSE
//             </div>
//             <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
//               {courseCode}
//             </div>
//             <div style={{ fontSize: '14px', color: '#4b5563' }}>
//               {courseName}
//             </div>
//           </div>

//           <div style={{ display: 'flex', gap: '24px', fontSize: '12px' }}>
//             <div style={{ flex: 1 }}>
//               <div style={{ color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>EMAIL</div>
//               <div style={{ color: '#111827', wordBreak: 'break-all' }}>{email}</div>
//             </div>
//             {phone && (
//               <div style={{ flex: 1 }}>
//                 <div style={{ color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>PHONE</div>
//                 <div style={{ color: '#111827' }}>{phone}</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div 
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           padding: '16px 32px',
//           background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//           color: 'white',
//           display: 'flex',
//           justifyContent: 'space-between',
//           fontSize: '12px'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <i className="fa fa-calendar" />
//           <span>Valid Until: {validUntil}</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <i className="fa fa-shield-alt" />
//           <span>Official Student ID</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <i className="fa fa-globe" />
//           <span>www.dunistech.ng/academy</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IDCard;



// // v2
// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { IDCardService } from '@/services/idcard/IDCardService';
// import toast from 'react-hot-toast';
// import html2canvas from 'html2canvas';
// import type { CourseEnrollment, StudentIDData } from '@/types/idcard';

// const StudentIDCard = () => {
//   const { auth } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [student, setStudent] = useState<StudentIDData | null>(null);
//   const [courses, setCourses] = useState<CourseEnrollment[]>([]);
//   const [selectedCourseId, setSelectedCourseId] = useState('');
//   const [photoPreview, setPhotoPreview] = useState<string>('');
//   const [showPreview, setShowPreview] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const cardRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     if (!auth?.user?.id) return;

//     try {
//       setLoading(true);
//       const data = await IDCardService.getStudentData(auth.user.id);
//       console.log(data);
//       setStudent(data.student);
//       setCourses(data.courses || []);
//       setPhotoPreview(data?.student?.profile_picture || '');
      
//       if (data?.courses?.length > 0) {
//         setSelectedCourseId(data.courses[0].id);
//       }
//     } catch (error) {
//       console.error('Load error:', error);
//       toast.error('Failed to load student data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !auth?.user?.id) return;

//     // Validation
//     if (file.size > 2 * 1024 * 1024) {
//       toast.error('Photo must be less than 2MB');
//       return;
//     }

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please upload an image file');
//       return;
//     }

//     try {
//       const result = await IDCardService.uploadPhoto(auth.user.id, file);
//       setPhotoPreview(result.photo_url);
//       toast.success('Photo uploaded successfully');
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload photo');
//     }
//   };

//   const handleGeneratePreview = () => {
//     if (!selectedCourseId) {
//       toast.error('Please select a course');
//       return;
//     }
//     if (!photoPreview) {
//       toast.error('Please upload a photo');
//       return;
//     }
//     setShowPreview(true);
//   };

//   const handleDownload = async () => {
//     if (!cardRef.current) return;

//     try {
//       setGenerating(true);
      
//       const canvas = await html2canvas(cardRef.current, {
//         scale: 3,
//         backgroundColor: '#ffffff',
//         logging: false,
//         useCORS: true
//       });

//       canvas.toBlob((blob) => {
//         if (!blob) return;
        
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `${student?.names?.replace(/\s+/g, '_') || 'Student'}_ID_Card.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
        
//         toast.success('ID Card downloaded successfully!');
//       }, 'image/png');
//     } catch (error) {
//       console.error('Download error:', error);
//       toast.error('Failed to generate ID card');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (courses.length === 0) {
//     return (
//       <div className="container py-5 text-center">
//         <i className="fa fa-id-card fa-3x text-muted mb-3" />
//         <h5>No Course Enrollments</h5>
//         <p className="text-muted">You need to be enrolled in at least one course to generate an ID card.</p>
//       </div>
//     );
//   }

//   const selectedCourse = courses.find(c => c.id === selectedCourseId);

//   return (
//     <div className="container-fluid py-3 px-2 px-md-4">
      
//       {/* Header */}
//       <div className="mb-4">
//         <h3 className="mb-1">Generate Student ID Card</h3>
//         <p className="text-muted mb-0 small">Create your official student identification card</p>
//       </div>

//       <div className="row g-4">
        
//         {/* Configuration Panel */}
//         <div className="col-lg-5">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-primary text-white py-3">
//               <h6 className="mb-0">
//                 <i className="fa fa-cog me-2" />
//                 ID Card Configuration
//               </h6>
//             </div>
//             <div className="card-body">
              
//               {/* Student Info */}
//               <div className="mb-4">
//                 <label className="form-label fw-semibold">Student Information</label>
//                 <div className="p-3 bg-light rounded">
//                   <div className="mb-2">
//                     <small className="text-muted">Name:</small>
//                     <div className="fw-semibold">{student?.names || auth?.user?.names || 'N/A'}</div>
//                   </div>
//                   <div className="mb-2">
//                     <small className="text-muted">Email:</small>
//                     <div>{student?.email || auth?.user?.email || 'N/A'}</div>
//                   </div>
//                   <div>
//                     <small className="text-muted">Student ID:</small>
//                     <div className="fw-semibold">
//                       {student?.student_id || auth?.user?.username || auth?.user?.id?.slice(0, 8).toUpperCase() || 'N/A'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Course Selection */}
//               <div className="mb-4">
//                 <label className="form-label fw-semibold">
//                   Select Course
//                   <span className="text-danger">*</span>
//                 </label>
//                 <select 
//                   className="form-select"
//                   value={selectedCourseId}
//                   onChange={(e) => setSelectedCourseId(e.target.value)}
//                 >
//                   <option value="">Choose course...</option>
//                   {courses.map(course => (
//                     <option key={course.id} value={course.id}>
//                       {course.code} - {course.title}
//                     </option>
//                   ))}
//                 </select>
//                 <small className="text-muted">
//                   Select the course for which you want to generate the ID card
//                 </small>
//               </div>

//               {/* Photo Upload */}
//               <div className="mb-4">
//                 <label className="form-label fw-semibold">
//                   Profile Photo
//                   <span className="text-danger">*</span>
//                 </label>
                
//                 {photoPreview ? (
//                   <div className="text-center mb-3">
//                     <img 
//                       src={photoPreview} 
//                       alt="Preview" 
//                       className="img-thumbnail"
//                       style={{ 
//                         width: '150px', 
//                         height: '150px', 
//                         objectFit: 'cover',
//                         borderRadius: '8px'
//                       }}
//                     />
//                     <div className="mt-2">
//                       <button 
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => setPhotoPreview('')}
//                       >
//                         <i className="fa fa-times me-1" />
//                         Remove Photo
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div 
//                     className="border border-2 border-dashed rounded p-4 text-center"
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => document.getElementById('photoInput')?.click()}
//                   >
//                     <i className="fa fa-camera fa-3x text-muted mb-2" />
//                     <p className="mb-0 text-muted">Click to upload photo</p>
//                     <small className="text-muted">JPG, PNG • Max 2MB</small>
//                   </div>
//                 )}
                
//                 <input
//                   id="photoInput"
//                   type="file"
//                   className="d-none"
//                   accept="image/*"
//                   onChange={handlePhotoUpload}
//                 />
                
//                 {!photoPreview && (
//                   <button 
//                     className="btn btn-outline-primary w-100 mt-2"
//                     onClick={() => document.getElementById('photoInput')?.click()}
//                   >
//                     <i className="fa fa-upload me-2" />
//                     Upload Photo
//                   </button>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="d-grid gap-2">
//                 <button 
//                   className="btn btn-primary"
//                   onClick={handleGeneratePreview}
//                   disabled={!selectedCourseId || !photoPreview}
//                 >
//                   <i className="fa fa-eye me-2" />
//                   Generate Preview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Preview Panel */}
//         <div className="col-lg-7">
//           {showPreview ? (
//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-white py-3">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h6 className="mb-0">
//                     <i className="fa fa-id-card me-2" />
//                     ID Card Preview
//                   </h6>
//                   <button 
//                     className="btn btn-success btn-sm"
//                     onClick={handleDownload}
//                     disabled={generating}
//                   >
//                     {generating ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" />
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fa fa-download me-2" />
//                         Download ID Card
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//               <div className="card-body d-flex justify-content-center align-items-center p-4" style={{ minHeight: '500px' }}>
                
//                 {/* ID Card Component */}
//                 <div ref={cardRef}>
//                   <IDCardDisplay
//                     studentName={student?.names || auth?.user?.names || ''}
//                     studentId={student?.student_id || auth?.user?.username || auth?.user?.id?.slice(0, 8).toUpperCase() || ''}
//                     email={student?.email || auth?.user?.email || ''}
//                     phone={student?.phone || auth?.user?.phone}
//                     courseName={selectedCourse?.title || ''}
//                     courseCode={selectedCourse?.code || ''}
//                     photo={photoPreview}
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="card border-0 shadow-sm">
//               <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5" style={{ minHeight: '500px' }}>
//                 <i className="fa fa-id-card fa-5x text-muted mb-4" />
//                 <h5 className="mb-2">No Preview Available</h5>
//                 <p className="text-muted mb-0">
//                   Select a course and upload your photo to generate a preview
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


// // ============================================================================
// // ID CARD DISPLAY COMPONENT
// // ============================================================================

// interface IDCardDisplayProps {
//   studentName: string;
//   studentId: string;
//   email: string;
//   phone?: string;
//   courseName: string;
//   courseCode: string;
//   photo: string;
// }

// const IDCardDisplay: React.FC<IDCardDisplayProps> = ({
//   studentName,
//   studentId,
//   email,
//   phone,
//   courseName,
//   courseCode,
//   photo
// }) => {
//   const currentYear = new Date().getFullYear();
//   const validUntil = new Date(currentYear + 1, 11, 31).toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric' 
//   });

//   return (
//     <div 
//       style={{
//         width: '856px',
//         height: '540px',
//         backgroundColor: '#ffffff',
//         borderRadius: '16px',
//         overflow: 'hidden',
//         boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
//         fontFamily: 'Arial, sans-serif',
//         position: 'relative'
//       }}
//     >
//       {/* Header */}
//       <div 
//         style={{
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           padding: '24px 32px',
//           color: 'white'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <div 
//               style={{
//                 width: '60px',
//                 height: '60px',
//                 backgroundColor: 'white',
//                 borderRadius: '12px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontWeight: 'bold',
//                 color: '#667eea',
//                 fontSize: '24px'
//               }}
//             >
//               DA
//             </div>
//             <div>
//               <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
//                 Dunistech Academy
//               </div>
//               <div style={{ fontSize: '14px', opacity: 0.9 }}>
//                 Student Identification Card
//               </div>
//             </div>
//           </div>
//           <div 
//             style={{
//               backgroundColor: 'rgba(255,255,255,0.2)',
//               padding: '8px 16px',
//               borderRadius: '8px',
//               fontSize: '12px',
//               fontWeight: '600'
//             }}
//           >
//             {currentYear}/{currentYear + 1}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div style={{ padding: '32px', display: 'flex', gap: '32px' }}>
//         {/* Photo */}
//         <div style={{ flexShrink: 0 }}>
//           <div 
//             style={{
//               width: '180px',
//               height: '220px',
//               borderRadius: '12px',
//               overflow: 'hidden',
//               border: '4px solid #667eea',
//               backgroundColor: '#f3f4f6'
//             }}
//           >
//             {photo ? (
//               <img 
//                 src={photo} 
//                 alt="Student" 
//                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//               />
//             ) : (
//               <div 
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '48px',
//                   color: '#9ca3af'
//                 }}
//               >
//                 👤
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Info */}
//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
//           <div>
//             <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
//               STUDENT NAME
//             </div>
//             <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', lineHeight: '1.2' }}>
//               {studentName}
//             </div>
//           </div>

//           <div>
//             <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
//               STUDENT ID
//             </div>
//             <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea', fontFamily: 'monospace', letterSpacing: '2px' }}>
//               {studentId}
//             </div>
//           </div>

//           <div>
//             <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
//               COURSE
//             </div>
//             <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
//               {courseCode}
//             </div>
//             <div style={{ fontSize: '14px', color: '#4b5563' }}>
//               {courseName}
//             </div>
//           </div>

//           <div style={{ display: 'flex', gap: '24px', fontSize: '12px' }}>
//             <div style={{ flex: 1 }}>
//               <div style={{ color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>EMAIL</div>
//               <div style={{ color: '#111827', wordBreak: 'break-all' }}>{email}</div>
//             </div>
//             {phone && (
//               <div style={{ flex: 1 }}>
//                 <div style={{ color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>PHONE</div>
//                 <div style={{ color: '#111827' }}>{phone}</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div 
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           padding: '16px 32px',
//           background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//           color: 'white',
//           display: 'flex',
//           justifyContent: 'space-between',
//           fontSize: '12px'
//         }}
//       >
//         <div>📅 Valid Until: {validUntil}</div>
//         <div>🛡️ Official Student ID</div>
//         <div>🌐 www.dunistech.ng/academy</div>
//       </div>
//     </div>
//   );
// };

// export default StudentIDCard;




// // v3
// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { IDCardService } from '@/services/idcard/IDCardService';
// import toast from 'react-hot-toast';
// import html2canvas from 'html2canvas';
// import type { CourseEnrollment, StudentIDData } from '@/types/idcard';

// const StudentIDCard = () => {
//   const { auth } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [student, setStudent] = useState<StudentIDData | null>(null);
//   const [courses, setCourses] = useState<CourseEnrollment[]>([]);
//   const [selectedCourseId, setSelectedCourseId] = useState('');
//   const [photoPreview, setPhotoPreview] = useState<string>('');
//   const [showPreview, setShowPreview] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const cardRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     if (!auth?.user?.id) return;

//     try {
//       setLoading(true);
//       const data = await IDCardService.getStudentData(auth.user.id);
      
//       setStudent(data.student);
//       setCourses(data.courses || []);
//       setPhotoPreview(data.student.profile_picture || '');
      
//       if (data.courses.length > 0) {
//         setSelectedCourseId(data.courses[0].id);
//       }
//     } catch (error) {
//       console.error('Load error:', error);
//       toast.error('Failed to load student data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !auth?.user?.id) return;

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error('Photo must be less than 2MB');
//       return;
//     }

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please upload an image file');
//       return;
//     }

//     try {
//       const result = await IDCardService.uploadPhoto(auth.user.id, file);
//       setPhotoPreview(result.photo_url);
//       toast.success('Photo uploaded successfully');
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload photo');
//     }
//   };

//   const handleGeneratePreview = () => {
//     if (!selectedCourseId) {
//       toast.error('Please select a course');
//       return;
//     }
//     if (!photoPreview) {
//       toast.error('Please upload a photo');
//       return;
//     }
//     setShowPreview(true);
//   };

//   const handleDownload = async () => {
//     if (!cardRef.current) return;

//     try {
//       setGenerating(true);
      
//       const canvas = await html2canvas(cardRef.current, {
//         scale: 3,
//         backgroundColor: '#ffffff',
//         logging: false,
//         useCORS: true
//       });

//       canvas.toBlob((blob) => {
//         if (!blob) return;
        
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `${student?.names?.replace(/\s+/g, '_') || 'Student'}_ID_Card.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
        
//         toast.success('ID Card downloaded successfully!');
//       }, 'image/png');
//     } catch (error) {
//       console.error('Download error:', error);
//       toast.error('Failed to generate ID card');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (courses.length === 0) {
//     return (
//       <div className="container py-5 text-center">
//         <i className="fa fa-id-card fa-3x text-muted mb-3" />
//         <h5>No Course Enrollments</h5>
//         <p className="text-muted">You need to be enrolled in at least one course to generate an ID card.</p>
//       </div>
//     );
//   }

//   const selectedCourse = courses.find(c => c.id === selectedCourseId);

//   return (
//     <div className="container-fluid py-3 px-2 px-md-4">
      
//       <div className="mb-4">
//         <h3 className="mb-1">Generate Student ID Card</h3>
//         <p className="text-muted mb-0 small">Create your official student identification card</p>
//       </div>

//       <div className="row g-4">
        
//         <div className="col-lg-5">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-primary text-white py-3">
//               <h6 className="mb-0">
//                 <i className="fa fa-cog me-2" />
//                 ID Card Configuration
//               </h6>
//             </div>
//             <div className="card-body">
              
//               <div className="mb-4">
//                 <label className="form-label fw-semibold">Student Information</label>
//                 <div className="p-3 bg-light rounded">
//                   <div className="mb-2">
//                     <small className="text-muted">Name:</small>
//                     <div className="fw-semibold">{student?.names || auth?.user?.names || 'N/A'}</div>
//                   </div>
//                   <div className="mb-2">
//                     <small className="text-muted">Email:</small>
//                     <div>{student?.email || auth?.user?.email || 'N/A'}</div>
//                   </div>
//                   <div>
//                     <small className="text-muted">Student ID:</small>
//                     <div className="fw-semibold">
//                       {student?.student_id || auth?.user?.username || auth?.user?.id?.slice(0, 8).toUpperCase() || 'N/A'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label fw-semibold">
//                   Select Course <span className="text-danger">*</span>
//                 </label>
//                 <select 
//                   className="form-select"
//                   value={selectedCourseId}
//                   onChange={(e) => setSelectedCourseId(e.target.value)}
//                 >
//                   <option value="">Choose course...</option>
//                   {courses.map(course => (
//                     <option key={course.id} value={course.id}>
//                       {course.code} - {course.title}
//                     </option>
//                   ))}
//                 </select>
//                 <small className="text-muted">
//                   Select the course for which you want to generate the ID card
//                 </small>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label fw-semibold">
//                   Profile Photo <span className="text-danger">*</span>
//                 </label>
                
//                 {photoPreview ? (
//                   <div className="text-center mb-3">
//                     <img 
//                       src={photoPreview} 
//                       alt="Preview" 
//                       className="img-thumbnail"
//                       style={{ 
//                         width: '150px', 
//                         height: '150px', 
//                         objectFit: 'cover',
//                         borderRadius: '8px'
//                       }}
//                     />
//                     <div className="mt-2">
//                       <button 
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => setPhotoPreview('')}
//                       >
//                         <i className="fa fa-times me-1" />
//                         Remove Photo
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div 
//                     className="border border-2 border-dashed rounded p-4 text-center"
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => document.getElementById('photoInput')?.click()}
//                   >
//                     <i className="fa fa-camera fa-3x text-muted mb-2" />
//                     <p className="mb-0 text-muted">Click to upload photo</p>
//                     <small className="text-muted">JPG, PNG • Max 2MB</small>
//                   </div>
//                 )}
                
//                 <input
//                   id="photoInput"
//                   type="file"
//                   className="d-none"
//                   accept="image/*"
//                   onChange={handlePhotoUpload}
//                 />
                
//                 {!photoPreview && (
//                   <button 
//                     className="btn btn-outline-primary w-100 mt-2"
//                     onClick={() => document.getElementById('photoInput')?.click()}
//                   >
//                     <i className="fa fa-upload me-2" />
//                     Upload Photo
//                   </button>
//                 )}
//               </div>

//               <div className="d-grid gap-2">
//                 <button 
//                   className="btn btn-primary"
//                   onClick={handleGeneratePreview}
//                   disabled={!selectedCourseId || !photoPreview}
//                 >
//                   <i className="fa fa-eye me-2" />
//                   Generate Preview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-7">
//           {showPreview ? (
//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-white py-3">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h6 className="mb-0">
//                     <i className="fa fa-id-card me-2" />
//                     ID Card Preview
//                   </h6>
//                   <button 
//                     className="btn btn-success btn-sm"
//                     onClick={handleDownload}
//                     disabled={generating}
//                   >
//                     {generating ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" />
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fa fa-download me-2" />
//                         Download ID Card
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//               <div className="card-body d-flex justify-content-center align-items-center p-4" style={{ minHeight: '500px' }}>
//                 <div ref={cardRef}>
//                   <IDCardDisplay
//                     studentName={student?.names || auth?.user?.names || ''}
//                     studentId={student?.student_id || auth?.user?.username || auth?.user?.id?.slice(0, 8).toUpperCase() || ''}
//                     email={student?.email || auth?.user?.email || ''}
//                     phone={student?.phone || auth?.user?.phone}
//                     courseName={selectedCourse?.title || ''}
//                     courseCode={selectedCourse?.code || ''}
//                     photo={photoPreview}
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="card border-0 shadow-sm">
//               <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5" style={{ minHeight: '500px' }}>
//                 <i className="fa fa-id-card fa-5x text-muted mb-4" />
//                 <h5 className="mb-2">No Preview Available</h5>
//                 <p className="text-muted mb-0">
//                   Select a course and upload your photo to generate a preview
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // ID CARD DISPLAY - DUNISTECH ACADEMY OFFICIAL BRANDING
// // Colors: Royal Blue (#1e3a8a), Thick Green (#15803d), White (#ffffff)
// // ============================================================================

// interface IDCardDisplayProps {
//   studentName: string;
//   studentId: string;
//   email: string;
//   phone?: string;
//   courseName: string;
//   courseCode: string;
//   photo: string;
// }

// const IDCardDisplay: React.FC<IDCardDisplayProps> = ({
//   studentName,
//   studentId,
//   email,
//   phone,
//   courseName,
//   courseCode,
//   photo
// }) => {
//   const currentYear = new Date().getFullYear();
//   const validUntil = new Date(currentYear + 1, 11, 31).toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric' 
//   });

//   return (
//     <div 
//       style={{
//         width: '856px',
//         height: '540px',
//         backgroundColor: '#ffffff',
//         borderRadius: '16px',
//         overflow: 'hidden',
//         boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
//         fontFamily: 'Arial, sans-serif',
//         position: 'relative',
//         border: '3px solid #15803d'
//       }}
//     >
//       {/* Header - Royal Blue & Green */}
//       <div 
//         style={{
//           background: 'linear-gradient(135deg, #1e3a8a 0%, #15803d 100%)',
//           padding: '20px 32px',
//           color: 'white',
//           position: 'relative'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             {/* Academy Logo */}
//             <div 
//               style={{
//                 width: '70px',
//                 height: '70px',
//                 backgroundColor: 'white',
//                 borderRadius: '12px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: '8px',
//                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//               }}
//             >
//               <img 
//                 src="/assets/images/app-logo/dunis_academ.png" 
//                 alt="Dunistech Academy" 
//                 style={{ 
//                   width: '100%', 
//                   height: '100%', 
//                   objectFit: 'contain' 
//                 }}
//               />
//             </div>
//             <div>
//               <div style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '2px', letterSpacing: '0.5px' }}>
//                 DUNISTECH ACADEMY
//               </div>
//               <div style={{ fontSize: '13px', opacity: 0.95, fontWeight: '500' }}>
//                 Student Identification Card
//               </div>
//             </div>
//           </div>
//           <div 
//             style={{
//               backgroundColor: '#15803d',
//               padding: '10px 18px',
//               borderRadius: '8px',
//               fontSize: '13px',
//               fontWeight: 'bold',
//               border: '2px solid white'
//             }}
//           >
//             {currentYear}/{currentYear + 1}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={{ padding: '32px', display: 'flex', gap: '32px' }}>
        
//         {/* Photo Section */}
//         <div style={{ flexShrink: 0 }}>
//           <div 
//             style={{
//               width: '180px',
//               height: '220px',
//               borderRadius: '12px',
//               overflow: 'hidden',
//               border: '4px solid #1e3a8a',
//               backgroundColor: '#f3f4f6',
//               boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
//             }}
//           >
//             {photo ? (
//               <img 
//                 src={photo} 
//                 alt="Student" 
//                 style={{ 
//                   width: '100%', 
//                   height: '100%', 
//                   objectFit: 'cover' 
//                 }}
//               />
//             ) : (
//               <div 
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '64px',
//                   color: '#9ca3af',
//                   backgroundColor: '#e5e7eb'
//                 }}
//               >
//                 👤
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Information Section */}
//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
//           {/* Student Name */}
//           <div>
//             <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
//               STUDENT NAME
//             </div>
//             <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e3a8a', lineHeight: '1.2' }}>
//               {studentName}
//             </div>
//           </div>

//           {/* Student ID */}
//           <div>
//             <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
//               STUDENT ID
//             </div>
//             <div 
//               style={{ 
//                 fontSize: '20px', 
//                 fontWeight: 'bold', 
//                 color: '#15803d',
//                 fontFamily: 'monospace',
//                 letterSpacing: '3px',
//                 backgroundColor: '#f0fdf4',
//                 padding: '8px 12px',
//                 borderRadius: '6px',
//                 display: 'inline-block'
//               }}
//             >
//               {studentId}
//             </div>
//           </div>

//           {/* Course */}
//           <div>
//             <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
//               ENROLLED COURSE
//             </div>
//             <div style={{ fontSize: '16px', fontWeight: '700', color: '#15803d' }}>
//               {courseCode}
//             </div>
//             <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
//               {courseName}
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div style={{ display: 'flex', gap: '20px', fontSize: '11px', marginTop: '4px' }}>
//             <div style={{ flex: 1 }}>
//               <div style={{ color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>EMAIL</div>
//               <div style={{ color: '#374151', fontSize: '12px', wordBreak: 'break-all' }}>{email}</div>
//             </div>
//             {phone && (
//               <div style={{ flex: 1 }}>
//                 <div style={{ color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>PHONE</div>
//                 <div style={{ color: '#374151', fontSize: '12px' }}>{phone}</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer - Green & Royal Blue */}
//       <div 
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           padding: '14px 32px',
//           background: 'linear-gradient(90deg, #15803d 0%, #1e3a8a 100%)',
//           color: 'white',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           fontSize: '11px',
//           fontWeight: '600'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           {/* <span style={{ fontSize: '16px' }}>📅</span> */}
//           {/* <span style={{ fontSize: '16px' }}>Validity:</span> */}
//           <span>Valid Until: {validUntil}</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           {/* <span style={{ fontSize: '16px' }}>🛡️</span> */}
//           {/* <span style={{ fontSize: '16px' }}>Identiity</span> */}
//           <span className='disabled'>Official Student ID</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           {/* <span style={{ fontSize: '16px' }}>🌐</span> */}
//           {/* <span style={{ fontSize: '16px' }}>Site:</span> */}
//           <span>www.dunistech.ng/academy</span>
//         </div>
//       </div>

//       {/* Decorative Corner Accent - Green */}
//       <div 
//         style={{
//           position: 'absolute',
//           top: '90px',
//           right: '-30px',
//           width: '150px',
//           height: '150px',
//           borderRadius: '50%',
//           background: 'radial-gradient(circle, rgba(21, 128, 61, 0.1) 0%, rgba(21, 128, 61, 0) 70%)',
//           filter: 'blur(20px)'
//         }}
//       />
//     </div>
//   );
// };

// export default StudentIDCard;







// // v4
// // v3 - Updated with horizontal scrollable preview
// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { IDCardService } from '@/services/idcard/IDCardService';
// import toast from 'react-hot-toast';
// import html2canvas from 'html2canvas';
// import type { CourseEnrollment, StudentIDData } from '@/types/idcard';

// const StudentIDCard = () => {
//   const { auth } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [student, setStudent] = useState<StudentIDData | null>(null);
//   const [courses, setCourses] = useState<CourseEnrollment[]>([]);
//   const [selectedCourseId, setSelectedCourseId] = useState('');
//   const [photoPreview, setPhotoPreview] = useState<string>('');
//   const [showPreview, setShowPreview] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const cardRef = useRef<HTMLDivElement>(null);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     if (!auth?.user?.id) return;

//     try {
//       setLoading(true);
//       const data = await IDCardService.getStudentData(auth.user.id);
      
//       setStudent(data.student);
//       setCourses(data.courses || []);
//       setPhotoPreview(data.student.profile_picture || '');
      
//       if (data.courses.length > 0) {
//         setSelectedCourseId(data.courses[0].id);
//       }
//     } catch (error) {
//       console.error('Load error:', error);
//       toast.error('Failed to load student data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !auth?.user?.id) return;

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error('Photo must be less than 2MB');
//       return;
//     }

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please upload an image file');
//       return;
//     }

//     try {
//       const result = await IDCardService.uploadPhoto(auth.user.id, file);
//       setPhotoPreview(result.photo_url);
//       toast.success('Photo uploaded successfully');
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload photo');
//     }
//   };

//   const handleGeneratePreview = () => {
//     if (!selectedCourseId) {
//       toast.error('Please select a course');
//       return;
//     }
//     if (!photoPreview) {
//       toast.error('Please upload a photo');
//       return;
//     }
//     setShowPreview(true);
    
//     // Scroll to preview on mobile after generation
//     setTimeout(() => {
//       if (window.innerWidth < 992 && scrollContainerRef.current) {
//         scrollContainerRef.current.scrollIntoView({ 
//           behavior: 'smooth', 
//           block: 'nearest',
//           inline: 'start'
//         });
//       }
//     }, 100);
//   };

//   const handleDownload = async () => {
//     if (!cardRef.current) return;

//     try {
//       setGenerating(true);
      
//       const canvas = await html2canvas(cardRef.current, {
//         scale: 3,
//         backgroundColor: '#ffffff',
//         logging: false,
//         useCORS: true
//       });

//       canvas.toBlob((blob) => {
//         if (!blob) return;
        
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `${student?.names?.replace(/\s+/g, '_') || 'Student'}_ID_Card.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
        
//         toast.success('ID Card downloaded successfully!');
//       }, 'image/png');
//     } catch (error) {
//       console.error('Download error:', error);
//       toast.error('Failed to generate ID card');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (courses.length === 0) {
//     return (
//       <div className="container py-5 text-center">
//         <i className="fa fa-id-card fa-3x text-muted mb-3" />
//         <h5>No Course Enrollments</h5>
//         <p className="text-muted">You need to be enrolled in at least one course to generate an ID card.</p>
//       </div>
//     );
//   }

//   const selectedCourse = courses.find(c => c.id === selectedCourseId);

//   return (
//     <div className="container-fluid py-3 px-2 px-md-4">
      
//       <div className="mb-4">
//         <h3 className="mb-1">Generate Student ID Card</h3>
//         <p className="text-muted mb-0 small">Create your official student identification card</p>
//       </div>

//       <div className="row g-4">
        
//         <div className="col-lg-5">
//           <div className="card border-0 shadow-sm">
//             <div className="card-header bg-primary text-white py-3">
//               <h6 className="mb-0">
//                 <i className="fa fa-cog me-2" />
//                 ID Card Configuration
//               </h6>
//             </div>
//             <div className="card-body">
              
//               <div className="mb-4">
//                 <label className="form-label fw-semibold">Student Information</label>
//                 <div className="p-3 bg-light rounded">
//                   <div className="mb-2">
//                     <small className="text-muted">Name:</small>
//                     <div className="fw-semibold">{student?.names || auth?.user?.names || 'N/A'}</div>
//                   </div>
//                   <div className="mb-2">
//                     <small className="text-muted">Email:</small>
//                     <div>{student?.email || auth?.user?.email || 'N/A'}</div>
//                   </div>
//                   <div>
//                     <small className="text-muted">Student ID:</small>
//                     <div className="fw-semibold">
//                       {student?.student_id || auth?.user?.username || auth?.user?.id?.slice(0, 8).toUpperCase() || 'N/A'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label fw-semibold">
//                   Select Course <span className="text-danger">*</span>
//                 </label>
//                 <select 
//                   className="form-select"
//                   value={selectedCourseId}
//                   onChange={(e) => setSelectedCourseId(e.target.value)}
//                 >
//                   <option value="">Choose course...</option>
//                   {courses.map(course => (
//                     <option key={course.id} value={course.id}>
//                       {course.code} - {course.title}
//                     </option>
//                   ))}
//                 </select>
//                 <small className="text-muted">
//                   Select the course for which you want to generate the ID card
//                 </small>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label fw-semibold">
//                   Profile Photo <span className="text-danger">*</span>
//                 </label>
                
//                 {photoPreview ? (
//                   <div className="text-center mb-3">
//                     <img 
//                       src={photoPreview} 
//                       alt="Preview" 
//                       className="img-thumbnail"
//                       style={{ 
//                         width: '150px', 
//                         height: '150px', 
//                         objectFit: 'cover',
//                         borderRadius: '8px'
//                       }}
//                     />
//                     <div className="mt-2">
//                       <button 
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => setPhotoPreview('')}
//                       >
//                         <i className="fa fa-times me-1" />
//                         Remove Photo
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div 
//                     className="border border-2 border-dashed rounded p-4 text-center"
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => document.getElementById('photoInput')?.click()}
//                   >
//                     <i className="fa fa-camera fa-3x text-muted mb-2" />
//                     <p className="mb-0 text-muted">Click to upload photo</p>
//                     <small className="text-muted">JPG, PNG • Max 2MB</small>
//                   </div>
//                 )}
                
//                 <input
//                   id="photoInput"
//                   type="file"
//                   className="d-none"
//                   accept="image/*"
//                   onChange={handlePhotoUpload}
//                 />
                
//                 {!photoPreview && (
//                   <button 
//                     className="btn btn-outline-primary w-100 mt-2"
//                     onClick={() => document.getElementById('photoInput')?.click()}
//                   >
//                     <i className="fa fa-upload me-2" />
//                     Upload Photo
//                   </button>
//                 )}
//               </div>

//               <div className="d-grid gap-2">
//                 <button 
//                   className="btn btn-primary"
//                   onClick={handleGeneratePreview}
//                   disabled={!selectedCourseId || !photoPreview}
//                 >
//                   <i className="fa fa-eye me-2" />
//                   Generate Preview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-7" ref={scrollContainerRef}>
//           {showPreview ? (
//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-white py-3">
//                 <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
//                   <h6 className="mb-0">
//                     <i className="fa fa-id-card me-2" />
//                     ID Card Preview
//                   </h6>
//                   <button 
//                     className="btn btn-success btn-sm w-100 w-sm-auto"
//                     onClick={handleDownload}
//                     disabled={generating}
//                   >
//                     {generating ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" />
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fa fa-download me-2" />
//                         Download ID Card
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 {/* Mobile scroll hint */}
//                 <div className="d-block d-lg-none text-muted mt-2 small">
//                   <i className="fa fa-arrow-left me-1" />
//                   Scroll horizontally to view full card
//                   <i className="fa fa-arrow-right ms-1" />
//                 </div>
//               </div>
//               <div className="card-body p-4">
//                 {/* Scrollable container for mobile */}
//                 <div 
//                   style={{
//                     overflowX: 'auto',
//                     overflowY: 'hidden',
//                     WebkitOverflowScrolling: 'touch',
//                     paddingBottom: '16px',
//                     marginBottom: '-8px',
//                     cursor: 'grab'
//                   }}
//                   className="scrollable-card-container"
//                   ref={(el) => {
//                     if (el) {
//                       el.addEventListener('wheel', (e) => {
//                         if (el.scrollWidth > el.clientWidth) {
//                           e.preventDefault();
//                           el.scrollLeft += e.deltaY;
//                         }
//                       });
//                     }
//                   }}
//                 >
//                   <div 
//                     style={{
//                       display: 'inline-block',
//                       minWidth: '100%',
//                     }}
//                   >
//                     <div 
//                       ref={cardRef}
//                       style={{
//                         transform: 'scale(0.9)',
//                         transformOrigin: 'top left',
//                         margin: '0 auto'
//                       }}
//                       className="id-card-wrapper"
//                     >
//                       <IDCardDisplay
//                         studentName={student?.names || auth?.user?.names || ''}
//                         studentId={student?.student_id || auth?.user?.username || auth?.user?.id?.slice(0, 8).toUpperCase() || ''}
//                         email={student?.email || auth?.user?.email || ''}
//                         phone={student?.phone || auth?.user?.phone}
//                         courseName={selectedCourse?.title || ''}
//                         courseCode={selectedCourse?.code || ''}
//                         photo={photoPreview}
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Scroll position indicator */}
//                 <div className="d-flex justify-content-center mt-3 d-lg-none">
//                   <div className="d-flex gap-1">
//                     <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px', opacity: 0.3 }}></div>
//                     <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px', opacity: 0.6 }}></div>
//                     <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px', opacity: 1 }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="card border-0 shadow-sm">
//               <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5" style={{ minHeight: '500px' }}>
//                 <i className="fa fa-id-card fa-5x text-muted mb-4" />
//                 <h5 className="mb-2">No Preview Available</h5>
//                 <p className="text-muted mb-0">
//                   Select a course and upload your photo to generate a preview
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add custom styles */}
//       <style jsx>{`
//         .scrollable-card-container {
//           -ms-overflow-style: none;
//           scrollbar-width: thin;
//           scrollbar-color: #1e3a8a #e5e7eb;
//         }
        
//         .scrollable-card-container::-webkit-scrollbar {
//           height: 8px;
//         }
        
//         .scrollable-card-container::-webkit-scrollbar-track {
//           background: #e5e7eb;
//           border-radius: 4px;
//         }
        
//         .scrollable-card-container::-webkit-scrollbar-thumb {
//           background: #1e3a8a;
//           border-radius: 4px;
//         }
        
//         .scrollable-card-container::-webkit-scrollbar-thumb:hover {
//           background: #15803d;
//         }
        
//         @media (max-width: 576px) {
//           .id-card-wrapper {
//             transform: scale(0.7);
//           }
//         }
        
//         @media (min-width: 577px) and (max-width: 768px) {
//           .id-card-wrapper {
//             transform: scale(0.8);
//           }
//         }
        
//         @media (min-width: 769px) and (max-width: 991px) {
//           .id-card-wrapper {
//             transform: scale(0.85);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // ============================================================================
// // ID CARD DISPLAY - DUNISTECH ACADEMY OFFICIAL BRANDING
// // Colors: Royal Blue (#1e3a8a), Thick Green (#15803d), White (#ffffff)
// // ============================================================================

// interface IDCardDisplayProps {
//   studentName: string;
//   studentId: string;
//   email: string;
//   phone?: string;
//   courseName: string;
//   courseCode: string;
//   photo: string;
// }

// const IDCardDisplay: React.FC<IDCardDisplayProps> = ({
//   studentName,
//   studentId,
//   email,
//   phone,
//   courseName,
//   courseCode,
//   photo
// }) => {
//   const currentYear = new Date().getFullYear();
//   const validUntil = new Date(currentYear + 1, 11, 31).toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric' 
//   });

//   return (
//     <div 
//       style={{
//         width: '856px',
//         height: '540px',
//         backgroundColor: '#ffffff',
//         borderRadius: '16px',
//         overflow: 'hidden',
//         boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
//         fontFamily: 'Arial, sans-serif',
//         position: 'relative',
//         border: '3px solid #15803d'
//       }}
//     >
//       {/* Header - Royal Blue & Green */}
//       <div 
//         style={{
//           background: 'linear-gradient(135deg, #1e3a8a 0%, #15803d 100%)',
//           padding: '20px 32px',
//           color: 'white',
//           position: 'relative'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             {/* Academy Logo */}
//             <div 
//               style={{
//                 width: '70px',
//                 height: '70px',
//                 backgroundColor: 'white',
//                 borderRadius: '12px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: '8px',
//                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//               }}
//             >
//               <img 
//                 src="/assets/images/app-logo/dunis_academ.png" 
//                 alt="Dunistech Academy" 
//                 style={{ 
//                   width: '100%', 
//                   height: '100%', 
//                   objectFit: 'contain' 
//                 }}
//               />
//             </div>
//             <div>
//               <div style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '2px', letterSpacing: '0.5px' }}>
//                 DUNISTECH ACADEMY
//               </div>
//               <div style={{ fontSize: '13px', opacity: 0.95, fontWeight: '500' }}>
//                 Student Identification Card
//               </div>
//             </div>
//           </div>
//           <div 
//             style={{
//               backgroundColor: '#15803d',
//               padding: '10px 18px',
//               borderRadius: '8px',
//               fontSize: '13px',
//               fontWeight: 'bold',
//               border: '2px solid white'
//             }}
//           >
//             {currentYear}/{currentYear + 1}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={{ padding: '32px', display: 'flex', gap: '32px' }}>
        
//         {/* Photo Section */}
//         <div style={{ flexShrink: 0 }}>
//           <div 
//             style={{
//               width: '180px',
//               height: '220px',
//               borderRadius: '12px',
//               overflow: 'hidden',
//               border: '4px solid #1e3a8a',
//               backgroundColor: '#f3f4f6',
//               boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
//             }}
//           >
//             {photo ? (
//               <img 
//                 src={photo} 
//                 alt="Student" 
//                 style={{ 
//                   width: '100%', 
//                   height: '100%', 
//                   objectFit: 'cover' 
//                 }}
//               />
//             ) : (
//               <div 
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '64px',
//                   color: '#9ca3af',
//                   backgroundColor: '#e5e7eb'
//                 }}
//               >
//                 👤
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Information Section */}
//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
//           {/* Student Name */}
//           <div>
//             <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
//               STUDENT NAME
//             </div>
//             <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e3a8a', lineHeight: '1.2' }}>
//               {studentName}
//             </div>
//           </div>

//           {/* Student ID */}
//           <div>
//             <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
//               STUDENT ID
//             </div>
//             <div 
//               style={{ 
//                 fontSize: '20px', 
//                 fontWeight: 'bold', 
//                 color: '#15803d',
//                 fontFamily: 'monospace',
//                 letterSpacing: '3px',
//                 backgroundColor: '#f0fdf4',
//                 padding: '8px 12px',
//                 borderRadius: '6px',
//                 display: 'inline-block'
//               }}
//             >
//               {studentId}
//             </div>
//           </div>

//           {/* Course */}
//           <div>
//             <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
//               ENROLLED COURSE
//             </div>
//             <div style={{ fontSize: '16px', fontWeight: '700', color: '#15803d' }}>
//               {courseCode}
//             </div>
//             <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
//               {courseName}
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div style={{ display: 'flex', gap: '20px', fontSize: '11px', marginTop: '4px' }}>
//             <div style={{ flex: 1 }}>
//               <div style={{ color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>EMAIL</div>
//               <div style={{ color: '#374151', fontSize: '12px', wordBreak: 'break-all' }}>{email}</div>
//             </div>
//             {phone && (
//               <div style={{ flex: 1 }}>
//                 <div style={{ color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>PHONE</div>
//                 <div style={{ color: '#374151', fontSize: '12px' }}>{phone}</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer - Green & Royal Blue */}
//       <div 
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           padding: '14px 32px',
//           background: 'linear-gradient(90deg, #15803d 0%, #1e3a8a 100%)',
//           color: 'white',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           fontSize: '11px',
//           fontWeight: '600'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <span>Valid Until: {validUntil}</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <span className='disabled'>Official Student ID</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <span>www.dunistech.ng/academy</span>
//         </div>
//       </div>

//       {/* Decorative Corner Accent - Green */}
//       <div 
//         style={{
//           position: 'absolute',
//           top: '90px',
//           right: '-30px',
//           width: '150px',
//           height: '150px',
//           borderRadius: '50%',
//           background: 'radial-gradient(circle, rgba(21, 128, 61, 0.1) 0%, rgba(21, 128, 61, 0) 70%)',
//           filter: 'blur(20px)'
//         }}
//       />
//     </div>
//   );
// };

// export default StudentIDCard;








// v5
// v4 - Professional Modal Preview with Full-Width Configuration
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { IDCardService } from '@/services/idcard/IDCardService';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import type { CourseEnrollment, StudentIDData } from '@/types/idcard';

const StudentIDCard = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentIDData | null>(null);
  const [courses, setCourses] = useState<CourseEnrollment[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const modalCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!auth?.user?.id) return;

    try {
      setLoading(true);
      const data = await IDCardService.getStudentData(auth.user.id);
      
      setStudent(data.student);
      setCourses(data.courses || []);
      setPhotoPreview(data.student.profile_picture || '');
      
      if (data.courses.length > 0) {
        setSelectedCourseId(data.courses[0].id);
      }
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth?.user?.id) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      const result = await IDCardService.uploadPhoto(auth.user.id, file);
      setPhotoPreview(result.photo_url);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    }
  };

  const handleGeneratePreview = () => {
    if (!selectedCourseId) {
      toast.error('Please select a course');
      return;
    }
    if (!photoPreview) {
      toast.error('Please upload a photo');
      return;
    }
    setShowPreviewModal(true);
  };

  const handleDownload = async () => {
    if (!modalCardRef.current) return;

    try {
      setDownloading(true);
      
      const canvas = await html2canvas(modalCardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 15000
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate image');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${student?.names?.replace(/\s+/g, '_') || 'Student'}_ID_Card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('ID Card downloaded successfully!');
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to generate ID card');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="empty-state">
          <i className="fa fa-id-card fa-4x text-muted mb-3" />
          <h5 className="fw-semibold">No Course Enrollments</h5>
          <p className="text-muted">You need to be enrolled in at least one course to generate an ID card.</p>
        </div>
      </div>
    );
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <>
      <div className="container-fluid py-4 px-3 px-md-4 px-lg-5">
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="mb-1 fw-bold">Generate Student ID Card</h2>
          <p className="text-muted mb-0">Create your official student identification card</p>
        </div>

        {/* Configuration Panel - Full Width */}
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-header bg-primary text-white py-3 rounded-top-4 border-0">
                <h5 className="mb-0">
                  <i className="fa fa-cog me-2" />
                  ID Card Configuration
                </h5>
              </div>
              
              <div className="card-body p-4 p-xl-5">
                {/* Student Information Card */}
                <div className="mb-5">
                  <label className="form-label fw-semibold text-primary mb-3">
                    <i className="fa fa-user-circle me-2" />
                    Student Information
                  </label>
                  <div className="bg-light p-4 rounded-3 border">
                    <div className="row g-4">
                      <div className="col-sm-6">
                        <div className="d-flex flex-column">
                          <small className="text-muted text-uppercase small fw-semibold">Full Name</small>
                          <span className="fw-bold h5 mb-0">{student?.names || auth?.user?.names || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex flex-column">
                          <small className="text-muted text-uppercase small fw-semibold">Student ID</small>
                          <span className="fw-bold h5 mb-0 text-primary">
                            {student?.student_id || auth?.user?.username || auth?.user?.id?.slice(0, 8).toUpperCase() || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex flex-column">
                          <small className="text-muted text-uppercase small fw-semibold">Email Address</small>
                          <span className="fw-medium">{student?.email || auth?.user?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Selection */}
                <div className="mb-5">
                  <label className="form-label fw-semibold text-primary mb-3">
                    <i className="fa fa-graduation-cap me-2" />
                    Select Course <span className="text-danger">*</span>
                  </label>
                  <select 
                    className="form-select form-select-lg border-2"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                  >
                    <option value="">Choose your enrolled course...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                  <div className="form-text text-muted">
                    <i className="fa fa-info-circle me-1"></i>
                    Select the course for which you want to generate the ID card
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="mb-5">
                  <label className="form-label fw-semibold text-primary mb-3">
                    <i className="fa fa-camera me-2" />
                    Profile Photo <span className="text-danger">*</span>
                  </label>
                  
                  {photoPreview ? (
                    <div className="text-center p-4 bg-light rounded-3 border">
                      <div className="position-relative d-inline-block">
                        <img 
                          src={photoPreview} 
                          alt="Profile preview" 
                          className="rounded-3 shadow-sm"
                          style={{ 
                            width: '180px', 
                            height: '180px', 
                            objectFit: 'cover',
                            border: '4px solid #fff'
                          }}
                        />
                        <button 
                          className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0"
                          onClick={() => setPhotoPreview('')}
                          style={{ transform: 'translate(25%, -25%)' }}
                        >
                          <i className="fa fa-times" />
                        </button>
                      </div>
                      <p className="text-success mt-3 mb-0">
                        <i className="fa fa-check-circle me-1" />
                        Photo uploaded successfully
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="upload-area border-2 border-dashed rounded-4 p-5 text-center"
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: '#f8f9fa',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => document.getElementById('photoInput')?.click()}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    >
                      <div className="upload-icon mb-3">
                        <i className="fa fa-cloud-upload fa-4x text-primary opacity-50" />
                      </div>
                      <h6 className="fw-semibold mb-2">Click to upload your photo</h6>
                      <p className="text-muted small mb-3">
                        JPG, PNG or GIF • Max 2MB • 300x300px recommended
                      </p>
                      <button className="btn btn-outline-primary px-4">
                        <i className="fa fa-folder-open me-2" />
                        Browse Files
                      </button>
                    </div>
                  )}
                  
                  <input
                    id="photoInput"
                    type="file"
                    className="d-none"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>

                {/* Generate Button */}
                <div className="d-grid">
                  <button 
                    className="btn btn-primary btn-lg rounded-pill py-3"
                    onClick={handleGeneratePreview}
                    disabled={!selectedCourseId || !photoPreview}
                  >
                    <i className="fa fa-eye me-2" />
                    Preview ID Card
                  </button>
                </div>

                {/* Helper Text */}
                <p className="text-center text-muted small mt-4 mb-0">
                  <i className="fa fa-shield-alt me-1 text-primary"></i>
                  Your information is secure and will only be used for ID card generation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal - Professionally Responsive */}
      <div 
        className={`modal fade ${showPreviewModal ? 'show' : ''}`} 
        style={{ 
          display: showPreviewModal ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)'
        }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow-lg">
            {/* Modal Header */}
            <div className="modal-header bg-gradient py-3" style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #15803d 100%)'
            }}>
              <div className="d-flex align-items-center">
                <div className="bg-white rounded-2 p-2 me-3">
                  <i className="fa fa-id-card text-primary fa-lg" />
                </div>
                <div>
                  <h5 className="text-white mb-0 fw-semibold">ID Card Preview</h5>
                  <small className="text-white-50">Verify your details before downloading</small>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowPreviewModal(false)}
                aria-label="Close"
              />
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4 p-md-5">
              {/* Card Container with Horizontal Scroll */}
              <div className="card-preview-wrapper">
                <div 
                  className="card-scroll-container"
                  style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    padding: '20px 0',
                    margin: '-20px 0',
                    cursor: 'grab'
                  }}
                >
                  <div 
                    style={{
                      display: 'inline-block',
                      minWidth: '100%',
                      textAlign: 'center'
                    }}
                  >
                    <div 
                      ref={modalCardRef}
                      className="id-card-display"
                      style={{
                        display: 'inline-block',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        borderRadius: '16px',
                        transform: 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <IDCardDisplay
                        studentName={student?.names || auth?.user?.names || ''}
                        studentId={student?.student_id || auth?.user?.username || auth?.user?.id?.slice(0, 8).toUpperCase() || ''}
                        email={student?.email || auth?.user?.email || ''}
                        phone={student?.phone || auth?.user?.phone}
                        courseName={selectedCourse?.title || ''}
                        courseCode={selectedCourse?.code || ''}
                        photo={photoPreview}
                      />
                    </div>
                  </div>
                </div>

                {/* Scroll Hint for Mobile */}
                <div className="d-flex d-lg-none justify-content-center align-items-center mt-4 text-muted">
                  <i className="fa fa-arrow-left me-2" />
                  <small>Scroll horizontally to view full card</small>
                  <i className="fa fa-arrow-right ms-2" />
                </div>

                {/* Scroll Progress Indicator */}
                <div className="d-flex justify-content-center gap-2 mt-3 d-lg-none">
                  <div className="scroll-dot active" style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#1e3a8a',
                    opacity: 0.3
                  }} />
                  <div className="scroll-dot" style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#1e3a8a',
                    opacity: 0.6
                  }} />
                  <div className="scroll-dot" style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#1e3a8a',
                    opacity: 1
                  }} />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light border-0 p-4">
              <div className="row g-3 w-100">
                <div className="col-sm-6">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100 py-2"
                    onClick={() => setShowPreviewModal(false)}
                  >
                    <i className="fa fa-times me-2" />
                    Close Preview
                  </button>
                </div>
                <div className="col-sm-6">
                  <button 
                    type="button" 
                    className="btn btn-success w-100 py-2"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-download me-2" />
                        Download ID Card
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .border-dashed {
          border-style: dashed !important;
        }
        
        .upload-area {
          transition: all 0.3s ease;
        }
        
        .upload-area:hover {
          border-color: #1e3a8a !important;
          background-color: #f1f5f9 !important;
        }
        
        .card-scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: thin;
          scrollbar-color: #1e3a8a #e5e7eb;
        }
        
        .card-scroll-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .card-scroll-container::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
        
        .card-scroll-container::-webkit-scrollbar-thumb {
          background: #1e3a8a;
          border-radius: 4px;
        }
        
        .card-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #15803d;
        }
        
        .id-card-display {
          max-width: 100%;
          height: auto;
        }
        
        @media (max-width: 768px) {
          .id-card-display {
            transform: scale(0.8);
          }
        }
        
        @media (max-width: 576px) {
          .id-card-display {
            transform: scale(0.7);
          }
        }
        
        .modal.show {
          display: flex !important;
          align-items: center;
        }
        
        .text-white-50 {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        .btn-check:checked + .btn,
        .btn.active,
        .btn.show,
        .btn:first-child:active,
        :not(.btn-check) + .btn:active {
          transform: translateY(0);
        }
        
        .btn {
          transition: all 0.2s ease;
        }
        
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
};

// ============================================================================
// ID CARD DISPLAY COMPONENT (Unchanged from v3)
// ============================================================================

interface IDCardDisplayProps {
  studentName: string;
  studentId: string;
  email: string;
  phone?: string;
  courseName: string;
  courseCode: string;
  photo: string;
}

const IDCardDisplay: React.FC<IDCardDisplayProps> = ({
  studentName,
  studentId,
  email,
  phone,
  courseName,
  courseCode,
  photo
}) => {
  const currentYear = new Date().getFullYear();
  const validUntil = new Date(currentYear + 1, 11, 31).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div 
      style={{
        width: '856px',
        height: '540px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        border: '3px solid #15803d'
      }}
    >
      {/* Header */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #15803d 100%)',
          padding: '20px 32px',
          color: 'white',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <img 
                src="/assets/images/app-logo/dunis_academ.png" 
                alt="Dunistech Academy" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '2px', letterSpacing: '0.5px' }}>
                DUNISTECH ACADEMY
              </div>
              <div style={{ fontSize: '13px', opacity: 0.95, fontWeight: '500' }}>
                Student Identification Card
              </div>
            </div>
          </div>
          <div 
            style={{
              backgroundColor: '#15803d',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              border: '2px solid white'
            }}
          >
            {currentYear}/{currentYear + 1}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px', display: 'flex', gap: '32px' }}>
        
        {/* Photo Section */}
        <div style={{ flexShrink: 0 }}>
          <div 
            style={{
              width: '180px',
              height: '220px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '4px solid #1e3a8a',
              backgroundColor: '#f3f4f6',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
            }}
          >
            {photo ? (
              <img 
                src={photo} 
                alt="Student" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            ) : (
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  color: '#9ca3af',
                  backgroundColor: '#e5e7eb'
                }}
              >
                👤
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Student Name */}
          <div>
            <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
              STUDENT NAME
            </div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e3a8a', lineHeight: '1.2' }}>
              {studentName}
            </div>
          </div>

          {/* Student ID */}
          <div>
            <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
              STUDENT ID
            </div>
            <div 
              style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#15803d',
                fontFamily: 'monospace',
                letterSpacing: '3px',
                backgroundColor: '#f0fdf4',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'inline-block'
              }}
            >
              {studentId}
            </div>
          </div>

          {/* Course */}
          <div>
            <div style={{ fontSize: '11px', color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>
              ENROLLED COURSE
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#15803d' }}>
              {courseCode}
            </div>
            <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
              {courseName}
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', gap: '20px', fontSize: '11px', marginTop: '4px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>EMAIL</div>
              <div style={{ color: '#374151', fontSize: '12px', wordBreak: 'break-all' }}>{email}</div>
            </div>
            {phone && (
              <div style={{ flex: 1 }}>
                <div style={{ color: '#1e3a8a', marginBottom: '4px', fontWeight: '700', letterSpacing: '0.5px' }}>PHONE</div>
                <div style={{ color: '#374151', fontSize: '12px' }}>{phone}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '14px 32px',
          background: 'linear-gradient(90deg, #15803d 0%, #1e3a8a 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          fontWeight: '600'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Valid Until: {validUntil}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className='disabled'>Official Student ID</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>www.dunistech.ng/academy</span>
        </div>
      </div>

      {/* Decorative Accent */}
      <div 
        style={{
          position: 'absolute',
          top: '90px',
          right: '-30px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(21, 128, 61, 0.1) 0%, rgba(21, 128, 61, 0) 70%)',
          filter: 'blur(20px)'
        }}
      />
    </div>
  );
};

export default StudentIDCard;
