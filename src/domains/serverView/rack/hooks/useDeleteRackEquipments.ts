import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRackEquipments } from "../api/deleteRackEquipments";
import type { Equipments } from "../types";

export const useDeleteEquipments = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteRackEquipments(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["rackEquipments"] });

      const previousData = queryClient.getQueryData<Equipments[]>([
        "rackEquipments",
      ]);

      queryClient.setQueryData<Equipments[]>(
        ["rackEquipments"],
        (old) => old?.filter((d) => d.equipmentId !== id) || []
      );

      return { previousData };
    },
    retry: false,

    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["rackEquipments"], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rackEquipments"] });
    },
  });
  return mutation;
};
