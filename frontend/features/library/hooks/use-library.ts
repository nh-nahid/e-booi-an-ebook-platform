import { useQuery } from "@tanstack/react-query";
import { getLibrary } from "../api/library.api";

export const useLibrary = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["orders", "library"],
    queryFn: getLibrary,
    // Requires auth — callers that render for guests too (e.g. BookCard)
    // should pass `{ enabled: !!user }` so it never fires for a logged-out
    // visitor.
    enabled: options?.enabled ?? true,
  });