import client from "@/api/client";
import type { EquipmentType, EquipmentStatus } from "../types";

export interface GetRackEquipmentsParmas {
  status?: EquipmentStatus;
  type?: EquipmentType;
  sortBy?: string;
}

export const getRackEquipments = async (
  rackId: number,
  params?: GetRackEquipmentsParmas
) => {
  const response = await client.get(`/equipments/rack/${rackId}`, { params });
  return response.data;
};
