import { AxiosResponse } from 'axios';
import { handleError } from '../helpers/handleError';
import axios from './axios';
import { ApiResponse, INotebook, INotebookCreate, INotebookPagination } from '../interfaces';
/**
 * Creates a new notebook.
 * @param body - The notebook data.
 * @returns A promise that resolves to the created notebook.
 */
export const createNotebookApi = async (body: INotebookCreate): Promise<INotebook> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>('/notebook', body);
    const response: INotebook = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<INotebook>(handleError(error));
  }
};

/**
 * Retrieves a paginated list of notebooks.
 * @param page - The page number.
 * @param pageSize - The number of notebooks per page.
 * @returns A promise that resolves to the paginated list of notebooks.
 */
export const getAllNotebooksApi = async (
  page?: number,
  pageSize?: number
): Promise<INotebookPagination> => {
  try {
    let resp: AxiosResponse<ApiResponse> | null = null;
    if (!page && !pageSize) resp = await axios.get<ApiResponse>('/notebook');
    else resp = await axios.get<ApiResponse>(`/notebook/search?page=${page}&limit=${pageSize}`);
    const response: INotebookPagination = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<INotebookPagination>(handleError(error));
  }
};

/**
 * Deletes a notebook by ID.
 * @param id - The ID of the notebook to delete.
 * @returns A promise that resolves to an array of the remaining notebooks.
 */
export const deleteNotebookApi = async (id: number): Promise<INotebook[]> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.delete<ApiResponse>(`/notebook/${id}`);
    const response: INotebook[] = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<INotebook[]>(handleError(error));
  }
};

/**
 * Updates a notebook by ID.
 * @param id - The ID of the notebook to update.
 * @param body - The updated notebook data.
 * @returns A promise that resolves to the updated notebook.
 */
export const updateNotebookApi = async (id: number, body: INotebookCreate): Promise<INotebook> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.put<ApiResponse>(`/notebook/${id}`, body);
    const response: INotebook = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<INotebook>(handleError(error));
  }
};

/**
 * Retrieves a notebook by ID.
 * @param id - The ID of the notebook to retrieve.
 * @returns A promise that resolves to the retrieved notebook.
 */
export const getNotebookByIdApi = async (id: number): Promise<INotebook> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(`/notebook/${id}`);
    const response: INotebook = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<INotebook>(handleError(error));
  }
};

/**
 * Retrieves the notebooks associated with the current user.
 * @returns A promise that resolves to an array of notebooks.
 */

export const getNotebookByUserApi = async (): Promise<INotebook[]> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>('/notebook');
    const response: INotebook[] = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<INotebook[]>(handleError(error));
  }
};

/**
 * Searches for notebooks based on a search query.
 * @param search - The search query.
 * @returns A promise that resolves to the paginated list of notebooks that match the search query.
 */
export const getNotebookSearchApi = async (search: string): Promise<INotebookPagination> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>(`/notebook/search?${search}`);
    const response: INotebookPagination = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<INotebookPagination>(handleError(error));
  }
};
