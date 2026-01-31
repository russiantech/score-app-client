// src/components/course/CourseList.tsx
import { useMemo, useState } from "react";
import type { Course } from "@/types/course";
import CourseCard from "@/components/cards/CourseCard";
import { EmptyState } from "@/components/buttons/Button";

interface Props {
  courses: Course[];
  onView: (course: Course) => void;
}

const CourseList = ({ courses, onView }: Props) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.code?.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        status === "all" ||
        (status === "active" && c.is_active) ||
        (status === "inactive" && !c.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [courses, query, status]);

  return (
    <>
      {/* Search + Filter */}
      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Search by title or code..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <select
          className="form-select w-auto"
          value={status}
          onChange={e => setStatus(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Scrollable Container */}
      <div
        className="row g-3 overflow-auto"
        style={{ maxHeight: "70vh" }}
      >
        {filtered.length === 0 ? (
          <EmptyState
                      icon="fa fa-book"
                      title="No courses found"
                      description="Try adjusting your search or filter" actionLabel={undefined} onAction={undefined}          />
        ) : (
          filtered.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onView={onView}
            />
          ))
        )}
      </div>
    </>
  );
};

export default CourseList;
