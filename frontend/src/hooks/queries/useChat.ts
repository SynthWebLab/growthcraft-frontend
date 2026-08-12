import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";

export const chatKeys = {
  all: ["chat"] as const,
  history: (otherUserId: string) => [...chatKeys.all, "history", otherUserId] as const,
};

export function useChatHistory(otherUserId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: chatKeys.history(otherUserId),
    queryFn: () => chatService.getChatHistory(otherUserId),
    enabled: !!otherUserId && enabled,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ receiverId, message }: { receiverId: string; message: string }) =>
      chatService.sendMessage(receiverId, message),
    onSuccess: (response, variables) => {
      // Invalidate target chat history to fetch newest status from backend
      void queryClient.invalidateQueries({
        queryKey: chatKeys.history(variables.receiverId),
      });
    },
  });
}
