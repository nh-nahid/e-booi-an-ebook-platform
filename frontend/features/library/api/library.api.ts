import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";
import { LibraryBook } from "../types/library.types";


export const setLibraryHidden = async (bookId: string, hide: boolean) => {
  await api.patch(`/orders/library/${bookId}/${hide ? "hide" : "unhide"}`);
};

export const getLibrary = async (): Promise<LibraryBook[]> => {
  const { data } = await api.get<LibraryBook[]>(ENDPOINTS.ORDERS.LIBRARY);
  return data;
};