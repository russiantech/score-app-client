// =====================================================
// src/hooks/useParentChild.ts - Custom Hook for Parent-Child
// =====================================================

import { ParentChildService } from "@/services/users/ParentChild";
import type { ParentChild, ChildInfo } from "@/types/parent";
import { useApi } from "./useApi";

export function useParentChildLinks() {
  return useApi<ParentChild[]>(
    () => ParentChildService.getAll(),
    { immediate: true, initialData: [] }
  );
}

export function useParentChildren(parentId: string) {
  return useApi<ChildInfo[]>(
    () => ParentChildService.getChildren(parentId),
    { immediate: !!parentId, initialData: [] }
  );
}

export function useLinkParentChild() {
  return useApi(ParentChildService.create);
}

export function useUnlinkParentChild() {
  return useApi(ParentChildService.delete);
}
