export interface INotebook {
  [key: string]: string | number;
  id: number;
  marca: string;
  modelo: string;
  memoria: string;
  disco_rigido_id: number;
  placa_video: string;
  precio: number;
}

export interface INotebookPagination {
  data: INotebook[];
  total: number;
  limit: number;
  page: number;
  isLoading?: boolean;
}

export interface INotebookCreate {
  [key: string]: string | number;
  marca: string;
  modelo: string;
  memoria: string;
  disco_rigido_id: number;
  placa_video: string;
  precio: number;
}

// export interface IClientSearch {
//   dni?: string;
//   nombre?: string;
//   apellido?: string;
//   sexo?: string;
//   limit: number;
//   page: number;
// }

// export interface IClientFormSearch {
//   [key: string]: string | number;
//   dni: string;
//   nombre: string;
//   apellido: string;
//   sexo: string;
// }

// interface IUser {
//   createdAt: Date;
//   email: string;
//   updatedAt: Date;
//   username: string;
//   _id: string;
// }

// export interface IClient {
//   _id: string;
//   dni: number;
//   nombre: string;
//   apellido: string;
//   sexo: string;
//   telefono: number;
//   user: IUser;
//   createdAt?: Date;
//   updatedAt?: Date;
//   id?: number;
// }
