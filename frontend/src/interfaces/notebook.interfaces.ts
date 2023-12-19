export interface INotebook {
  id: number;
  marca: string;
  modelo: string;
  memoria: string;
  disco_rigido_id: number;
  placa_video: string;
  precio: number;
  urlImage: string | undefined;
  position?: number;
}

export interface INotebookPagination {
  data: INotebook[];
  total: number;
  limit: number;
  page: number;
  isLoading?: boolean;
}

export interface INotebookCreate {
  [key: string]: string | number | null;
  marca: string;
  modelo: string;
  memoria: string;
  disco_rigido_id: number;
  placa_video: string;
  precio: number;
  urlImage: string | null;
}