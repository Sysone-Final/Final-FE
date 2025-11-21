import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEquipment } from "../api/updateEquipments";
import type { UpdateEquipmentRequest } from "../types";

interface UpdateEquipmentParams {
  id: number;
  data: UpdateEquipmentRequest;
}

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: UpdateEquipmentParams) =>
      updateEquipment(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["equipment", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["rackEquipments", variables.data.rackId],
      });

      console.log("장비 수정 성공:", response.status_message);
    },
    onError: (error) => {
      console.error("장비 수정 실패:", error);
    },
  });

  return mutation;
};
