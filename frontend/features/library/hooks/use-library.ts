import { useQuery } from "@tanstack/react-query";
import { getLibrary } from "../api/library.api";

export const useLibrary = () =>
  useQuery({
    queryKey: ["orders", "library"],
    queryFn: getLibrary,
  });