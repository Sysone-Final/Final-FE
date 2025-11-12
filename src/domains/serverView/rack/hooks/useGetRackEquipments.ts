import { useQuery } from "@tanstack/react-query";
import {
  getRackEquipments,
  type GetRackEquipmentsParams,
} from "../api/getRackEquipments";
import type { RackEquipmentsResult } from "../types";

interface RackEquipmentResponse {
  status_code: number;
  status_message: string;
  result: RackEquipmentsResult;
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
    equipments: query.data?.result?.equipments || [],
    rack: query.data?.result?.rack,
    totalCount: query.data?.result?.totalEquipmentCount,
    isLoading: query.isLoading,
    error: query.error,
  };
};
