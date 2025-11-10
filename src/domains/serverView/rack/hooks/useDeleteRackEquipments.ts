import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRackEquipments } from "../api/deleteRackEquipments";
import type { Equipments } from "../types";

interface DeleteEquipmentParams {
  id: number;
  rackId: number;
}

export const useDeleteEquipments = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: DeleteEquipmentParams) =>
      deleteRackEquipments(params.id),

    onMutate: async (params: DeleteEquipmentParams) => {
      await queryClient.cancelQueries({
        queryKey: ["rackEquipments", params.rackId],
      });

      const previousData = queryClient.getQueryData<{ data: Equipments[] }>([
        "rackEquipments",
        params.rackId,
      ]);

      queryClient.setQueryData<{ data: Equipments[] }>(
        ["rackEquipments", params.rackId],
        (old) => ({
          ...old,
          data: old?.data?.filter((d) => d.id !== params.id) || [],
        })
      );

      return { previousData, rackId: params.rackId };
    },
    retry: false,

    onError: (_, __, context) => {
      if (context?.previousData && context?.rackId) {
        queryClient.setQueryData(
          ["rackEquipments", context.rackId],
          context.previousData
        );
      }
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rackEquipments", variables.rackId],
      });
    },
  });
  return mutation;
};
