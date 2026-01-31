

// v2 - scrollable, clickable
// shared/DashboardCourses.tsx
import CourseCard from "@/components/cards/CourseCard";
import { useMemo, useState } from "react";

const DashboardCourses = ({ courses = [], loading }: any) => {
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((c: any) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  return (
    <div className="card shadow-sm h-100 d-flex flex-column">
      {/* Header */}
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-semibold">
          <i className="fa fa-book me-2 text-primary" />
          My Courses
        </h6>

        <span className="badge bg-primary">
          {filteredCourses.length}
        </span>
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column gap-3">

        {/* Search */}
        <div className="input-group input-group-sm">
          <span className="input-group-text bg-white">
            <i className="fa fa-search text-muted" />
          </span>
          <input
            className="form-control"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Scrollable grid */}
        <div
          className="row g-3 overflow-auto"
          style={{ maxHeight: "60vh" }}
        >
          {loading ? (
            <div className="text-center py-5 w-100">
              <div className="spinner-border text-primary" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center text-muted py-5">
              No courses found
            </div>
          ) : (
            filteredCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCourses;
