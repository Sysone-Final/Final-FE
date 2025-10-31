
import React from 'react';
import { useFloorPlanStore, setDashboardMetricView, toggleLayerVisibility, toggleSeverityVisibility } from '../../store/floorPlanStore';
import type { DashboardMetricView, AssetLayer, AssetStatus } from '../../types';

// 범례 항목
const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
 <div className="flex items-center gap-2">
  <span
   className="w-3 h-3 rounded-full border border-gray-500"
   style={{ backgroundColor: color }}
  />
  <span className="text-sm text-gray-200">{label}</span>
 </div>
);

// 라디오 버튼 항목 
const MetricViewRadio: React.FC<{
 label: string;
 value: DashboardMetricView;
 isChecked: boolean;
 onChange: () => void; // 부모로부터 핸들러를 받음
}> = ({ label, value, isChecked, onChange }) => (
 <label className="option-radio-label">
  <input
   type="radio"
   name="metric-view"
   value={value}
   checked={isChecked}
   onChange={onChange} // 부모가 전달한 핸들러 사용
   className="option-radio-input"
  />
  <span className="option-radio-text text-body-primary">{label}</span>
 </label>
);

// 체크박스 항목 (Phase 2, 3)
const FilterCheckbox: React.FC<{
 label: string;
 isChecked: boolean;
 onChange: () => void;
}> = ({ label, isChecked, onChange }) => (
 <label className="option-checkbox-label">
  <input
   type="checkbox"
   checked={isChecked}
   onChange={onChange}
   className="option-checkbox-input"
  />
  <span className="option-checkbox-text text-body-primary">{label}</span>
 </label>
);

const StatusLegendAndFilters: React.FC = () => {
 // 스토어에서 현재 상태 가져오기
 const { dashboardMetricView, visibleLayers, visibleSeverities } = useFloorPlanStore();
const handleMetricViewChange = (newView: DashboardMetricView) => {
  // 이미 선택된 뷰를 다시 클릭했는지 확인
  const isSameView = dashboardMetricView === newView;
  
  // 1. 이미 선택된 '히트맵'을 클릭한 경우 -> 'default'로 토글 오프
  if (isSameView && (newView === 'heatmapTemp' || newView === 'heatmapPower')) {
   setDashboardMetricView('default');
  } 
  // 2. 그 외의 경우 (다른 뷰 선택, 또는 일반 뷰 재클릭) -> 그냥 해당 뷰로 설정
  else {
   setDashboardMetricView(newView);
  }
 };
return (
  <div className="flex flex-col gap-6">
   {/* ... (상태 범례 섹션) ... */}

   <div className="option-section">
    <h4 className="option-section-title text-heading">랙 표시 정보 (View Mode)</h4>
    <div className="option-group flex flex-col gap-2">
     {/*  isChecked와 onChange 핸들러 전달 */}
     <MetricViewRadio
      label="메모리 / 온도"
      value="default"
      isChecked={dashboardMetricView === 'default'}
      onChange={() => handleMetricViewChange('default')}
     />
     <MetricViewRadio
      label="전력 / 네트워크"
      value="network"
      isChecked={dashboardMetricView === 'network'}
      onChange={() => handleMetricViewChange('network')}
     />
     <MetricViewRadio
      label="자산 점유율 (U-Usage)"
      value="usage"
      isChecked={dashboardMetricView === 'usage'}
      onChange={() => handleMetricViewChange('usage')}
     />
     
     <hr className="border-gray-600 my-1" />

     <MetricViewRadio
      label="🌡️ 온도 히트맵"
      value="heatmapTemp"
      isChecked={dashboardMetricView === 'heatmapTemp'}
      onChange={() => handleMetricViewChange('heatmapTemp')}
     />
     <MetricViewRadio
      label="⚡ 전력 히트맵"
      value="heatmapPower"
      isChecked={dashboardMetricView === 'heatmapPower'}
      onChange={() => handleMetricViewChange('heatmapPower')}
     />
    </div>
   </div>

   {/* --- [Phase 3] 심각도 필터 --- */}
   <div className="option-section">
    <h4 className="option-section-title text-heading">심각도 필터 (Severity)</h4>
    <div className="option-group">
     <FilterCheckbox
      label="위험 (Critical)"
      isChecked={visibleSeverities.danger}
      onChange={() => toggleSeverityVisibility('danger')}
     />
     <FilterCheckbox
      label="주의 (Warning)"
      isChecked={visibleSeverities.warning}
      onChange={() => toggleSeverityVisibility('warning')}
     />
     <FilterCheckbox
      label="정상 (Normal)"
      isChecked={visibleSeverities.normal}
      onChange={() => toggleSeverityVisibility('normal')}
     />
    </div>
   </div>

   {/* --- [Phase 2] 자산 레이어 필터 --- */}
   <div className="option-section">
    <h4 className="option-section-title text-heading">자산 레이어 (Asset Layer)</h4>
    <div className="option-group">
     <FilterCheckbox
      label="하부 설비 (랙 등)"
      isChecked={visibleLayers.floor}
      onChange={() => toggleLayerVisibility('floor')}
     />
     <FilterCheckbox
      label="벽면 설비 (문 등)"
      isChecked={visibleLayers.wall}
      onChange={() => toggleLayerVisibility('wall')}
     />
     <FilterCheckbox
      label="상부 설비 (CCTV 등)"
      isChecked={visibleLayers.overhead}
      onChange={() => toggleLayerVisibility('overhead')}
     />
    </div>
   </div>
  </div>
 );
};

export default StatusLegendAndFilters;