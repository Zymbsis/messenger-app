import type { AxiosError } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { toast } from 'sonner';

import { axiosInstance } from '../axios-instance';

import type { ApiError, ApiResult, BaseQuery } from '../../types/types';

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
