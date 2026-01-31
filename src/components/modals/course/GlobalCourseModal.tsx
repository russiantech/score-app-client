
// ============================================================================
// COMPONENT: GlobalCourseModal.tsx
// Wrapper that connects to context
// ============================================================================

import { useCourseModal } from "@/context/CourseModalContext";
import CourseModal from "./CourseModal";

const GlobalCourseModal: React.FC = () => {
  const { isOpen, editingCourse, closeModal, triggerRefresh } = useCourseModal();

  return (
    <CourseModal
      isOpen={isOpen}
      editingCourse={editingCourse}
      onClose={closeModal}
      onSuccess={triggerRefresh}
    />
  );
};

export default GlobalCourseModal

