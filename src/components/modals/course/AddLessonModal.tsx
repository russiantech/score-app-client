
// v3 – fully responsive
import type { AddLessonModalProps } from "@/types/course/lesson";
import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiBookOpen,
  FiSave,
} from "react-icons/fi";


const AddLessonModal: React.FC<AddLessonModalProps> = ({
  course,
 lesson = null,
  isEditing = false,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    duration: "2 hours",
    description: "",
  });

  useEffect(() => {
    if (isEditing && lesson) {
      setFormData({
        title: lesson.title ?? "",
        date: lesson.date ?? new Date().toISOString().split("T")[0],
        duration: lesson.duration ?? "2 hours",
        description: lesson.description ?? "",
      });
    }
  }, [isEditing, lesson]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  const durationOptions = [
    "1 hour",
    "1.5 hours",
    "2 hours",
    "2.5 hours",
    "3 hours",
    "3.5 hours",
    "4 hours",
  ];

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
        <div className="modal-content border-0 shadow-lg rounded-4">

          {/* Header */}
          <div className="modal-header bg-primary text-white rounded-top-4 px-3 px-md-4 py-3">
            <div className="d-flex align-items-start w-100 gap-3">
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FiBookOpen size={18} />
                  <h6 className="mb-0 fw-bold">
                    {isEditing ? "Edit Lesson" : "Add New Lesson"}
                  </h6>
                </div>
                <div className="small opacity-75 text-truncate">
                  {course.title}
                </div>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>
          </div>

          {/* Body */}
          <div className="modal-body px-3 px-md-4 py-4">
            <form onSubmit={handleSubmit}>

              {/* Title */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Lesson Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control rounded-3"
                  placeholder="e.g. Introduction to Python"
                  required
                />
                <div className="form-text">
                  Use a clear and descriptive lesson title
                </div>
              </div>

              {/* Date & Duration */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold d-flex align-items-center gap-2">
                    <FiCalendar />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-control rounded-3"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold d-flex align-items-center gap-2">
                    <FiClock />
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="form-select rounded-3"
                  >
                    {durationOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Description <span className="text-muted">(optional)</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control rounded-3"
                  rows={4}
                  placeholder="Topics, objectives, or notes..."
                />
              </div>

              {/* Course Info */}
              <div className="bg-light rounded-3 p-3">
                <div className="d-flex gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 flex-shrink-0">
                    <FiBookOpen className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="fw-semibold text-truncate">
                      {course.code} • {course.title}
                    </div>
                    <div className="text-muted small">
                      {course.enrolled_count} students • {course.modules_count} modules
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light rounded-bottom-4 px-3 px-md-4 py-3">
            <div className="d-flex flex-column flex-md-row w-100 gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-3 w-100 w-md-auto"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary rounded-3 fw-semibold w-100 w-md-auto"
                onClick={handleSubmit}
              >
                <FiSave className="me-2" />
                {isEditing ? "Update Lesson" : "Add Lesson"}
              </button>
            </div>

            <div className="w-100 border-top mt-3 pt-3 small text-muted text-center text-md-start">
              ✓ Lessons are added with <strong>Upcoming</strong> status
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddLessonModal;
