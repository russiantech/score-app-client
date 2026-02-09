import type { Lesson } from "./lesson";

// src/types/module.ts
export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order: number;
  lessons_count?: number;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface ModuleCreate {
  course_id: string;
  title: string;
  description?: string;
  order: number;
}

export interface ModuleUpdate extends Partial<ModuleCreate> {
  course_id?: string;  // Make optional to match union type
  title?: string;
  description?: string;
  order?: number;
}

// modals's
export interface ModuleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ModuleCreate | ModuleUpdate) => Promise<void>;
  courseId: string;
  module?: Module | null;
  isEditing?: boolean;
  existingOrders?: number[];
}

export interface ModuleExamScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module;
  onSave: () => void;
}

export interface StudentExamData {
  enrollment_id: string;
  student_id: string;
  names: string;
  email: string;
  username?: string;
  exam_score: number;
  max_score: number;
  percentage: number;
  grade: string | null;
  remarks: string;
  score_id: string | null;
  is_recorded: boolean;
}
