import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '../types';


const API_URL = import.meta.env.VITE_API_URL;

export const useVideos = () => {
  return useQuery<ApiResponse>({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        const error = new Error('An error occurred while fetching the data.');
        (error as any).status = response.status;
        (error as any).info = await response.json().catch(() => ({})); 
        throw error;
      }
      return response.json();
    },
    staleTime: Infinity,
  });
};