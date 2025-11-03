import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerRoom } from "../api/serverRoomApi";
import type { CreateServerRoomRequest } from "../api/serverRoomApi";

/**
 * 서버실 생성 mutation
 */
export const useCreateServerRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServerRoomRequest) => createServerRoom(data),
    onSuccess: () => {
      // 서버실 목록 쿼리 무효화하여 재조회
      queryClient.invalidateQueries({ queryKey: ["serverRooms"] });
    },
  });
};
