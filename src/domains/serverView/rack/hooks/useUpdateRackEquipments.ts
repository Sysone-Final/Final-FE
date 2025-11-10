import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateRackEquipments,
  type UpdateRackEquipmentRequest,
} from "../api/updateRackEquipments";
import type { Equipments } from "../types";

export const useUpdateRackEquipments = () => {
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

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: ["rackEquipments", data.rackId],
      });

      const previousData =
        queryClient.getQueryData<Equipments[]>([
          "rackEquipments",
          data.rackId,
        ]) || [];

      queryClient.setQueryData<Equipments[]>(
        ["rackEquipments", data.rackId],
        (old) => {
          if (!Array.isArray(old)) {
            console.warn("캐시 데이터가 배열이 아닙니다:", old);
            return [];
          }

          return old.map((item) =>
            item.id === id ? { ...item, ...data } : item
          );
        }
      );

      return { previousData, rackId: data.rackId };
    },

    retry: false,
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
    onError: (error, _, context) => {
      console.error("장비 수정 실패", error);
      if (context?.previousData) {
        queryClient.setQueryData(
          ["rackEquipments", context.rackId],
          context.previousData
        );
      }
    },
  });
  return mutation;
};
