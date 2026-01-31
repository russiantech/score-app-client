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

export interface ModuleUpdate {
  title?: string;
  description?: string;
  order?: number;
}

