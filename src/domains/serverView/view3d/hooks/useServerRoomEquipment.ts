import { useState, useEffect } from "react";
import { fetchServerRoomEquipment } from "../api/serverRoomEquipmentApi";
import type { Equipment3D } from "../types";

/**
 * 서버실 장비 데이터를 가져오는 커스텀 훅
 *
 * @example
 * const { equipment, gridConfig, loading, error, refetch } = useServerRoomEquipment(serverRoomId);
 */
export function useServerRoomEquipment(serverRoomId: string | undefined) {
  const [equipment, setEquipment] = useState<Equipment3D[]>([]);
  const [gridConfig, setGridConfig] = useState<{ rows: number; columns: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!serverRoomId) {
      setEquipment([]);
      setGridConfig(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchServerRoomEquipment(serverRoomId);
      setEquipment(data.equipment);
      setGridConfig(data.gridConfig);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch equipment"),
      );
      console.error("Error fetching server room equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverRoomId]);

  return {
    equipment,
    gridConfig,
    loading,
    error,
    refetch: fetchData,
  };
}
