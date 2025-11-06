import { Search } from 'lucide-react'; 
import {
  EQUIPMENT_TYPE_OPTIONS,
  RESOURCE_STATUS_OPTIONS,
} from "../constants/resource.constants";
import type { Datacenter } from "../types/resource.types";

interface ResourceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string; 
  onTypeChange: (value: string) => void; 
 datacenterFilter: string;
  onDatacenterChange: (value: string) => void;
  datacenters: Datacenter[];
  isLoadingDatacenters: boolean;
}

export default function ResourceFilters({
 searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  datacenterFilter,
  onDatacenterChange,
  datacenters,
  isLoadingDatacenters,
}: ResourceFiltersProps) {
  return (
    <div>

      {/* 필터 요소 감싸는 div */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* 검색창 다크 모드 */}
<div className="relative w-full md:flex-1 border border-slate-300/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/50 text-gray-50 placeholder-gray-400">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="자산명, 모델명, IP로 검색..."
            className="w-full pl-10 pr-4 py-2 "
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Select 박스 다크 모드 */}
        <div className="flex items-center gap-2">
          <select
            className="border border-slate-300/40 rounded-lg py-2.5 px-3 focus:outline-none bg-gray-700/50 text-gray-50"
            value={typeFilter} 
            onChange={(e) => onTypeChange(e.target.value)} 
          >
            <option value="">유형: 전체</option>
            {EQUIPMENT_TYPE_OPTIONS.map((option) => ( 
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="border border-slate-300/40 rounded-lg py-2.5 px-3 focus:outline-none bg-gray-700/50 text-gray-50"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">상태: 전체</option>
            {RESOURCE_STATUS_OPTIONS.map((option) => ( 
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
          className="border border-slate-300/40 rounded-lg py-2.5 px-3 focus:outline-none bg-gray-700/50 text-gray-50"
          value={datacenterFilter}
          onChange={(e) => onDatacenterChange(e.target.value)}
          disabled={isLoadingDatacenters} //  로딩 중 비활성화
        >
          <option value="">위치: 전체</option>
          {isLoadingDatacenters ? (
            <option disabled>불러오는 중...</option>
          ) : (
            datacenters.map((dc) => (
              <option key={dc.id} value={dc.id}>
                {dc.name}
              </option>
            ))
          )}
        </select>
        </div>

        {/* "자산 추가" 버튼 제거 */}
      </div>
    </div>
  );
}
