/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse {
  status: string;
  data?: any;
  message?: string;
}

export interface HeaderToken {
  headers: {
    Authorization: string;
  };
}
