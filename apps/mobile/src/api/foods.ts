import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./client";
import { Food } from "../types";

export const useFoods = () => {
  const api = useApi();
  return useQuery({ 
    queryKey: ["foods"], 
    queryFn: () => api.get("/foods").then(r => r.data as Food[]) 
  });
};

export const useSearchFoods = (query: string) => {
  const api = useApi();
  return useQuery({ 
    queryKey: ["foods", "search", query], 
    queryFn: () => api.get(`/foods/search?q=${query}`).then(r => r.data as Food[]),
    enabled: query.length > 0
  });
};

export const useFoodByBarcode = (barcode: string) => {
  const api = useApi();
  return useQuery({ 
    queryKey: ["foods", "barcode", barcode], 
    queryFn: () => api.get(`/foods/barcode/${barcode}`).then(r => r.data as Food),
    enabled: barcode.length > 0
  });
}; 