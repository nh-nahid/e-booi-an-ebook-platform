import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLibrary, setLibraryHidden } from "../api/library.api";

export const useSetLibraryHidden = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, hide }: { bookId: string; hide: boolean }) =>
      setLibraryHidden(bookId, hide),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders", "library"] }),
  });
};

export const useLibrary = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["orders", "library"],
    queryFn: getLibrary,
    // Requires auth — callers that render for guests too (e.g. BookCard)
    // should pass `{ enabled: !!user }` so it never fires for a logged-out
    // visitor.
    enabled: options?.enabled ?? true,
  });