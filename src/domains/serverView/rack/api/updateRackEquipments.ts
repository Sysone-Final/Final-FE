import client from "@/api/client";
import type { Equipments } from "../types";

export type UpdateRackEquipmentRequest = Pick<
  Equipments,
  "equipmentName" | "equipmentType" | "startUnit" | "unitSize" | "status"
> & {
  rackId: number;
};

export const updateRackEquipments = async (
  id: number,
  data: UpdateRackEquipmentRequest
) => {
  const response = await client.put(`/equipments/${id}`, data);
  return response.data;
};
