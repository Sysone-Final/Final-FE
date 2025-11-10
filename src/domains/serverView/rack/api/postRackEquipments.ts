import client from "@/api/client";
import type { Equipments } from "../types";

export type PostEquipmentRequest = Pick<
  Equipments,
  "equipmentName" | "equipmentType" | "startUnit" | "unitSize" | "status"
> & {
  rackId: number;
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
