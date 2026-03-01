import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { ApiResponse } from '../types';


const API_URL = import.meta.env.VITE_API_URL;

export const useVideos = (): UseQueryResult<ApiResponse, Error> => {
  return useQuery<ApiResponse>({
    queryKey: ['videos'],
    queryFn: async () => {
      // 1. Guard against missing URL to prevent browser-level crashes
      if (!API_URL) {
        throw new Error("API URL is missing. Check your .env file.");
      }

      const response = await fetch(API_URL);

      // 2. Handle HTTP errors (404, 500) manually 
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `Error ${response.status}: Failed to fetch`);
        (error as any).status = response.status;
        throw error;
      }

      return response.json();
    },
    // Set to false for testing so you don't have to wait for retries
    retry: false, 
    staleTime: Infinity,
  });
};