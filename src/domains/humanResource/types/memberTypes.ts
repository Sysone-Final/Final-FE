import type { TableMeta } from '@tanstack/react-table';

/**
 * 회원 역할 타입
 */
export type MemberRole = 'ADMIN' | 'OPERATOR' | 'VIEWER';

/**
 * 회원 인터페이스
 */
export interface Member {
  id: number;
  userName: string;
  name: string;
  email: string;
  role: MemberRole;
  lastLoginAt: string | null;
}

/**
 * API 응답 타입
 */
export interface MemberListResponse {
  status_code: number;
  status_message: string;
  result: Member[];
}

/**
 * 회원 생성 요청 타입
 */
export interface CreateMemberRequest {
  userName: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: MemberRole;
  companyId: number;
}

/**
 * 테이블 메타 타입
 */
export interface MemberTableMeta extends TableMeta<Member> {
  onEdit?: (member: Member) => void;
  onDelete?: (id: number) => void;
}
