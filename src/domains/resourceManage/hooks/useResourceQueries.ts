import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getResourceList,
  createResource,
  updateResource,
  deleteResource,
  deleteMultipleResources,
  getResourceById,
  getDatacenters,
  getRacksByDatacenter,
} from "../api/resourceManageApi";
import type {
  ResourceListFilters,
  Datacenter,
  Rack,
  Resource,
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
    staleTime: 1000 * 60 * 5,
  });
};

// --- 전산실 목록 조회 훅 ---
export const useGetDatacenters = () => {
  // 반환 데이터 타입은 Datacenter[] 입니다.
  return useQuery<Datacenter[], Error>({
    queryKey: [DATACENTER_QUERY_KEY],
    queryFn: getDatacenters,
    staleTime: 1000 * 60 * 5,
  });
};

// --- 랙 목록 조회 훅 ---
export const useGetRacksByDatacenter = (datacenterId: string | null) => {
  // 반환 데이터 타입은 Rack[] 입니다.
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

// --- 자원 상세 정보 조회 훅 (수정 모드용) ---
export const useGetResourceById = (resourceId: string | null) => {
  return useQuery<Resource, Error>({
    // 쿼리 키에 resourceId를 포함하여 고유하게 만듭니다.
    queryKey: [RESOURCE_QUERY_KEY, "detail", resourceId],
    queryFn: () => {
      // resourceId가 null이면 쿼리를 실행하지 않습니다 (enabled: false가 처리)
      // 하지만 타입스크립트를 위해 null 체크를 추가합니다.
      if (!resourceId) {
        return Promise.reject(new Error("Resource ID is required"));
      }
      return getResourceById(resourceId);
    },
    // resourceId가 'truthy' (null/undefined가 아님)일 때만 쿼리 실행
    enabled: !!resourceId,
    // 모달이 열릴 때만 데이터를 가져오면 되므로,
    // 윈도우 포커스 시 자동 refetch 등을 비활성화합니다.
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1, // 실패 시 1번만 재시도
  });
};

// --- 기존 CUD 훅 ---
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createResource(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
      toast.success("새로운 자원이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("자원 생성 실패:", error);
      alert("자원 생성에 실패했습니다.");
      toast.error("자원 등록에 실패했습니다.");
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
      toast.success("자원 정보가 수정되었습니다.");
    },
    onError: (error) => {
      console.error("자원 수정 실패:", error);
      toast.error("자원 수정에 실패했습니다.");
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
      toast.success("자원이 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("자원 삭제 실패:", error);
      toast.error("자원 삭제에 실패했습니다.");
    },
  });
};

export const useDeleteMultipleResources = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteMultipleResources(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
      toast.success("선택한 자원이 모두 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("자원 대량 삭제 실패:", error);
      toast.error("자원 대량 삭제에 실패했습니다.");
    },
  });
};
