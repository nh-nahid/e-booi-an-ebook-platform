import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type { HomeResponse } from "../types/home.types";

export const getHome = async (): Promise<HomeResponse> => {
  const { data } = await api.get<HomeResponse>(
    ENDPOINTS.HOME.GET_HOME
  );

  return data;
};