import { Search } from 'lucide-react'; // Plus 아이콘 제거
import {
  EQUIPMENT_TYPE_OPTIONS,
  RESOURCE_STATUS_OPTIONS,
} from "../constants/resource.constants";

interface ResourceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string; // ⬅️ 추가
  onTypeChange: (value: string) => void; // ⬅️ 추가
  // TODO(user): location 필터 상태 및 핸들러 props 추가
}

export default function ResourceFilters({
 searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  // TODO: typeFilter, onTypeChange, locationFilter, onLocationChange
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
            value={typeFilter} // ⬅️ 이제 정상
            onChange={(e) => onTypeChange(e.target.value)} // ⬅️ 이제 정상
          >
            <option value="">유형: 전체</option>
            {EQUIPMENT_TYPE_OPTIONS.map((option) => ( // ⬅️ 이제 정상
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
            {RESOURCE_STATUS_OPTIONS.map((option) => ( // ⬅️ 이제 정상
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="border border-slate-300/40 rounded-lg py-2.5 px-3 focus:outline-none bg-gray-700/50 text-gray-50"
            // value={locationFilter} // TODO
            // onChange={(e) => onLocationChange(e.target.value)} // TODO
          >
            <option value="">위치: 전체</option>
            {/* TODO(user): 실제 위치 옵션 추가 */}
          </select>
        </div>

        {/* "자산 추가" 버튼 제거 */}
      </div>
    </div>
  );
}
