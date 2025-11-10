import { useQuery } from "@tanstack/react-query";
import { fetchServerRoomEquipment } from "../api/serverRoomEquipmentApi";

/**
 * 서버실 장비 데이터를 가져오는 커스텀 훅
 * React Query를 사용하여 중복 호출 방지 및 캐싱
 *
 * @example
 * const { equipment, gridConfig, loading, error, refetch } = useServerRoomEquipment(serverRoomId);
 */
export function useServerRoomEquipment(serverRoomId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["serverRoomEquipment", serverRoomId],
    queryFn: () => fetchServerRoomEquipment(serverRoomId!),
    enabled: !!serverRoomId, // serverRoomId가 있을 때만 실행
  });

  return {
    equipment: data?.equipment ?? [],
    gridConfig: data?.gridConfig ?? null,
    loading: isLoading,
    error: error as Error | null,
    refetch,
  };
}
