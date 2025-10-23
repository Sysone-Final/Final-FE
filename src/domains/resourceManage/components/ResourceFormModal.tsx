
import React, { useState, useEffect } from 'react';

import type { Resource, ResourceStatus } from '../types/resource.types';
import { useCreateResource, useUpdateResource } from '../hooks/useResourceQueries';

interface ResourceFormModalProps {
  isOpen: boolean;
  onCloseHandler: () => void;
  resource: Resource | null; // null이면 'Add', 객체면 'Edit'
}

export default function ResourceFormModal({ isOpen, onCloseHandler, resource }: ResourceFormModalProps) {
  // NOTE(user): 폼 상태 관리
  const [assetName, setAssetName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [model, setModel] = useState('');
  const [vendor, setVendor] = useState('');
  const [osType, setOsType] = useState('');
  const [status, setStatus] = useState<ResourceStatus>('미할당');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();

  // NOTE(user): 'Edit' 모드일 때, 기존 데이터로 폼 채우기
  useEffect(() => {
    if (resource) {
      setAssetName(resource.assetName);
      setIpAddress(resource.ipAddress);
      setModel(resource.model);
      setStatus(resource.status);
      setVendor(resource.vendor || '');
      setOsType(resource.osType || '');
    } else {
      // 'Add' 모드일 때 폼 초기화
      setAssetName('');
      setIpAddress('');
      setModel('');
      setStatus('미할당');
      setVendor('');
      setOsType('');
    }
    setSelectedFile(null); // 모달 열릴 때마다 파일 선택 초기화
  }, [resource, isOpen]);

  if (!isOpen) {
    return null;
  }

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    
    // NOTE(user): P0 - FormData 생성
    const formData = new FormData();
    formData.append('assetName', assetName);
    formData.append('ipAddress', ipAddress);
    formData.append('model', model);
    formData.append('status', status);
    formData.append('vendor', vendor);
    formData.append('osType', osType);
    
    if (selectedFile) {
      formData.append('imageFile', selectedFile); // 백엔드 키 이름("imageFile") 매치시키기
    }

    if (resource) {
      // 'Edit' 모드
      updateResourceMutation.mutate(
        { id: resource.id, formData },
        { onSuccess: onCloseHandler }
      );
    } else {
      // 'Add' 모드
      createResourceMutation.mutate(formData, { onSuccess: onCloseHandler });
    }
  };
  
  const isLoading = createResourceMutation.isPending || updateResourceMutation.isPending;

  return (
    // NOTE(user): 공통 모달 컴포넌트가 있다면 그것을 사용하세요.
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg z-50">
        <h2 className="text-xl font-bold mb-4">
          {resource ? '자산 수정' : '새 자산 추가'}
        </h2>
        
        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* 폼 필드 (엑셀 및 UI 기반) */}
            <input type="text" placeholder="자산명" value={assetName} onChange={(e) => setAssetName(e.target.value)} className="border p-2 rounded w-full" required />
            <input type="text" placeholder="IP 주소" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} className="border p-2 rounded w-full" />
            <input type="text" placeholder="모델명" value={model} onChange={(e) => setModel(e.target.value)} className="border p-2 rounded w-full" required />
            <input type="text" placeholder="제조사" value={vendor} onChange={(e) => setVendor(e.target.value)} className="border p-2 rounded w-full" />
            <input type="text" placeholder="OS 타입" value={osType} onChange={(e) => setOsType(e.target.value)} className="border p-2 rounded w-full" />
            <select value={status} onChange={(e) => setStatus(e.target.value as ResourceStatus)} className="border p-2 rounded w-full">
              <option value="미할당">미할당</option>
              <option value="정상">정상</option>
              <option value="경고">경고</option>
              <option value="정보 필요">정보 필요</option>
            </select>
            
            {/* P0: 이미지 업로드 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">자산 이미지</label>
              <input type="file" accept="image/*" onChange={fileChangeHandler} className="border p-2 rounded w-full text-sm" />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCloseHandler} disabled={isLoading} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              취소
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}