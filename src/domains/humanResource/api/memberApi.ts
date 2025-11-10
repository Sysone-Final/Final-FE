import client from '@/api/client';
import type { MemberListResponse, Member } from '../types/memberTypes';

/**
 * 회원 목록 조회
 */
export const getMemberList = async (): Promise<Member[]> => {
  const response = await client.get<MemberListResponse>('/members');
  return response.data.result;
};

/**
 * 회원 상세 조회
 */
export const getMemberById = async (id: number): Promise<Member> => {
  const response = await client.get<{ result: Member }>(`/members/${id}`);
  return response.data.result;
};

/**
 * 회원 생성
 */
export const createMember = async (data: Omit<Member, 'id' | 'lastLoginAt'>): Promise<Member> => {
  const response = await client.post<{ result: Member }>('/members', data);
  return response.data.result;
};

/**
 * 회원 수정
 */
export const updateMember = async (id: number, data: Partial<Member>): Promise<Member> => {
  const response = await client.put<{ result: Member }>(`/members/${id}`, data);
  return response.data.result;
};

/**
 * 회원 삭제
 */
export const deleteMember = async (id: number): Promise<void> => {
  await client.delete(`/members/${id}`);
};

/**
 * 회원 대량 삭제
 */
export const deleteMultipleMembers = async (ids: number[]): Promise<void> => {
  await client.post('/members/bulk-delete', { ids });
};
