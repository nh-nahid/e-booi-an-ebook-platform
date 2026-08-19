import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type { HomeResponse } from "../types/home.types";

// Fallback used only when the API can't be reached (e.g. the backend isn't
// running yet during `next build`'s static prerender of "/"). Without this,
// a build fails outright whenever the API is briefly unavailable. With
// `revalidate = 60` on the page, a real request will refetch and pick up
// live data shortly after the build/deploy anyway.
const EMPTY_HOME_RESPONSE: HomeResponse = {
  success: false,
  message: "Home data unavailable",
  data: {
    hero: { title: "", subtitle: "", description: "", image: "", button: { text: "", link: "" } },
    statistics: {
      totalBooks: 0,
      totalUsers: 0,
      totalAuthors: 0,
      totalCategories: 0,
      happyCustomers: 0,
    },
    categories: [],
    featuredBooks: [],
    latestBooks: [],
    bestSellingBooks: [],
    preOrderBooks: [],
  },
};

export const getHome = async (): Promise<HomeResponse> => {
  try {
    const { data } = await api.get<HomeResponse>(
      ENDPOINTS.HOME.GET_HOME
    );

    return data;
  } catch (error) {
    console.error("getHome: falling back to empty home data —", error);
    return EMPTY_HOME_RESPONSE;
  }
};