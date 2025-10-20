import React, { useState, useEffect } from 'react';
// [수정] 빌드 도구가 모듈을 명확하게 찾을 수 있도록 파일 확장자(.ts)를 추가합니다.
import { useFloorPlanStore } from '../../store/floorPlanStore.ts';
import type { Asset } from '../../types';

const PropertiesEditor: React.FC = () => {
  const { assets, selectedAssetIds, updateAsset } = useFloorPlanStore();

  const selectedAsset = selectedAssetIds.length > 0
    ? assets.find((asset) => asset.id === selectedAssetIds[0])
    : null;

  const [editableAsset, setEditableAsset] = useState<Partial<Asset> | null>(null);

  useEffect(() => {
    setEditableAsset(selectedAsset || null);
  }, [selectedAsset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editableAsset) return;
    const { name, value } = e.target;
    const isNumeric = ['gridX', 'gridY'].includes(name);
    setEditableAsset({ ...editableAsset, [name]: isNumeric ? parseInt(value, 10) || 0 : value });
  };

  const handleBlur = () => {
    if (editableAsset && selectedAsset && editableAsset.id) {
      const { id, ...propsToUpdate } = editableAsset;
      updateAsset(id, propsToUpdate);
    }
  };

  const handleToggleLock = () => {
    if (selectedAsset) {
      updateAsset(selectedAsset.id, { isLocked: !selectedAsset.isLocked });
    }
  };

  if (!editableAsset || !selectedAsset) {
    return (
      <div className="properties-placeholder">
        <p className="placeholder-text">편집할 자산을 선택하세요.</p>
      </div>
    );
  }

  return (
    <div className="properties-editor-container">
      <div className="editor-header">
        <h3 className="editor-title">속성 편집: {selectedAsset.name}</h3>
        <button onClick={handleToggleLock} className="lock-toggle-button">
          {selectedAsset.isLocked ? '🔓 잠금 해제' : '🔒 잠금'}
        </button>
      </div>
      <div className="editor-section">
        <div className="input-group">
          <label htmlFor="name" className="input-label">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            className="input-field"
            value={editableAsset.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={selectedAsset.isLocked}
          />
        </div>
        <div className="input-group">
          <label htmlFor="gridX" className="input-label">X 좌표</label>
          <input
            type="number"
            id="gridX"
            name="gridX"
            className="input-field"
            value={editableAsset.gridX ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={selectedAsset.isLocked}
          />
        </div>
        <div className="input-group">
          <label htmlFor="gridY" className="input-label">Y 좌표</label>
          <input
            type="number"
            id="gridY"
            name="gridY"
            className="input-field"
            value={editableAsset.gridY ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={selectedAsset.isLocked}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesEditor;

