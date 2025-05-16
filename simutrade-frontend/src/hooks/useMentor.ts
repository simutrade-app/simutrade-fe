import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AIService from '../services/AIService';
import type { ChatData, ChatResponse } from '../services/AIService';

/**
 * Hook untuk mengambil riwayat chat
 */
export function useChatHistory() {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: AIService.getAllChats,
    select: (res: {
      status: string;
      message: string;
      data: { chatData: ChatData[] };
    }) => res,
  });
}

/**
 * Hook untuk mengirim pesan baru
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AIService.createChat,
    onSuccess: () => {
      // Invalidate dan refetch cache setelah pesan dikirim
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });
}

/**
 * Hook untuk mengambil chat berdasarkan ID
 */
export function useChatById(id: string) {
  return useQuery({
    queryKey: ['chat', id],
    queryFn: () => AIService.getChatById(id),
    enabled: !!id, // Hanya jalankan query jika id tersedia
  });
}
