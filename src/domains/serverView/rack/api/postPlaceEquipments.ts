import client from "@/api/client";

interface postPlaceEquipmentsRequest {
  startUnit: number;
  unitSize: number;
}

export const postPlaceEquipments = async (
  rackId: number,
  id: number,
  data: postPlaceEquipmentsRequest
) => {
  const response = await client.post(
    `/racks/${rackId}/equipment/${id}/place`,
    data
  );
  return response.data;
};
