// services/users/parentCourses.ts
import { AxiosService } from "@/services/base/AxiosService";
import { handleError } from "@/utils/helpers";

export const ParentCourseService = {

  async child(childId: string) {
    try {
      const response = await AxiosService.json.get(`/parent/children/${childId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async childCourse(childId: string, courseId: string) {
    try {
      const response = await AxiosService.json.get(
        `/parent/children/${childId}/courses/${courseId}`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async lessons(childId: string, courseId: string) {
    try {
      const response = await AxiosService.json.get(
        `/parent/children/${childId}/courses/${courseId}/lessons`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};
