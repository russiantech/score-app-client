// v2
// src/components/cards/ModuleCard.tsx
import { useState, useEffect } from "react";
import CourseService from "@/services/courses/CourseService";
import type { Lesson } from "@/types/course/lesson";
import type { Module } from "@/types/course/module";
import type { Course } from "@/types/course";
import { Button } from "@/components/buttons/Button";
import AddLessonModal from "@/components/modals/course/AddLessonModal";
import { LessonService } from "@/services/courses/LessonService";

interface ModuleCardProps {
  module: Module;
  course: Course;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, course }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showAddLesson, setShowAddLesson] = useState(false);

  useEffect(() => {
    if (course.id && module.id) {
      CourseService.getLessons(course.id)
        .then((res) => {
          // Filter lessons for this module
          const moduleLessons = Array.isArray(res) 
            ? res.filter(l => l.module_id === module.id)
            : [];
          setLessons(moduleLessons);
        })
        .catch(console.error);
    }
  }, [course.id, module.id]);

  const handleSaveLesson = async (lessonData: {
    title: string;
    date: string;
    // duration?: string;
    description: string;
  }) => {
    try {
      const newLesson = await LessonService.create({
        ...lessonData,
        module_id: module.id,
        order: 0
      });
      
      setLessons(prev => [...prev, newLesson]);
      setShowAddLesson(false);
    } catch (error) {
      console.error('Failed to create lesson:', error);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>{module.title}</strong>
        <Button 
          size="sm" 
          variant="outline-primary"
          onClick={() => setShowAddLesson(true)}
        >
          <i className="fa fa-plus me-1" />
          Lesson
        </Button>
      </div>

      <ul className="list-group list-group-flush">
        {lessons.length === 0 ? (
          <li className="list-group-item text-muted text-center">
            No lessons yet
          </li>
        ) : (
          lessons.map(lesson => (
            <li key={lesson.id} className="list-group-item">
              {lesson.title}
            </li>
          ))
        )}
      </ul>

      {showAddLesson && (
        <AddLessonModal
          course={course}
          onSave={handleSaveLesson}
          onClose={() => setShowAddLesson(false)}
        />
      )}
    </div>
  );
};
