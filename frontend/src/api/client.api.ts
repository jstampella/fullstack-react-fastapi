import { AxiosResponse } from 'axios';
import { handleError } from '../helpers/handleError';
import axios from './axios';
import { ApiResponse, IClient, IClientCreate, IClientPagination } from '../interfaces';

/**
 * Creates a new client.
 * @param body - The client data.
 * @returns A promise that resolves to the created client.
 */
export const createClientApi = async (body: IClientCreate): Promise<IClient> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>('/client/', body);
    const response: IClient = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IClient>(handleError(error));
  }
};

/**
 * Retrieves a paginated list of clients.
 * @param page - The page number.
 * @param pageSize - The number of clients per page.
 * @returns A promise that resolves to the paginated list of clients.
 */
export const getAllClientsApi = async (
  page?: number,
  pageSize?: number
): Promise<IClientPagination> => {
  try {
    let resp: AxiosResponse<ApiResponse> | null = null;
    if (!page && !pageSize) resp = await axios.get<ApiResponse>('/client/all');
    else resp = await axios.get<ApiResponse>(`/client/all?page=${page}&limit=${pageSize}`);
    const response: IClientPagination = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IClientPagination>(handleError(error));
  }
};

/**
 * Deletes a client by ID.
 * @param id - The ID of the client to delete.
 * @returns A promise that resolves to an array of the remaining clients.
 */
export const deleteClientApi = async (id: string): Promise<IClient[]> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.delete<ApiResponse>(`/client/${id}`);
    const response: IClient[] = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IClient[]>(handleError(error));
  }
};

/**
 * Updates a client by ID.
 * @param id - The ID of the client to update.
 * @param body - The updated client data.
 * @returns A promise that resolves to the updated client.
 */
export const updateClientApi = async (id: string, body: IClientCreate): Promise<IClient> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.put<ApiResponse>(`/client/${id}`, body);
    const response: IClient = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IClient>(handleError(error));
  }
};

/**
 * Retrieves a client by ID.
 * @param id - The ID of the client to retrieve.
 * @returns A promise that resolves to the retrieved client.
 */
export const getClientByIdApi = async (id: string): Promise<IClient> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(`/client/${id}`);
    const response: IClient = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IClient>(handleError(error));
  }
};

/**
 * Retrieves the clients associated with the current user.
 * @returns A promise that resolves to an array of clients.
 */

export const getClientByUserApi = async (): Promise<IClient[]> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>('/client');
    const response: IClient[] = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IClient[]>(handleError(error));
  }
};

/**
 * Searches for clients based on a search query.
 * @param search - The search query.
 * @returns A promise that resolves to the paginated list of clients that match the search query.
 */
export const getClientSearchApi = async (search: string): Promise<IClientPagination> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(`/client/all${search}`);
    const response: IClientPagination = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IClientPagination>(handleError(error));
  }
};
