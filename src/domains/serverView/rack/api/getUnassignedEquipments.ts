import client from "@/api/client";
import type { UnassignedEquipment } from "../types";

export interface GetUnassignedEquipmentsParams {
  page?: number;
  onlyUnassigned?: boolean;
}

interface PaginatedResponse {
  content: UnassignedEquipment[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface GetUnassignedEquipmentsResponse {
  status_code: number;
  status_message: string;
  result: PaginatedResponse;
}

export const getUnassignedEquipments = async (
  params: GetUnassignedEquipmentsParams = {}
) => {
  const response = await client.get<GetUnassignedEquipmentsResponse>(
    "/equipments",
    {
      params: {
        size: 5,
        onlyUnassigned: true,
        ...params,
      },
    }
  );
  return response.data;
};
