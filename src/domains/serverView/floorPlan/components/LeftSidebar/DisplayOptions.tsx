
import { useFloorPlanStore, setDisplayOptions, toggleLayerVisibility } from '../../store/floorPlanStore.ts';
import type { DisplayOptionsType, AssetLayer } from '../../types';

const OptionCheckbox = ({
 label,
 optionKey,
}: {
 label: string;
 optionKey: keyof DisplayOptionsType;
}) => {
 const { displayOptions } = useFloorPlanStore(); 
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

const LayerCheckbox = ({
label,
layerKey,
}: {
label: string;
layerKey: AssetLayer;
}) => {
const { visibleLayers } = useFloorPlanStore();
const isChecked = visibleLayers[layerKey];

const handleChange = () => {
 toggleLayerVisibility(layerKey);
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
    <h4 className="option-section-title text-heading">기본정보</h4>
    <div className="option-group">
     <OptionCheckbox label="랙 이름" optionKey="showName" />
    </div>
   </div>

   {/* 상태 & 성능 섹션 */}
   <div className="option-section">
    <h4 className="option-section-title text-heading">상태 & 성능</h4>
    <div className="option-group">
     <OptionCheckbox label="상태 표시등" optionKey="showStatusIndicator" />
     <OptionCheckbox label="온도" optionKey="showTemperature" />
     <OptionCheckbox label="U-사용량" optionKey="showUUsage" />
     <OptionCheckbox label="전력 상태" optionKey="showPowerStatus" />
    </div>
   </div>

   {/* 전문 정보 섹션 */}
   <div className="option-section">
    <h4 className="option-section-title text-heading">전문 정보</h4>
    <div className="option-group">
     <OptionCheckbox label="Hot/Cold Aisle 표시" optionKey="showAisle" />
     <OptionCheckbox label="PUE 지표" optionKey="showPUE" />
    </div>
   </div>

   {/* 자산 레이어 */}
   <div className="option-section">
   <h4 className="option-section-title text-heading">자산 레이어 (Asset Layer)</h4>
   <div className="option-group">
   <LayerCheckbox label="하부 설비 (랙 등)" layerKey="floor" />
   <LayerCheckbox label="벽면 설비 (문 등)" layerKey="wall" />
   <LayerCheckbox label="상부 설비 (CCTV 등)" layerKey="overhead" />
   </div>
   </div>

   {/* 표시 설정 섹션 */}
   <div className="option-section">
    <h4 className="option-section-title text-heading">표시 설정</h4>
    <div className="option-group">
     <OptionCheckbox label="LOD 자동 조절 사용" optionKey="useLOD" />
     <OptionCheckbox label="Grid Line 표시 (보기 모드)" optionKey="showGridLine" />
    </div>
   </div>
  </div>
 );
};

export default DisplayOptions;