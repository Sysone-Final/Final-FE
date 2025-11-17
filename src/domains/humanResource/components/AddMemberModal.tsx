import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '@/domains/login/store/useAuthStore';
import { useCreateMember } from '../hooks/useMemberQueries';
import type { MemberRole } from '../types/memberTypes';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  userName: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: MemberRole;
}

const initialFormData: FormData = {
  userName: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  role: 'VIEWER',
};

export default function AddMemberModal({
  isOpen,
  onClose,
}: AddMemberModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { user } = useAuthStore();
  const createMemberMutation = useCreateMember();

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 에러 초기화
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // userName 검증
    if (!formData.userName.trim()) {
      newErrors.userName = '사용자 ID를 입력해주세요.';
    } else if (formData.userName.length < 4) {
      newErrors.userName = '사용자 ID는 4자 이상이어야 합니다.';
    }

    // password 검증
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    // name 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    // email 검증
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // phone 검증
    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^01[0-9]-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 연락처 형식이 아닙니다. (예: 010-1234-5678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.companyId) {
      alert('회사 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      await createMemberMutation.mutateAsync({
        userName: formData.userName,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        companyId: user.companyId,
      });

      // 성공 시 폼 초기화 및 모달 닫기
      setFormData(initialFormData);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('회원 추가 실패:', error);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-bg animate-fadeIn" onClick={handleClose}>
      <div
        className="modal animate-modalFadeIn max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-title">회원 추가</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            disabled={createMemberMutation.isPending}
          >
            <X size={24} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 사용자 ID */}
          <div>
            <label className="text-label-form block mb-2">
              사용자 ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="사용자 ID를 입력하세요"
              className="modal-input"
              disabled={createMemberMutation.isPending}
            />
            {errors.userName && (
              <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="text-label-form block mb-2">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              className="modal-input"
              disabled={createMemberMutation.isPending}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* 이름 */}
          <div>
            <label className="text-label-form block mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              className="modal-input"
              disabled={createMemberMutation.isPending}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label className="text-label-form block mb-2">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="modal-input"
              disabled={createMemberMutation.isPending}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* 연락처 */}
          <div>
            <label className="text-label-form block mb-2">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="modal-input"
              disabled={createMemberMutation.isPending}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* 역할 */}
          <div>
            <label className="text-label-form block mb-2">
              역할 <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="modal-input"
              disabled={createMemberMutation.isPending}
            >
              <option value="VIEWER">VIEWER</option>
              <option value="OPERATOR">OPERATOR</option>
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-cancel flex-1 py-3"
              disabled={createMemberMutation.isPending}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-create flex-1 py-3"
              disabled={createMemberMutation.isPending}
            >
              {createMemberMutation.isPending ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
