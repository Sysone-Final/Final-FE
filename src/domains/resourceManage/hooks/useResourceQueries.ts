
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
  PaginatedResourceResponse, //  PaginatedResourceResponse 타입을 import해야 합니다.
} from "../types/resource.types";

//  true : 목업 데이터를 사용 (API 호출 안 함)
//  false: 실제 API를 호출
//
const USE_MOCK_DATA = true ;

// 위에서 생성한 목업 데이터 파일을 import 합니다.
import {
  MOCK_DATA,
  MOCK_DATACENTERS,
  MOCK_RACKS,
} from "../api/resourceManageApi.mock";

export const RESOURCE_QUERY_KEY = "resources";
export const DATACENTER_QUERY_KEY = "datacenters";
export const RACK_QUERY_KEY = "racks";

//  자원 목록 조회 훅
export const useGetResourceList = (
  page: number,
  size: number,
  filters: ResourceListFilters,
) => {
  // --- MOCK DATA 로직 ---
  if (USE_MOCK_DATA) {
    console.warn("Using MOCK data for useGetResourceList");

    // MSW의 필터링/페이지네이션 로직을 간단하게 흉내냅니다.
    let filteredData = MOCK_DATA;
    const keyword = filters.keyword?.toLowerCase();

    if (keyword) {
      filteredData = filteredData.filter(
        (r) =>
          r.equipmentName.toLowerCase().includes(keyword) ||
          (r.modelName && r.modelName.toLowerCase().includes(keyword)) ||
          (r.ipAddress && r.ipAddress.includes(keyword)),
      );
    }
    if (filters.status) {
      filteredData = filteredData.filter((r) => r.status === filters.status);
    }
    if (filters.type) {
      filteredData = filteredData.filter(
        (r) => r.equipmentType === filters.type,
      );
    }
    if (filters.datacenterId) {
      filteredData = filteredData.filter(
        (r) => r.datacenterId === filters.datacenterId,
      );
    }

    const start = page * size;
    const end = start + size;
    const paginatedContent = filteredData.slice(start, end);
    const totalPages = Math.ceil(filteredData.length / size);

    // 실제 API 응답(PaginatedResourceResponse)과 동일한 구조로 만듭니다.
    const mockPaginatedResponse: PaginatedResourceResponse = {
      content: paginatedContent,
      totalElements: filteredData.length,
      totalPages: totalPages,
      last: end >= filteredData.length,
      size: size,
      number: page,
    };

    // useQuery가 반환하는 객체와 동일한 형태로 반환합니다.
    // (isLoading: false로 즉시 데이터를 보여줍니다)
    return {
      data: mockPaginatedResponse,
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
      // (useQuery가 반환하는 다른 상태값들... 필요시 추가)
    };
  }

  // --- 기존 로직 (USE_MOCK_DATA = false 일 때 실행) ---
  return useQuery({
    queryKey: [RESOURCE_QUERY_KEY, page, size, filters],
    queryFn: () => getResourceList(page, size, filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};


//  전산실 목록 조회 훅

export const useGetDatacenters = () => {
  //  MOCK
  if (USE_MOCK_DATA) {
    console.warn("Using MOCK data for useGetDatacenters");
    return {
      data: MOCK_DATACENTERS as Datacenter[],
      isLoading: false,
      isError: false,
      isSuccess: true,
    };
  }
  //  END MOCK

  return useQuery<Datacenter[], Error>({
    queryKey: [DATACENTER_QUERY_KEY],
    queryFn: getDatacenters,
    staleTime: 1000 * 60 * 5,
  });
};


//  랙 목록 조회 훅

export const useGetRacksByDatacenter = (datacenterId: string | null) => {
  //  MOCK
  if (USE_MOCK_DATA) {
    console.warn("Using MOCK data for useGetRacksByDatacenter");

    // datacenterId에 따라 필터링
    const filteredRacks = datacenterId
      ? MOCK_RACKS.filter((r) => r.datacenterId === datacenterId)
      : [];

    return {
      data: filteredRacks as Rack[],
      isLoading: false,
      isError: false,
      isSuccess: true,
    };
  }
  //  END MOCK

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

//
//  자원 상세 정보 조회 훅 (수정 모드용)
//
export const useGetResourceById = (resourceId: string | null) => {
  // MOCK
  if (USE_MOCK_DATA) {
    console.warn("Using MOCK data for useGetResourceById");

    // resourceId로 MOCK_DATA에서 검색
    const resource = resourceId
      ? MOCK_DATA.find((r) => r.id === resourceId)
      : undefined;

    return {
      data: resource as Resource | undefined,
      isLoading: false,
      isError: !resource && !!resourceId, // ID가 있는데 못찾으면 에러
      isSuccess: !!resource,
    };
  }
  //  END MOCK

  return useQuery<Resource, Error>({
    queryKey: [RESOURCE_QUERY_KEY, "detail", resourceId],
    queryFn: () => {
      if (!resourceId) {
        return Promise.reject(new Error("Resource ID is required"));
      }
      return getResourceById(resourceId);
    },
    enabled: !!resourceId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

// --- CUD (Create, Update, Delete) 훅 ---
// CUD 훅은 (GET과 달리) 버튼 클릭 시점에만 동작하므로,
// 지금 당장 "데이터를 띄우는" 목적에는 수정하지 않아도 괜찮습니다.
// (만약 USE_MOCK_DATA=true일 때 CUD 버튼을 누르면,
//  실제 API로 요청이 가고 401/404 오류 토스트가 뜰 것입니다.)

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