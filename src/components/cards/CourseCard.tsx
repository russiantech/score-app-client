
// v4 - now clickable
// shared/CourseCard.tsx
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }: any) => {
  const navigate = useNavigate();

  return (
    <div className="col-12 col-sm-6 col-xl-6">
      <div
        className="card h-100 border-0 shadow-sm course-card"
        role="button"
        onClick={() => navigate(`/courses/${course.id}`)}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="fw-semibold text-primary">
              {course.code}
            </span>
            <span
              className={`badge bg-${course.is_active ? "success" : "secondary"}`}
            >
              {course.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <h6 className="fw-bold mb-1">{course.title}</h6>

          <p className="text-muted small flex-grow-1">
            {course.description?.slice(0, 80) || "No description"}
          </p>

          <div className="d-flex gap-2 mt-2">
            <span className="badge bg-info">
              <i className="fa fa-users me-1" />
              {course.students_count ?? 0}
            </span>

            <span className="badge bg-secondary">
              <i className="fa fa-book-open me-1" />
              {course.lessons_count ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
