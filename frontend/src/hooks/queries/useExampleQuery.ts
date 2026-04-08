import { useQuery } from "@tanstack/react-query";

// Example query hook - replace with real API calls later
export function useExampleQuery() {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      // Mock data for now
      return {
        message: "TanStack Query is working!",
        timestamp: new Date().toISOString(),
      };
    },
  });
}
