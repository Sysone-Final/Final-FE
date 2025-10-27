// src/domains/resourceManage/hooks/useResourceQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResourceList,
  createResource,
  updateResource,
  deleteResource,
  deleteMultipleResources,
  getDatacenters,
  getRacksByDatacenter,
} from "../api/resourceManageApi";
import type {
  ResourceListFilters,
  //  타입 임포트
  Datacenter,
  Rack,
} from "../types/resource.types";

export const RESOURCE_QUERY_KEY = "resources";
export const DATACENTER_QUERY_KEY = "datacenters";
export const RACK_QUERY_KEY = "racks";

export const useGetResourceList = (
  page: number,
  size: number,
  filters: ResourceListFilters,
) => {
  return useQuery({
    queryKey: [RESOURCE_QUERY_KEY, page, size, filters],
    queryFn: () => getResourceList(page, size, filters),
    placeholderData: (previousData) => previousData,
  });
};

// --- 전산실 목록 조회 훅 ---
export const useGetDatacenters = () => {
  //  반환 데이터 타입은 Datacenter[] 입니다.
  return useQuery<Datacenter[], Error>({
    queryKey: [DATACENTER_QUERY_KEY],
    queryFn: getDatacenters,
    staleTime: 1000 * 60 * 5,
  });
};

// --- 랙 목록 조회 훅 ---
export const useGetRacksByDatacenter = (datacenterId: string | null) => {
  //  반환 데이터 타입은 Rack[] 입니다.
  return useQuery<Rack[], Error>({
    queryKey: [RACK_QUERY_KEY, datacenterId],
    queryFn: () => {
      if (!datacenterId) {
        return Promise.resolve([]);
      }
      return getRacksByDatacenter(datacenterId);
    },
    enabled: !!datacenterId,
    staleTime: 1000 * 60 * 5,
  });
};

// --- 기존 CUD 훅 ---
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createResource(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("자원 생성 실패:", error);
      alert("자원 생성에 실패했습니다.");
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateResource(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("자원 수정 실패:", error);
      alert("자원 수정에 실패했습니다.");
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("자원 삭제 실패:", error);
    },
  });
};

export const useDeleteMultipleResources = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteMultipleResources(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("자원 대량 삭제 실패:", error);
    },
  });
};
