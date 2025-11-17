import { useQuery } from "@tanstack/react-query";
import {
  getUnassignedEquipments,
  type GetUnassignedEquipmentsParams,
} from "../api/getUnassignedEquipments";

interface UseUnassignedEquipmentsOptions {
  params?: GetUnassignedEquipmentsParams;
  enabled?: boolean;
}

export const useUnassignedEquipments = (
  options: UseUnassignedEquipmentsOptions = {}
) => {
  const { params = {}, enabled = true } = options;

  return useQuery({
    queryKey: ["equipments", "unassigned", params],
    queryFn: () => getUnassignedEquipments(params),
    enabled,
    select: (data) => data.result.content,
  });
};
