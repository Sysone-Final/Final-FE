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
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["serverRoomEquipment", serverRoomId],
    queryFn: () => fetchServerRoomEquipment(serverRoomId!),
    enabled: !!serverRoomId, // serverRoomId가 있을 때만 실행
    staleTime: 0, // 데이터를 항상 stale로 간주하여 재진입 시 새로 fetch
    refetchOnMount: 'always', // 마운트될 때마다 항상 새로운 데이터 fetch
  });

  return {
    equipment: data?.equipment ?? [],
    gridConfig: data?.gridConfig ?? null,
    serverRoomName: data?.serverRoomName ?? null,
    loading: isLoading,
    isFetching,
    error: error as Error | null,
    refetch,
  };
}
