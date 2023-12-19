import { AxiosResponse } from 'axios';
import { handleError } from '../helpers/handleError';
import axios from './axios';
import { ApiResponse, IDisk } from '../interfaces';

/**
 * Retrieves a paginated list of notebooks.
 * @param page - The page number.
 * @param pageSize - The number of notebooks per page.
 * @returns A promise that resolves to the paginated list of notebooks.
 */
export const getAllDisksApi = async (
): Promise<IDisk[]> => {
  try {
    let resp: AxiosResponse<ApiResponse> | null = null;
    resp = await axios.get<ApiResponse>('/disks');
    const response: IDisk[] = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IDisk[]>(handleError(error));
  }
};