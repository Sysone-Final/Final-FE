import axios from "axios";
import type {
  PaginatedResourceResponse,
  Resource,
  ResourceListFilters,
  Datacenter,
  Rack,
} from "../types/resource.types";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://api.serverway.shop/api",
  // TODO(user): 인증이 필요하면 헤더 설정 추가 (useAuth 훅 등 활용)
});

const RESOURCE_API_URL = "/resourceManage";

/**
 * 자원 목록 조회 (GET)
 * @param page 페이지 번호 (0-based)
 * @param size 페이지 크기
 * @param filters 검색 및 필터 조건 객체
 */
export const getResourceList = async (
  page: number, //  page 파라미터 사용됨
  size: number, //  size 파라미터 사용됨
  filters: ResourceListFilters,
): Promise<PaginatedResourceResponse> => {
  // 💡 Promise<PaginatedResourceResponse> 반환 약속
  const response = await apiClient.get<PaginatedResourceResponse>(
    RESOURCE_API_URL,
    {
      params: {
        page,
        size,
        ...filters,
      },
    },
  );
  return response.data; //  PaginatedResourceResponse 타입 값 반환! (오류 해결)
};

/**
 * 신규 자원 등록 (POST)
 * @param formData 자원 정보 및 이미지 파일 포함 FormData
 */
export const createResource = async (formData: FormData): Promise<Resource> => {
  // 💡 Promise<Resource> 반환 약속
  const response = await apiClient.post<Resource>(RESOURCE_API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; //  Resource 타입 값 반환! (오류 해결)
};

/**
 * 자원 정보 수정 (PUT)
 * @param id 수정할 자원 ID
 * @param formData 수정할 정보 및 이미지 파일 포함 FormData
 */
export const updateResource = async (
  id: string,
  formData: FormData,
): Promise<Resource> => {
  // 💡 Promise<Resource> 반환 약속
  const response = await apiClient.put<Resource>(
    `${RESOURCE_API_URL}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data; //  Resource 타입 값 반환! (오류 해결)
};

/**
 * 자원 삭제 (DELETE)
 * @param id 삭제할 자원 ID
 */
export const deleteResource = async (id: string): Promise<void> => {
  // 💡 Promise<void> 반환 약속
  await apiClient.delete(`${RESOURCE_API_URL}/${id}`);
  // void 타입은 return 문이 없어도 됨 (오류 없음)
};

/**
 * 자원 대량 삭제 (DELETE)
 * @param ids 삭제할 자원 ID 배열
 */
export const deleteMultipleResources = async (ids: string[]): Promise<void> => {
  // 💡 Promise<void> 반환 약속
  await apiClient.delete(RESOURCE_API_URL, {
    data: { ids },
  });
  // void 타입은 return 문이 없어도 됨 (오류 없음)
};

/**
 * 9.2 자원 상세 정보 조회 (GET /resourceManage/{id})
 * @param id 조회할 자원 ID
 */
export const getResourceById = async (id: string): Promise<Resource> => {
  // 💡 create/updateResource와 마찬가지로 API 응답 래퍼가 없다고 가정합니다.
  // 💡 (만약 래퍼가 있다면 getDatacenters처럼 .result를 반환하세요.)
  const response = await apiClient.get<Resource>(`${RESOURCE_API_URL}/${id}`);
  return response.data; // Resource 타입 값 반환
};

// API 응답 래퍼 타입 정의
interface ApiResponseWrapper<T> {
  status_code: number;
  status_message: string;
  result: T;
}

/**
 * 3.1 접근 가능한 전산실 목록 조회 (GET /datacenters)
 */
export const getDatacenters = async (): Promise<Datacenter[]> => {
  const response =
    await apiClient.get<ApiResponseWrapper<Datacenter[]>>("/datacenters");
  return response.data.result;
};

/**
 * 5.1 전산실별 랙 목록 조회 (GET /racks/datacenter/{dataCenterId})
 * @param dataCenterId 전산실 ID
 */
export const getRacksByDatacenter = async (
  dataCenterId: string,
): Promise<Rack[]> => {
  //  응답 래퍼 타입 사용 및 result 추출
  const response = await apiClient.get<ApiResponseWrapper<Rack[]>>(
    `/racks/datacenter/${dataCenterId}`,
  );
  return response.data.result;
};
