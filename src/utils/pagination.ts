export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export const getPagination = (params: PaginationParams) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const skip = (page - 1) * limit;
  const search = params.search || '';
  const sortBy = params.sortBy || 'id';
  const sortOrder = params.sortOrder || 'desc';

  return { skip, take: limit, page, search, sortBy, sortOrder };
};

export const paginatedResponse = <T>(
  data: T[], 
  total: number, 
  { page, limit, search, sortBy, sortOrder }: PaginationParams
): PaginatedResult<T> => {
  return {
    data,
    meta: {
      total,
      page: Number(page) || 1,
      lastPage: Math.ceil(total / (Number(limit) || 10)),
      limit: Number(limit) || 10,
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder })
    }
  };
}; 