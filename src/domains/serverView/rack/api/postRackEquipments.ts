import client from "@/api/client";
import type { Equipments } from "../types";

export type PostEquipmentRequest = Pick<
  Equipments,
  | "equipmentName"
  | "equipmentType"
  | "startUnit"
  | "unitSize"
  | "positionType"
  | "status"
> & {
  rackId: number;
  createdAt: Date;
  del_yn: "N" | "Y";
};

export interface PostEquipmentResponse {
  statusCode: number;
  message: string;
  data: Equipments;
}

export const postRackEquipment = async (
  equipment: PostEquipmentRequest
): Promise<PostEquipmentResponse> => {
  const response = await client.post<PostEquipmentResponse>(
    "/equipments",
    equipment
  );
  return response.data;
};
