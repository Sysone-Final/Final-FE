import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getMemberList,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  deleteMultipleMembers,
} from '../api/memberApi';
import type { Member } from '../types/member.types';

export const MEMBER_QUERY_KEY = 'members';

/**
 * 회원 목록 조회 훅
 */
export const useGetMemberList = () => {
  return useQuery({
    queryKey: [MEMBER_QUERY_KEY],
    queryFn: getMemberList,
  });
};

/**
 * 회원 상세 조회 훅
 */
export const useGetMemberById = (id: number | null) => {
  return useQuery({
    queryKey: [MEMBER_QUERY_KEY, 'detail', id],
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error('Member ID is required'));
      }
      return getMemberById(id);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

/**
 * 회원 생성 훅
 */
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Member, 'id' | 'lastLoginAt'>) => createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMBER_QUERY_KEY] });
      toast.success('새로운 회원이 등록되었습니다.');
    },
    onError: (error) => {
      console.error('회원 생성 실패:', error);
      toast.error('회원 등록에 실패했습니다.');
    },
  });
};

/**
 * 회원 수정 훅
 */
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Member> }) =>
      updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMBER_QUERY_KEY] });
      toast.success('회원 정보가 수정되었습니다.');
    },
    onError: (error) => {
      console.error('회원 수정 실패:', error);
      toast.error('회원 수정에 실패했습니다.');
    },
  });
};

/**
 * 회원 삭제 훅
 */
export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMBER_QUERY_KEY] });
      toast.success('회원이 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('회원 삭제 실패:', error);
      toast.error('회원 삭제에 실패했습니다.');
    },
  });
};

/**
 * 회원 대량 삭제 훅
 */
export const useDeleteMultipleMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => deleteMultipleMembers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMBER_QUERY_KEY] });
      toast.success('선택한 회원이 모두 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('회원 대량 삭제 실패:', error);
      toast.error('회원 대량 삭제에 실패했습니다.');
    },
  });
};
