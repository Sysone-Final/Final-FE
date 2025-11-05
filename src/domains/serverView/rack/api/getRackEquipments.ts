import client from "@/api/client";
import type { EquipmentType, EquipmentStatus } from "../types";

export interface GetRackEquipmentsParams {
  status?: EquipmentStatus;
  type?: EquipmentType;
  sortBy?: string;
}

export const getRackEquipments = async (
  rackId: number,
  params?: GetRackEquipmentsParams
) => {
  const response = await client.get(`/equipments/rack/${rackId}`, { params });
  return response.data;
};
