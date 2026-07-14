import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";
import { LibraryBook } from "../types/library.types";


export const getLibrary = async (): Promise<LibraryBook[]> => {
  const { data } = await api.get<LibraryBook[]>(ENDPOINTS.ORDERS.LIBRARY);
  return data;
};