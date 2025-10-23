// src/domains/resourceManage/api/resourceManageApi.ts
import axios from "axios";
// 💡 수정: '@/' 대신 상대 경로 '..' 사용
import type {
  PaginatedResourceResponse,
  Resource,
} from "../types/resource.types";

// NOTE(user): 공용 axios 인스턴스 (Vite 환경 변수 사용)
const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://api.yserverway.shop/api",
  // TODO(user): 인증이 필요하면 헤더 설정 추가
});

// NOTE(user): API 엔드포인트는 백엔드와 협의 필요 (예: /resources)
const RESOURCE_API_URL = "/resourceManage";

/**
 * 자원 목록 조회 (GET)
 */
export const getResourceList = async (
  page: number,
  size: number,
): Promise<PaginatedResourceResponse> => {
  const response = await apiClient.get<PaginatedResourceResponse>(
    RESOURCE_API_URL,
    {
      params: { page, size },
    },
  );
  return response.data;
};

/**
 * 신규 자원 등록 (POST)
 * NOTE(user): P0 작업 - 이미지 업로드를 위해 FormData 사용
 */
export const createResource = async (formData: FormData): Promise<Resource> => {
  const response = await apiClient.post<Resource>(RESOURCE_API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * 자원 정보 수정 (PUT)
 */
export const updateResource = async (
  id: string,
  formData: FormData,
): Promise<Resource> => {
  const response = await apiClient.put<Resource>(
    `${RESOURCE_API_URL}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

/**
 * 자원 삭제 (DELETE)
 */
export const deleteResource = async (id: string): Promise<void> => {
  await apiClient.delete(`${RESOURCE_API_URL}/${id}`);
};
