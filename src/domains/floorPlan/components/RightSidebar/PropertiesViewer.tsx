import React from 'react';
import { useFloorPlanStore } from '../../store/floorPlanStore';
import type { Asset } from '../../types';

// 상태 값에 따라 한글 이름과 CSS 클래스를 반환하는 헬퍼 함수
const getStatusInfo = (status: Asset['status']) => {
  switch (status) {
    case 'normal':
      return { text: '정상', className: 'status-dot-normal' };
    case 'warning':
      return { text: '주의', className: 'status-dot-warning' };
    case 'danger':
      return { text: '위험', className: 'status-dot-danger' };
    default:
      return { text: '알 수 없음', className: 'status-dot-unknown' };
  }
};

const PropertiesViewer: React.FC = () => {
  const { assets, selectedAssetIds } = useFloorPlanStore();

  const selectedAsset = selectedAssetIds.length > 0
    ? assets.find((asset) => asset.id === selectedAssetIds[0])
    : null;

  if (!selectedAsset) {
    return (
      <div className="properties-placeholder">
        <p className="placeholder-text">자산을 클릭하면 정보가 표시됩니다.</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(selectedAsset.status);

  return (
    <div className="properties-viewer-container">
      <div className="viewer-header">
        <h3 className="viewer-title">속성 뷰어: {selectedAsset.name}</h3>
      </div>
      <div className="viewer-section">
        <h4 className="section-title">실시간 상태</h4>
        <div className="info-row">
          <span className="info-label">상태</span>
          <div className="info-value">
            <span className={`status-dot ${statusInfo.className}`}></span>
            <span>{statusInfo.text}</span>
          </div>
        </div>
        {selectedAsset.data?.temperature !== undefined && (
          <div className="info-row">
            <span className="info-label">온도</span>
            <span className="info-value">{selectedAsset.data.temperature}°C</span>
          </div>
        )}
      </div>
      <div className="viewer-section">
        <h4 className="section-title">기본 정보</h4>
        <div className="info-row">
            <span className="info-label">자산 ID</span>
            <span className="info-value">{selectedAsset.id}</span>
        </div>
        <div className="info-row">
            <span className="info-label">타입</span>
            {/* [수정] selectedAsset.type -> selectedAsset.assetType */}
            <span className="info-value">{selectedAsset.assetType.toUpperCase()}</span>
        </div>
      </div>
      
      {selectedAsset.assetType === 'rack' && (
        <div className="viewer-footer">
            <button className="detail-button">
            랙 상세 보기
            </button>
        </div>
      )}
    </div>
  );
};

export default PropertiesViewer;
