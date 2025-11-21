import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPlaceEquipments } from "../api/postPlaceEquipments";

interface PostPlaceEquipmentParams {
  rackId: number;
  id: number;
  data: {
    startUnit: number;
    unitSize: number;
  };
}

export const usePostPlaceEquipments = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ rackId, id, data }: PostPlaceEquipmentParams) =>
      postPlaceEquipments(rackId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rackEquipments", variables.rackId],
      });
    },
    onError: (error) => {
      console.error("장비 배치 실패:", error);
    },
  });

  return mutation;
};
