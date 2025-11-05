import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanyDataCenters, createServerRoom } from "../api/serverRoomApi";
import type { CreateServerRoomRequest } from "../api/serverRoomApi";

/**
 * 회사의 전산실 목록 조회 query
 * @param companyId 회사 ID
 */
export const useServerRooms = (companyId: number) => {
  return useQuery({
    queryKey: ["serverRooms", companyId],
    queryFn: () => getCompanyDataCenters(companyId),
  });
};

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
