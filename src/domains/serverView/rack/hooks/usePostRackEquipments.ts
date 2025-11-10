import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRackEquipment } from "../api/postRackEquipments";
import type { PostEquipmentRequest } from "../api/postRackEquipments";

export const usePostEquipment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (equipment: PostEquipmentRequest) =>
      postRackEquipment(equipment),
    retry: false,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rackEquipments", variables.rackId],
      });
    },
    onError: (error) => {
      console.error("장비 생성 실패:", error);
    },
  });
  return mutation;
};
