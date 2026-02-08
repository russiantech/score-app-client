/* =====================================================
   ASSESSMENT SERVICE
===================================================== */

// import type { Assessment, CreateAssessmentDTO, UpdateAssessmentDTO } from "@/types/course/assessment";
// import type { Score } from "@/types/course/score";
import { handleError } from "@/utils/helpers";
import { AxiosService } from "../base/AxiosService";
import type { Assessment } from "@/types/course";
import type { ScoreColumn } from "@/types/course/score";
import type { CreateAssessmentDTO, UpdateAssessmentDTO } from "@/types/course/assessment";

export const AssessmentService = {
  async getById(id: string): Promise<Assessment> {
    try {
      const response = await AxiosService.json.get(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async create(data: CreateAssessmentDTO): Promise<Assessment> {
    try {
      const response = await AxiosService.json.post('/assessments', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async update(id: string, data: UpdateAssessmentDTO): Promise<Assessment> {
    try {
      const response = await AxiosService.json.put(`/assessments/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/assessments/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  async getScores(assessmentId: string): Promise<ScoreColumn[]> {
    try {
      const response = await AxiosService.json.get(`/assessments/${assessmentId}/scores`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async publish(id: string): Promise<Assessment> {
    try {
      const response = await AxiosService.json.post(`/assessments/${id}/publish`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async close(id: string): Promise<Assessment> {
    try {
      const response = await AxiosService.json.post(`/assessments/${id}/close`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async addComment(assessmentId: number, payload: { text: string; childId: string }) {
    try {
      const response = await AxiosService.json.post(
        `/assessments/${assessmentId}/comments`,
        payload
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

};