export interface Pagination {
  pageSize: number;
  currentPage: number;
  totalRecords: number;
  totalPages: number;
}

export type PaginatedResults<T> = {
  data: T;
  pagination: Pagination;
};
