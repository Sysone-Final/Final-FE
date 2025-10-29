import { Search, Plus } from 'lucide-react';

interface ResourceFiltersProps {
  onAddResourceHandler: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  // TODO(user): type, location 필터 상태 및 핸들러 props 추가
}

export default function ResourceFilters({ 
  onAddResourceHandler, 
  searchTerm, 
  onSearchChange,
  statusFilter,
  onStatusChange
  // TODO: typeFilter, onTypeChange, locationFilter, onLocationChange
}: ResourceFiltersProps) {
  return (
    <div className="mb-4">
      {/* 텍스트 클래스 적용 */}
      <h1 className="text-title-main mb-4">자원 관리 목록</h1> 
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* 검색창 다크 모드 */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="search"
            placeholder="자산명, 모델명, IP로 검색..." // TODO: S/N 검색 추가 시 placeholder 수정
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-50 placeholder-gray-400" // 다크 모드 스타일
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* Select 박스 다크 모드 */}
        <div className="flex items-center gap-2">
          <select 
            className="border border-gray-700 rounded-lg py-2 px-3 focus:outline-none bg-gray-800 text-gray-50" // 다크 모드 스타일
            // value={typeFilter} // TODO
            // onChange={(e) => onTypeChange(e.target.value)} // TODO
          >
            <option value="">유형: 전체</option>
            {/* TODO(user): 실제 자원 유형 옵션 추가 (예: 서버, 스위치, 스토리지...) */}
          </select>
          <select 
            className="border border-gray-700 rounded-lg py-2 px-3 focus:outline-none bg-gray-800 text-gray-50" // 다크 모드 스타일
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">상태: 전체</option>
            <option value="정상">정상</option>
            <option value="경고">경고</option>
            <option value="정보 필요">정보 필요</option>
            <option value="미할당">미할당</option>
            {/* <option value="MAINTENANCE">점검중</option>
            <option value="INACTIVE">비활성/재고</option>
            <option value="DISPOSED">폐기</option> */}
          </select>
          <select 
className="border border-gray-700 rounded-lg py-2 px-3 focus:outline-none bg-gray-800 text-gray-50" // 다크 모드 스타일            // value={locationFilter} // TODO
            // onChange={(e) => onLocationChange(e.target.value)} // TODO
          >
            <option value="">위치: 전체</option>
            {/* TODO(user): 실제 위치 옵션 추가 (백엔드 데이터 기반 또는 상수) */}
          </select>
        </div>
        
        <button
          onClick={onAddResourceHandler}
          className="flex items-center justify-center bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto text-button" // 텍스트 클래스 적용
        >
          <Plus size={18} className="mr-1" />
          <span>자산 추가</span>
        </button>
      </div>
    </div>
  );
}