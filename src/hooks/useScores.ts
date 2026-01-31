// =====================================================
// src/hooks/useScores.ts - Custom Hook for Scores
// =====================================================

import { AssessmentService } from '@/services/courses/Assessment';
import { useApi } from './useApi';
import { ScoreService } from '@/services/courses/Score';
import type { ScoreFilter, Score, BulkScoreCreateDTO } from '@/types/course/score';

export function useScores(filter?: ScoreFilter) {
  return useApi<Score[]>(
    () => ScoreService.getAll(filter),
    { immediate: true, initialData: [] }
  );
}

export function useAssessmentScores(assessmentId: string) {
  return useApi<Score[]>(
    () => AssessmentService.getScores(assessmentId),
    { immediate: !!assessmentId, initialData: [] }
  );
}

export function useCreateScore() {
  return useApi(ScoreService.create);
}

export function useBulkCreateScores() {
  return useApi((data: BulkScoreCreateDTO) => ScoreService.bulkCreate(data));
}

export function useUpdateScore() {
  return useApi((id: string, data: any) => ScoreService.update(id, data));
}
