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
  updateMultipleResourceStatus,
} from "../api/resourceManageApi";
import type {
  ResourceListFilters,
  Datacenter,
  Rack,
  Resource,
  ResourceStatus,
  PaginatedResourceResponse,
} from "../types/resource.types";

// const USE_MOCK_DATA = true;
const USE_MOCK_DATA = false;

import {
  MOCK_DATA,
  MOCK_DATACENTERS,
  MOCK_RACKS,
  mockDeleteResource,
  mockDeleteMultipleResources,
  mockUpdateMultipleResourceStatus,
} from "../api/resourceManageApi.mock";

export const RESOURCE_QUERY_KEY = "resources";
export const DATACENTER_QUERY_KEY = "datacenters";
export const RACK_QUERY_KEY = "racks";

// 자원 목록 조회 훅
export const useGetResourceList = (
  page: number,
  size: number,
  filters: ResourceListFilters
) => {
  return useQuery({
    queryKey: [RESOURCE_QUERY_KEY, page, size, filters],
    queryFn: () => {
      // queryFn 내부에서 mock 체크
      if (USE_MOCK_DATA) {
        console.warn("Using MOCK data for useGetResourceList");

        let filteredData = MOCK_DATA;
        const keyword = filters.keyword?.toLowerCase();

        if (keyword) {
          filteredData = filteredData.filter(
            (r) =>
              r.equipmentName.toLowerCase().includes(keyword) ||
              (r.modelName && r.modelName.toLowerCase().includes(keyword)) ||
              (r.ipAddress && r.ipAddress.includes(keyword))
          );
        }
        if (filters.status) {
          filteredData = filteredData.filter(
            (r) => r.status === filters.status
          );
        }
        if (filters.type) {
          filteredData = filteredData.filter(
            (r) => r.equipmentType === filters.type
          );
        }
        if (filters.datacenterId) {
          filteredData = filteredData.filter(
            (r) => r.datacenterId === filters.datacenterId
          );
        }

        const start = page * size;
        const end = start + size;
        const paginatedContent = filteredData.slice(start, end);
        const totalPages = Math.ceil(filteredData.length / size);

        const mockPaginatedResponse: PaginatedResourceResponse = {
          content: paginatedContent,
          totalElements: filteredData.length,
          totalPages: totalPages,
          last: end >= filteredData.length,
          size: size,
          number: page,
        };

        return Promise.resolve(mockPaginatedResponse);
      }

      // 실제 API 호출
      return getResourceList(page, size, filters);
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};

//  전산실 목록 조회 훅
export const useGetDatacenters = () => {
  return useQuery<Datacenter[], Error>({
    queryKey: [DATACENTER_QUERY_KEY],
    queryFn: () => {
      if (USE_MOCK_DATA) {
        console.warn("Using MOCK data for useGetDatacenters");
        return Promise.resolve(MOCK_DATACENTERS as Datacenter[]);
      }
      return getDatacenters();
    },
    staleTime: 1000 * 60 * 5,
  });
};

//  랙 목록 조회 훅
export const useGetRacksByDatacenter = (datacenterId: number | null) => {
  return useQuery<Rack[], Error>({
    queryKey: [RACK_QUERY_KEY, datacenterId],
    queryFn: () => {
      if (USE_MOCK_DATA) {
        console.warn("Using MOCK data for useGetRacksByDatacenter");
       const filteredRacks = datacenterId !== null
          ? MOCK_RACKS.filter((r) => r.datacenterId === datacenterId)
          : [];
        return Promise.resolve(filteredRacks as Rack[]);
      }

      if (!datacenterId) {
        return Promise.resolve([]);
      }
      return getRacksByDatacenter(datacenterId);
    },
    enabled: !!datacenterId,
    staleTime: 1000 * 60 * 5,
  });
};

//  자원 상세 정보 조회 훅
export const useGetResourceById = (resourceId: number | null) => {
  return useQuery<Resource, Error>({
    queryKey: [RESOURCE_QUERY_KEY, "detail", resourceId],
    queryFn: () => {
      if (USE_MOCK_DATA) {
        console.warn("Using MOCK data for useGetResourceById");
        const resource = resourceId
          ? MOCK_DATA.find((r) => r.id === resourceId)
          : undefined;

        if (!resource && resourceId) {
          return Promise.reject(new Error("Resource not found"));
        }
        return Promise.resolve(resource as Resource);
      }

      if (!resourceId) {
        return Promise.reject(new Error("Resource ID is null"));
      }
      return getResourceById(resourceId);
    },
    enabled: !!resourceId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

// --- CUD 훅들은 그대로 유지 ---
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Resource) => createResource(data),
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
    mutationFn: ({ id, data }: { id: number; data: Resource }) =>
      updateResource(id, data),
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
    mutationFn: (id: number) => {
      if (USE_MOCK_DATA) {
        mockDeleteResource(id);
        return Promise.resolve();
      }
      return deleteResource(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
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
    mutationFn: (ids: number[]) => {
      if (USE_MOCK_DATA) {
        mockDeleteMultipleResources(ids);
        return Promise.resolve();
      }
      return deleteMultipleResources(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("자원 대량 삭제 실패:", error);
      toast.error("자원 대량 삭제에 실패했습니다.");
    },
  });
};

export const useUpdateMultipleResourceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: number[];
      status: ResourceStatus;
    }) => {
      if (USE_MOCK_DATA) {
        mockUpdateMultipleResourceStatus(ids, status);
        return Promise.resolve();
      }
      return updateMultipleResourceStatus(ids, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("자원 상태 변경 실패:", error);
      toast.error("자원 상태 변경에 실패했습니다.");
    },
  });
};
