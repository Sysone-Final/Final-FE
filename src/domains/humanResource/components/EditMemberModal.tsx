import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUpdateMember } from '../hooks/useMemberQueries';
import type { Member, MemberRole } from '../types/memberTypes';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

interface FormData {
//   userName: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  zipcode: string;
  role: MemberRole;
}

const initialFormData: FormData = {
//   userName: '',
  name: '',
  email: '',
  phone: '',
  city: '',
  street: '',
  zipcode: '',
  role: 'VIEWER',
};

export default function EditMemberModal({
  isOpen,
  onClose,
  member,
}: EditMemberModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const updateMemberMutation = useUpdateMember();

  // member가 변경될 때마다 formData 업데이트
  useEffect(() => {
    if (member) {
      setFormData({
        // userName: member.userName || '',
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        city: member.city || '',
        street: member.street || '',
        zipcode: member.zipcode || '',
        role: member.role,
      });
    }
  }, [member]);

  if (!isOpen || !member) return null;

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

    // // userName 검증
    // if (!formData.userName.trim()) {
    //   newErrors.userName = '사용자 ID를 입력해주세요.';
    // } else if (formData.userName.length < 4) {
    //   newErrors.userName = '사용자 ID는 4자 이상이어야 합니다.';
    // }

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
    if (formData.phone && !/^01[0-9]-\d{3,4}-\d{4}$/.test(formData.phone)) {
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

    try {
      await updateMemberMutation.mutateAsync({
        id: member.id,
        data: {
        //   userName: formData.userName,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          city: formData.city || undefined,
          street: formData.street || undefined,
          zipcode: formData.zipcode || undefined,
          role: formData.role,
        },
      });

      // 성공 시 폼 초기화 및 모달 닫기
      setFormData(initialFormData);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('회원 수정 실패:', error);
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
          <h2 className="text-title">회원 정보 수정</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            disabled={updateMemberMutation.isPending}
          >
            <X size={24} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 사용자 ID */}
          {/* <div>
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
              disabled={updateMemberMutation.isPending}
            />
            {errors.userName && (
              <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
            )}
          </div> */}

          {/* 이름 */}
          {/* <div>
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
              disabled={updateMemberMutation.isPending}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div> */}

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
              disabled={updateMemberMutation.isPending}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* 연락처 */}
          <div>
            <label className="text-label-form block mb-2">연락처</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="modal-input"
              disabled={updateMemberMutation.isPending}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* 도시 */}
          <div>
            <label className="text-label-form block mb-2">도시</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="서울시"
              className="modal-input"
              disabled={updateMemberMutation.isPending}
            />
          </div>

          {/* 주소 */}
          <div>
            <label className="text-label-form block mb-2">주소</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="강남구 테헤란로 123"
              className="modal-input"
              disabled={updateMemberMutation.isPending}
            />
          </div>

          {/* 우편번호 */}
          <div>
            <label className="text-label-form block mb-2">우편번호</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              placeholder="06000"
              className="modal-input"
              disabled={updateMemberMutation.isPending}
            />
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
              disabled={updateMemberMutation.isPending}
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
              disabled={updateMemberMutation.isPending}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-create flex-1 py-3"
              disabled={updateMemberMutation.isPending}
            >
              {updateMemberMutation.isPending ? '수정 중...' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
