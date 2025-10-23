// src/domains/resourceManage/hooks/useResourceQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// 💡 수정: '@/' 대신 상대 경로 '..' 사용
import {
  getResourceList,
  createResource,
  updateResource,
  deleteResource,
} from "../api/resourceManageApi";

// NOTE(user): 쿼리 키 상수화 (컨벤션)
export const RESOURCE_QUERY_KEY = "resources";

/**
 * 자원 목록 조회 (GET)
 */
export const useGetResourceList = (page: number, size: number) => {
  return useQuery({
    queryKey: [RESOURCE_QUERY_KEY, page, size],
    queryFn: () => getResourceList(page, size),
    placeholderData: (previousData) => previousData, // 페이지 이동 시 UI 유지
  });
};

/**
 * 신규 자원 등록 (POST)
 */
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      // NOTE(user): 성공 시 'resources' 쿼리를 무효화하여 자동 갱신
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
    // TODO(user): onError 핸들러 추가 (예: useToast 훅 사용)
  });
};

/**
 * 자원 정보 수정 (PUT)
 */
export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateResource(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
  });
};

/**
 * 자원 삭제 (DELETE)
 */
export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
  });
};
