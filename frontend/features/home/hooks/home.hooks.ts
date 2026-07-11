import { useQuery } from "@tanstack/react-query";

import { getHome } from "../api/home.api";

export const useHome = () => {
  return useQuery({
    queryKey: ["home"],
    queryFn: getHome,
  });
};