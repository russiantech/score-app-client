// v3
// src/components/modals/course/CourseModal.tsx
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
// import type { CourseModalProps, CreateCourseDTO, UpdateCourseDTO } from "@/types/course";
import type { User } from "@/types/users";
import CourseService from "@/services/courses/CourseService";
import { UserService } from "@/services/users/UserService";

import type { CourseModalProps, CreateCourseDTO, UpdateCourseDTO } from "@/types/course";

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  editingCourse,
  onClose,
  onSuccess,
}) => {
  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCourseDTO>({
    title: "",
    description: "",
    code: "",
    tutor_ids: [],
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    code: "",
    description: "",
  });

  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    fetchTutors();

    if (editingCourse) {
      setFormData({
        title: editingCourse.title || "",
        description: editingCourse.description || "",
        code: editingCourse.code || "",
        tutor_ids: editingCourse.tutor_ids || [],
        status: editingCourse.status || "active",
      });
    } else {
      resetForm();
    }
    
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [isOpen, editingCourse]);

  const fetchTutors = async () => {
    try {
      const response: any = await UserService.getAll({ role: "tutor" });
      const users = Array.isArray(response?.data?.users) 
        ? response.data.users 
        : Array.isArray(response) 
        ? response 
        : [];
      setTutors(users);
    } catch (error) {
      console.warn("Failed to fetch tutors:", error);
      setTutors([]);
    }
  };

  const validateForm = (): boolean => {
    const errors = { title: "", code: "", description: "" };
    let valid = true;

    const title = formData.title?.trim() || "";
    const code = formData.code?.trim() || "";
    const description = formData.description?.trim() || "";

    if (!title) {
      errors.title = "Course title is required";
      valid = false;
    }

    if (!/^[A-Z]{2,3}\d{3}$/.test(code)) {
      errors.code = "Format: 2–3 letters + 3 numbers (e.g. WEB101)";
      valid = false;
    }

    if (description.length < 20) {
      errors.description = "Minimum 20 characters required";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingCourse) {
        await CourseService.update(editingCourse.id, formData as UpdateCourseDTO);
        toast.success("Course updated successfully");
      } else {
        await CourseService.create(formData);
        toast.success("Course created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      code: "",
      tutor_ids: [],
      status: "active",
    });
    setFormErrors({ title: "", code: "", description: "" });
  };

  const handleTutorToggle = (tutorId: string) => {
    setFormData(prev => {
      const currentIds = prev.tutor_ids || [];
      const newIds = currentIds.includes(tutorId)
        ? currentIds.filter(id => id !== tutorId)
        : [...currentIds, tutorId];
      
      return {
        ...prev,
        tutor_ids: newIds
      };
    });
  };

  if (!isOpen) return null;

  const descriptionLength = formData.description?.length || 0;
  const tutorIdsLength = formData.tutor_ids?.length || 0;

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down"
        style={{ 
          maxHeight: 'calc(100vh - 2rem)',
          margin: '1rem auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ 
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <form onSubmit={handleSubmit} style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div className="modal-header border-bottom" style={{ flexShrink: 0 }}>
              <h5 className="modal-title d-flex align-items-center">
                <i className={`fa ${editingCourse ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
                {editingCourse ? "Edit Course" : "Create New Course"}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                disabled={loading}
                aria-label="Close"
              />
            </div>

            <div 
              ref={modalContentRef}
              className="modal-body overflow-auto"
              style={{ 
                flex: 1,
                paddingBottom: '0.5rem'
              }}
            >
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-8">
                  <label className="form-label">
                    Course Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.code ? 'is-invalid' : ''}`}
                    placeholder="e.g., WEB101"
                    value={formData.code || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    disabled={loading}
                    maxLength={6}
                  />
                  {formErrors.code && (
                    <div className="invalid-feedback d-block">{formErrors.code}</div>
                  )}
                  <small className="text-muted">Format: 2-3 letters + 3 numbers</small>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select w-100 border form-select-lg"
                    value={formData.status || "active"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Course Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                  placeholder="Enter course title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={loading}
                />
                {formErrors.title && (
                  <div className="invalid-feedback d-block">{formErrors.title}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                  rows={4}
                  placeholder="Enter course description (minimum 20 characters)"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={loading}
                />
                {formErrors.description && (
                  <div className="invalid-feedback d-block">{formErrors.description}</div>
                )}
                <div className="d-flex justify-content-between mt-1">
                  <small className="text-muted">Minimum 20 characters</small>
                  <small className={`${descriptionLength < 20 ? 'text-danger' : 'text-success'}`}>
                    {descriptionLength} characters
                  </small>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Assign Tutors 
                  {tutorIdsLength > 0 && (
                    <span className="badge bg-primary ms-2">{tutorIdsLength} selected</span>
                  )}
                </label>
                
                <div className="border rounded p-3" style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  backgroundColor: '#f8f9fa'
                }}>
                  {tutors.length === 0 ? (
                    <div className="text-muted text-center py-3">
                      <i className="fa fa-user-slash me-2"></i>
                      No tutors available
                    </div>
                  ) : (
                    tutors.map((tutor) => (
                      <div key={tutor.id} className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`tutor-${tutor.id}`}
                          checked={(formData.tutor_ids || []).includes(tutor.id)}
                          onChange={() => handleTutorToggle(tutor.id)}
                          disabled={loading}
                        />
                        <label 
                          className="form-check-label w-100" 
                          htmlFor={`tutor-${tutor.id}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-medium">{tutor.names}</div>
                              <small className="text-muted">{tutor.email}</small>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <small className="text-muted d-block mt-2">
                  <i className="fa fa-info-circle me-1"></i>
                  Select one or more tutors for this course
                </small>
              </div>

              <div className="alert alert-info mb-0">
                <div className="d-flex">
                  <i className="fa fa-info-circle me-2 mt-1"></i>
                  <div>
                    <strong>Course Information:</strong>
                    <ul className="mb-0 mt-2 ps-3 small">
                      <li>Course code must be unique</li>
                      <li>Description helps students understand course content</li>
                      <li>Multiple tutors can be assigned to one course</li>
                      <li>Inactive courses won't appear in student listings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top mt-auto" style={{ flexShrink: 0 }}>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                <i className="fa fa-times me-2"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    {editingCourse ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className={`fa ${editingCourse ? 'fa-save' : 'fa-plus'} me-2`}></i>
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
