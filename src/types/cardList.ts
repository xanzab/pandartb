export interface Item {
  id: string;
  date: string;
  title: string;
  message: string;
  imgUrl?: string;
}

export interface Meta {
  count: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface ListApiResponse {
  data: Item[];
  meta: Meta;
}