
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
  // const [generating, _setGenerating] = useState(false);
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
          <div className="col-12">
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
              <div className="row g-3">
                <div className="col">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary py-2"
                    onClick={() => setShowPreviewModal(false)}
                  >
                    <i className="fa fa-times me-2" />
                    Close
                  </button>
                </div>
                <div className="col">
                  <button 
                    type="button"
                    className="btn btn-success py-2"
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
                        Download
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
