// import React from 'react';
import { useFloorPlanStore } from '../../store/floorPlanStore.ts';
import type { DisplayOptionsType } from '../../types';

// 개별 체크박스 아이템을 위한 컴포넌트
const OptionCheckbox = ({
  label,
  optionKey,
}: {
  label: string;
  optionKey: keyof DisplayOptionsType;
}) => {
  const { displayOptions, setDisplayOptions } = useFloorPlanStore();
  const isChecked = displayOptions[optionKey];
  
  const handleChange = () => {
    setDisplayOptions({ [optionKey]: !isChecked });
  };
  
  return (
    <label className="option-checkbox-label">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="option-checkbox-input"
      />
      <span className="option-checkbox-text text-body-primary">{label}</span>
    </label>
  );
};

const DisplayOptions: React.FC = () => {
  return (
    <div className="display-options-container">
      {/* 기본정보 섹션 */}
      <div className="option-section">
        <h4 className="option-section-title text-title-section">기본정보</h4>
        <div className="option-group">
          <OptionCheckbox label="랙 이름" optionKey="showName" />
        </div>
      </div>

      {/* 상태 & 성능 섹션 */}
      <div className="option-section">
        <h4 className="option-section-title text-title-section">상태 & 성능</h4>
        <div className="option-group">
          <OptionCheckbox label="상태 표시등" optionKey="showStatusIndicator" />
          <OptionCheckbox label="온도" optionKey="showTemperature" />
          <OptionCheckbox label="U-사용량" optionKey="showUUsage" />
          <OptionCheckbox label="전력 상태" optionKey="showPowerStatus" />
        </div>
      </div>

      {/* 전문 정보 섹션 */}
      <div className="option-section">
        <h4 className="option-section-title text-title-section">전문 정보</h4>
        <div className="option-group">
          <OptionCheckbox label="Hot/Cold Aisle 표시" optionKey="showAisle" />
          <OptionCheckbox label="PUE 지표" optionKey="showPUE" />
        </div>
      </div>

      {/* 설비/안전 섹션 */}
      <div className="option-section">
        <h4 className="option-section-title text-title-section">설비/안전</h4>
        <div className="option-group">
          <OptionCheckbox label="UPS/CRAC 설비" optionKey="showFacilities" />
          <OptionCheckbox label="CCTV/센서 위치" optionKey="showSensors" />
        </div>
      </div>

      {/* 표시 설정 섹션 */}
      <div className="option-section">
        <h4 className="option-section-title text-title-section">표시 설정</h4>
        <div className="option-group">
          <OptionCheckbox label="LOD 자동 조절 사용" optionKey="useLOD" />
          <OptionCheckbox label="Grid Line 표시 (보기 모드)" optionKey="showGridLine" />
        </div>
      </div>
    </div>
  );
};

export default DisplayOptions;