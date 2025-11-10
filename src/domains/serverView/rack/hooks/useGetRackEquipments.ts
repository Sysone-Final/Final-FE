import { useQuery } from "@tanstack/react-query";
import {
  getRackEquipments,
  type GetRackEquipmentsParams,
} from "../api/getRackEquipments";
import type { Equipments } from "../types";

interface RackEquipmentResponse {
  status_code: number;
  status_message: string;
  result: Equipments[];
}

export const useGetRackEquipments = (
  rackId: number,
  params?: GetRackEquipmentsParams
) => {
  const query = useQuery<RackEquipmentResponse>({
    queryKey: ["rackEquipments", rackId, params],
    queryFn: () => getRackEquipments(rackId, params),
    enabled: !!rackId,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
