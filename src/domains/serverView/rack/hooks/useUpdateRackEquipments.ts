import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateRackEquipments,
  type UpdateRackEquipmentRequest,
} from "../api/updateRackEquipments";

export const useUpdateRackEquipmetns = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateRackEquipmentRequest;
    }) => {
      return updateRackEquipments(id, data);
    },
    onSuccess: (_, variables) => {
      if (variables.data?.rackId) {
        queryClient.invalidateQueries({
          queryKey: ["rackEquipments", variables.data.rackId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["rackEquipments"] });
      }
      console.log("장비 수정 성공");
    },
    onError: (error) => {
      console.error("장비 수정 실패", error);
    },
  });
  return mutation;
};
