// /* =====================================================
//    PARENT-CHILD TYPES
// ===================================================== */

import type { Grade } from "./course/score";
import type { Enrollment } from "./enrollment";
import type { User } from "./users";

// import type { User } from "./auth";
// import type { Enrollment } from "./enrollment";
// import type { Grade } from "./score";

export type RelationshipType = 'mother' | 'father' | 'guardian' | 'other';

// export interface ParentChildLink {
//   id: string;
//   parentId: string;
//   parentName: string;
//   parentEmail: string;
//   childId: string;
//   childName: string;
//   childEmail: string;
//   relationship: 'parent' | 'guardian';
//   linkedAt: string;
//   status: 'active' | 'inactive';
// }

// export interface ParentChild {
//   id: string;
//   parentId: string;
//   parent?: User;
//   parentName?: string;
//   childId: string;
//   child?: User;
//   childName?: string;
//   relationship: RelationshipType;
//   linkedAt: string;
//   linkedBy?: string;
//   isActive: boolean;
// }

export interface ParentChild {
  id: string;
  parent_id: string;
  child_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChildInfo {
  id: string;
  names: string;
  email: string;
  username?: string;
  is_active: boolean;
}

export interface CreateParentChildDTO {
  parentId: string;
  childId: string;
  relationship: RelationshipType;
}

export interface ChildInfo extends User {
  enrollments: Enrollment[];
  overallPerformance: number;
  averageGrade?: Grade;
  totalCourses: number;
  completedCourses: number;
  activeCourses: number;
}


// v2
// ============================================================================
// TYPE DEFINITIONS (types/parent.ts)
// Pattern-aligned with TutorAssignment
// ============================================================================

/**
 * Parent summary (included when include_relations=true)
 */
export interface ParentSummary {
  id: string;
  names: string;
  email: string;
  is_active: boolean;
}

/**
 * Child / Student summary (included when include_relations=true)
 */
export interface ChildSummary {
  id: string;
  names: string;
  email: string;
  is_active: boolean;
}

/**
 * Parent–Child Link model
 */
export interface ParentChildLink {
  id: string;

  parent_id: string;
  child_id: string;

  relationship: 'parent' | 'guardian';
  status: 'active' | 'inactive';

  created_at: string;
  updated_at: string;

  // Relations (populated when include_relations=true)
  parent?: ParentSummary;
  child?: ChildSummary;
}

/**
 * Payload for creating a parent–child link
 */
export interface CreateParentChildLinkPayload {
  parent_id: string;
  child_id: string;
  relationship: 'parent' | 'guardian';
}

/**
 * Filters for listing parent–child links
 */
export interface ParentChildLinkFilters {
  page?: number;
  page_size?: number;
  search?: string;

  parent_id?: string;
  child_id?: string;

  relationship?: 'parent' | 'guardian';
  status?: 'active' | 'inactive';

  sort_by?: 'created_at' | 'updated_at' | 'relationship' | 'status';
  order?: 'asc' | 'desc';

  include_relations?: boolean;
}

/**
 * Parent–Child link statistics
 * (Mirrors TutorAssignmentStats semantics)
 */
export interface ParentChildLinkStats {
  total_links: number;

  total_parents: number;
  parents_with_links: number;
  parents_without_links: number;

  total_children: number;
  children_with_links: number;
  unlinked_children: number;

  active_links: number;
  inactive_links: number;

  avg_children_per_parent: number;
}
