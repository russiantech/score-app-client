import CourseService from "@/services/courses/CourseService";
import type { Lesson } from "@/types/course";
import { useState, useEffect } from "react";
import type { Button } from "@/types/buttons";
import AddLessonModal from "@/components/modals/course/AddLessonModal";

export const ModuleCard = ({ module, course }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showAddLesson, setShowAddLesson] = useState(false);

  useEffect(() => {
    CourseService.getLessons(course.id, module.id)
      .then(res => setLessons(res.data));
  }, []);

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between">
        <strong>{module.title}</strong>
        <Button size="sm" onClick={() => setShowAddLesson(true)}>
          + Lesson
        </Button>
      </div>

      <ul className="list-group list-group-flush">
        {lessons.map(lesson => (
          <li key={lesson.id} className="list-group-item">
            {lesson.title}
          </li>
        ))}
      </ul>

      {showAddLesson && (
        <AddLessonModal
          course={course}
          module={module}
          onSave={lesson =>
            CourseService.createLesson(course.id, module.id, lesson)
              .then(res => setLessons(prev => [...prev, res.data]))
          }
          onClose={() => setShowAddLesson(false)}
        />
      )}
    </div>
  );
};
