import { AxiosResponse } from 'axios';
import { IUserPayload, payloadLogin, payloadRegister } from '../interfaces/auth.interfaces';
import { handleError } from '../helpers/handleError';
import axios from './axios';
import { ApiResponse } from '../interfaces';

/**
 * Function that makes a login API request.
 *
 * @param body - The payload containing the login data.
 * @returns A promise that resolves with the user payload on success.
 */
export const loginApi = async (body: payloadLogin): Promise<IUserPayload> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>('/auth/login', body);
    const response: IUserPayload = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IUserPayload>(handleError(error));
  }
};

/**
 * Function that makes a session registration API request.
 * @param body The payload containing the register data.
 * @returns A promise that resolves with the user payload on success.
 */
export const registerApi = async (body: payloadRegister): Promise<IUserPayload> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>('/auth/register', body);
    const response: IUserPayload = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IUserPayload>(handleError(error));
  }
};

/**
 * Function that performs a token verification API request
 * @returns A promise that resolves with the user payload on success.
 */
export const verifyTokenRequest = async (): Promise<IUserPayload> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>('/auth/verify');
    const response: IUserPayload = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IUserPayload>(handleError(error));
  }
};

/**
 * Function that makes an API request for session logout
 * @returns A promise that resolves with the user payload on success.
 */
export const logoutApi = async (): Promise<IUserPayload> => {
  try {
    const resp: AxiosResponse<ApiResponse> = await axios.get<ApiResponse>('/auth/logout');
    const response: IUserPayload = resp.data.data;
    return response;
  } catch (error: unknown) {
    return Promise.reject<IUserPayload>(handleError(error));
  }
};
