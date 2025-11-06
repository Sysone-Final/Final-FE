import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRackEquipments } from "../api/deleteRackEquipments";

export const useDeleteEquipments = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteRackEquipments(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rackEquipments"] });
    },
  });
  return mutation;
};
