import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getUnassignedEquipments,
  type GetUnassignedEquipmentsParams,
} from "../api/getUnassignedEquipments";

interface UseUnassignedEquipmentsOptions {
  params?: GetUnassignedEquipmentsParams;
  enabled?: boolean;
}

export const useUnassignedEquipments = (
  options: UseUnassignedEquipmentsOptions = {}
) => {
  const { params = {}, enabled = true } = options;

  return useInfiniteQuery({
    queryKey: ["equipments", "unassigned", params],
    queryFn: ({ pageParam = 0 }) =>
      getUnassignedEquipments({ ...params, page: pageParam }),
    enabled,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.result.last ? undefined : lastPage.result.number + 1;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      allEquipments: data.pages.flatMap((page) => page.result.content),
    }),
  });
};
