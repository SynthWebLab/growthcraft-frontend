import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const chatService = {
  /** Get chat messages between current user and receiverId */
  getChatHistory: async (receiverId: string): Promise<ApiResponse<{ messages: ChatMessage[] }>> => {
    return apiClient.get<ApiResponse<{ messages: ChatMessage[] }>>(
      API_ENDPOINTS.chats.messages(receiverId)
    );
  },

  /** Send a new message to receiverId */
  sendMessage: async (receiverId: string, message: string): Promise<ApiResponse<{ message: ChatMessage }>> => {
    return apiClient.post<ApiResponse<{ message: ChatMessage }>>(
      API_ENDPOINTS.chats.send,
      { receiverId, message }
    );
  },
};
