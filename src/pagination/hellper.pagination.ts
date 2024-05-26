export type TPagination = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
  skip: number;
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type TDefaultPagination = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
  skip: number;
};

export type TArticklePagination = TDefaultPagination & {
  searchEmailTerm: string;
};

export const getDefaultPagination = (query: any): TDefaultPagination => {
  const defaultValues: TDefaultPagination = {
    sortBy: 'createdAt',
    sortDirection: 'desc', //
    pageNumber: 1, //
    pageSize: 10, //
    skip: 0, //
  };

  if (query.sortBy) {
    defaultValues.sortBy = query.sortBy;
  }

  if (query.sortDirection && query.sortDirection === 'asc') {
    defaultValues.sortDirection = query.sortDirection;
  }

  if (query.pageNumber && query.pageNumber > 0) {
    defaultValues.pageNumber = +query.pageNumber;
  }

  if (query.pageSize && query.pageSize > 0) {
    defaultValues.pageSize = +query.pageSize;
  }

  defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize;
  return defaultValues;
};

export const getArticklePagination = (query: any): TArticklePagination => {
  const defaultValues: TArticklePagination = {
    ...getDefaultPagination(query),
    searchEmailTerm: '',
  };
  if (query.searchEmailTerm)
    defaultValues.searchEmailTerm = query.searchEmailTerm;

  return defaultValues;
};
