// =====================================================
// src/hooks/useScores.ts - Custom Hook for Scores
// =====================================================

import { AssessmentService } from '@/services/courses/Assessment';
import { useApi } from './useApi';
import { ScoreService } from '@/services/courses/Score';
import type { ScoreColumn } from '@/types/course/score';
import type { BulkScoreCreateDTO } from '@/types/course/score';

export function useAssessmentScores(assessmentId: string) {
  return useApi<ScoreColumn[]>(
    () => AssessmentService.getScores(assessmentId),
    { immediate: !!assessmentId, initialData: [] }
  );
}

export function useCreateScore() {
  return useApi((data: any) => ScoreService.bulkCreate(data));
}

export function useBulkCreateScores() {
  return useApi((data: BulkScoreCreateDTO) => ScoreService.bulkCreate(data));
}

export function useUpdateScore() {
  return useApi((id: string, data: any) => ScoreService.updateColumn(id, data));
}
