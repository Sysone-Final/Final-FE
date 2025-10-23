import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResourceList,
  createResource,
  updateResource,
  deleteResource,
  deleteMultipleResources,
} from "../api/resourceManageApi";
//  ResourceListFilters를 types 파일에서 임포트
import type { ResourceListFilters } from "../types/resource.types";
// TODO(user): 공용 useToast 훅 임포트

export const RESOURCE_QUERY_KEY = "resources";

export const useGetResourceList = (
  page: number,
  size: number,
  filters: ResourceListFilters,
) => {
  return useQuery({
    queryKey: [RESOURCE_QUERY_KEY, page, size, filters],
    queryFn: () => getResourceList(page, size, filters),
    placeholderData: (previousData) => previousData,
    // keepPreviousData: true,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    //  formData 파라미터 명시적 전달
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
    //  { id, formData } 파라미터 명시적 전달 (기존과 동일하지만 확인)
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
    //  id 파라미터 명시적 전달
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
    //  ids 파라미터 명시적 전달
    mutationFn: (ids: string[]) => deleteMultipleResources(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESOURCE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("자원 대량 삭제 실패:", error);
    },
  });
};
