export interface PageMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page_meta: PageMeta;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

