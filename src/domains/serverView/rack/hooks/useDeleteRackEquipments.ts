import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRackEquipments } from "../api/deleteRackEquipments";
import type { RackEquipmentsResult } from "../types";

interface RackEquipmentResponse {
  status_code: number;
  status_message: string;
  result: RackEquipmentsResult;
}

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

      const previousData = queryClient.getQueryData<RackEquipmentResponse>([
        "rackEquipments",
        params.rackId,
      ]);

      queryClient.setQueryData<RackEquipmentResponse>(
        ["rackEquipments", params.rackId],
        (old) => {
          if (!old?.result?.equipments) {
            return old;
          }

          return {
            ...old,
            result: {
              ...old.result,
              equipments: old.result.equipments.filter(
                (d) => d.id !== params.id
              ),
            },
          };
        }
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
