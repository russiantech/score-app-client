/* =====================================================
   PARENT–CHILD LINK SERVICE
   Manages parent/guardian ↔ student relationships
===================================================== */

import { AxiosService } from '../base/AxiosService';
import { handleError } from '@/utils/helpers';

import type {
  ParentChildLink,
  ParentChildLinkFilters,
  ParentChildLinkStats,
  CreateParentChildLinkPayload,
} from '@/types/parent';

export const ParentService = {
  /**
   * Get all parent–child links
   */
  async getAll(filters?: ParentChildLinkFilters): Promise<{
    data: {
      links: ParentChildLink[];
      page_meta: {
        total_items_count: number;
        total_pages_count: number;
        current_page: number;
        page_size: number;
      };
    };
  }> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const url = `/parents${queryString ? `?${queryString}` : ''}`;

      const response = await AxiosService.json.get(url);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get parent–child statistics
   */
  async getStats(): Promise<{
    data: ParentChildLinkStats;
  }> {
    try {
      const response = await AxiosService.json.get('/parents/stats');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get a single parent–child link by ID
   */
  async getById(linkId: string): Promise<{
    data: ParentChildLink;
  }> {
    try {
      const response = await AxiosService.json.get(`/parents/${linkId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all children for a specific parent
   */
  async getByParentId(parentId: string): Promise<{
    data: ParentChildLink[];
  }> {
    try {
      const response = await AxiosService.json.get(
        `/parents/${parentId}/children`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all parents for a specific child
   */
  async getByChildId(childId: string): Promise<{
    data: ParentChildLink[];
  }> {
    try {
      const response = await AxiosService.json.get(
        `/students/${childId}/parents`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Create a new parent–child link
   */
  async create(
    payload: CreateParentChildLinkPayload
  ): Promise<{
    data: ParentChildLink;
  }> {
    try {
      const response = await AxiosService.json.post(
        '/parents',
        payload
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Update an existing link
   */
  async update(
    linkId: string,
    data: Partial<ParentChildLink>
  ): Promise<{
    data: ParentChildLink;
  }> {
    try {
      const response = await AxiosService.json.patch(
        `/parents/${linkId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Delete (unlink) a parent–child relationship
   */
  async delete(linkId: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/parents/${linkId}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Change link status (activate / deactivate)
   */
  async updateStatus(
    linkId: string,
    status: 'active' | 'inactive'
  ): Promise<{
    data: ParentChildLink;
  }> {
    try {
      const response = await AxiosService.json.patch(
        `/parents/${linkId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

