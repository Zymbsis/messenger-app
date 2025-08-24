import { toast } from 'sonner';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import { axiosInstance } from '../axios-instance';

type BaseQuery = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
};

type ApiResult = AxiosResponse['data'];

type ApiError = {
  status: number | undefined;
  data: { detail?: string } | string;
};

export const axiosBaseQuery =
  (): BaseQueryFn<BaseQuery, ApiResult, ApiError> =>
  async ({ url, method, data, params }) => {
    try {
      return await axiosInstance({ url, method, data, params });
    } catch (axiosError) {
      const err = axiosError as AxiosError<{ detail?: string }>;

      toast.error(err.response?.data?.detail || err.message);

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
