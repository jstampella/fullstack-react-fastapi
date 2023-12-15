export interface IClientCreate {
  [key: string]: string | number;
  dni: string;
  nombre: string;
  apellido: string;
  sexo: string;
  telefono: string;
}
export interface IClientSearch {
  dni?: string;
  nombre?: string;
  apellido?: string;
  sexo?: string;
  limit: number;
  page: number;
}

export interface IClientFormSearch {
  [key: string]: string | number;
  dni: string;
  nombre: string;
  apellido: string;
  sexo: string;
}

interface IUser {
  createdAt: Date;
  email: string;
  updatedAt: Date;
  username: string;
  _id: string;
}

export interface IClient {
  _id: string;
  dni: number;
  nombre: string;
  apellido: string;
  sexo: string;
  telefono: number;
  user: IUser;
  createdAt?: Date;
  updatedAt?: Date;
  id?: number;
}

export interface IClientPagination {
  data: IClient[];
  total: number;
  limit: number;
  page: number;
  isLoading?: boolean;
}
