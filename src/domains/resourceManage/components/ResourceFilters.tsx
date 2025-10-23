// src/domains/resourceManage/components/ResourceFilters.tsx
import React from 'react';
// TODO(user): 아이콘 라이브러리 (lucide-react 등) 설치 후 주석 해제
// import { Search, Plus } from 'lucide-react';

interface ResourceFiltersProps {
  onAddResourceHandler: () => void;
}

export default function ResourceFilters({ onAddResourceHandler }: ResourceFiltersProps) {
  return (
    <div className="mb-4">
      {/* Prompt 1: Page Title */}
      <h1 className="text-2xl font-bold mb-4">Asset Management List</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Prompt 1: Large Search Input */}
        <div className="relative w-full md:flex-1">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /> */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="search"
            placeholder="Search by Asset Name, Model, IP, S/N..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Prompt 1: Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <select className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none">
            <option>Type: All</option>
            {/* TODO(user): 타입 필터 옵션 추가 */}
          </select>
          <select className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none">
            <option>Status: All</option>
            {/* TODO(user): 상태 필터 옵션 추가 */}
          </select>
          <select className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none">
            <option>Location: All</option>
            {/* TODO(user): 위치 필터 옵션 추가 */}
          </select>
        </div>
        
        {/* Prompt 1: Primary Action Button */}
        <button
          onClick={onAddResourceHandler}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 w-full md:w-auto"
        >
          {/* <Plus size={18} className="mr-1" /> */}
          <span className="mr-1 text-lg">+</span>
          <span>Add Asset</span>
        </button>
      </div>
    </div>
  );
}