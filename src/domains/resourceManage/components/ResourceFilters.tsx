import { Search } from 'lucide-react'; // Plus 아이콘 제거

interface ResourceFiltersProps {
  // onAddResourceHandler 제거
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  // TODO(user): type, location 필터 상태 및 핸들러 props 추가
}

export default function ResourceFilters({
  // onAddResourceHandler 제거
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange
  // TODO: typeFilter, onTypeChange, locationFilter, onLocationChange
}: ResourceFiltersProps) {
  return (
    // 상위 div의 mb-4 제거
    <div>
      {/* <h1> 제목 제거 */}

      {/* 필터 요소 감싸는 div */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* 검색창 다크 모드 */}
        <div className="relative w-full md:flex-1 border border-slate-300/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/50 text-gray-50 placeholder-gray-400">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
            // value={typeFilter} // TODO
            // onChange={(e) => onTypeChange(e.target.value)} // TODO
          >
            <option value="">유형: 전체</option>
            {/* TODO(user): 실제 자원 유형 옵션 추가 */}
          </select>
          <select
            className="border border-slate-300/40 rounded-lg py-2.5 px-3 focus:outline-none bg-gray-700/50 text-gray-50"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">상태: 전체</option>
            <option value="NORMAL">정상</option>
            <option value="MAINTENANCE">점검중</option>
            <option value="INACTIVE">비활성/재고</option>
            <option value="DISPOSED">폐기</option>
            {/* <option value="경고">경고</option>
            <option value="정보 필요">정보 필요</option>
            <option value="미할당">미할당</option> */}
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
