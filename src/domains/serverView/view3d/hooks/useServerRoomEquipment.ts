import { useState, useEffect } from "react";
import { fetchServerRoomEquipment } from "../api/serverRoomEquipmentApi";
import type { Equipment3D } from "../types";

/**
 * 서버실 장비 데이터를 가져오는 커스텀 훅
 *
 * @example
 * const { equipment, loading, error, refetch } = useServerRoomEquipment(datacenterId);
 */
export function useServerRoomEquipment(datacenterId: number | undefined) {
  const [equipment, setEquipment] = useState<Equipment3D[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!datacenterId) {
      setEquipment([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Fetching equipment for datacenter ID: ${datacenterId}`);
      const data = await fetchServerRoomEquipment(datacenterId);
      console.log(`✅ Loaded ${data.length} equipment items`);
      setEquipment(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch equipment"),
      );
      console.error("❌ Error fetching server room equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datacenterId]);

  return {
    equipment,
    loading,
    error,
    refetch: fetchData,
  };
}
