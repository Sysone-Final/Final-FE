import { useQuery } from "@tanstack/react-query";
import {
  getRackEquipments,
  type GetRackEquipmentsParams,
} from "../api/getRackEquipments";
import type { Equipments } from "../types";

interface RackEquipmentResponse {
  status: number;
  message: string;
  data: Equipments[];
}

export const useGetRackEquipments = (
  rackId: number,
  params?: GetRackEquipmentsParams
) => {
  const { data, isLoading, error } = useQuery<RackEquipmentResponse>({
    queryKey: ["rackEquipments", rackId, params],
    queryFn: () => getRackEquipments(rackId, params),
    enabled: !!rackId,
  });
  return { data, isLoading, error };
};
