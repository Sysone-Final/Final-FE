import client from "@/api/client";

interface DeleteEquipmentsResponse {
  statusCode: number;
  message: string;
  data: null;
}

export const deleteRackEquipments = async (
  id: number
): Promise<DeleteEquipmentsResponse> => {
  const response = await client.delete<DeleteEquipmentsResponse>(
    `/equipments/${id}`
  );
  return response.data;
};
