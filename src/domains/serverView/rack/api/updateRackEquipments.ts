import client from "@/api/client";
import type { Equipments } from "../types";

export type UpdateRackEquipmentRequest = Pick<
  Equipments,
  | "equipmentName"
  | "equipmentType"
  | "startUnit"
  | "unitSize"
  | "positionType"
  | "status"
> & {
  rackId: number;
  updateAt: Date;
  del_yn: "N" | "Y";
};

export const updateRackEquipments = async (
  id: number,
  data: UpdateRackEquipmentRequest
) => {
  const response = await client.put(`/equipments/${id}`, data);
  return response.data;
};
