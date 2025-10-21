import React, { useState, useEffect } from 'react';
import { useFloorPlanStore } from '../../store/floorPlanStore';
import type { Asset } from '../../types';

const COLOR_PRESETS = [ '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#1abc9c', '#34495e', '#95a5a6', '#ecf0f1' ];

const PropertiesEditor: React.FC = () => {
  const { assets, selectedAssetIds, updateAsset, deleteAsset, duplicateAsset, groupSelectedAssets, ungroupSelectedAssets } = useFloorPlanStore();
  
  const selectedAssets = assets.filter(asset => selectedAssetIds.includes(asset.id));
  const isSingleSelection = selectedAssets.length === 1;
  const selectedAsset = isSingleSelection ? selectedAssets[0] : null;
  
  const [editableAsset, setEditableAsset] = useState<Partial<Asset> | null>(null);
  const [openSections, setOpenSections] = useState({ basic: true, visual: true, metadata: false, advanced: true });

  useEffect(() => { setEditableAsset(selectedAsset); }, [selectedAsset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!selectedAsset) return;
    const { name, value } = e.target;
    // [수정] uHeight를 포함한 숫자 필드 처리
    const numericFields = ['gridX', 'gridY', 'rotation', 'widthInCells', 'heightInCells', 'opacity', 'uHeight'];
    const updatedValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;
    setEditableAsset(prev => prev ? { ...prev, [name]: updatedValue } : null);
    updateAsset(selectedAsset.id, { [name]: updatedValue });
  };

  const handleRotate = (direction: 'cw' | 'ccw') => {
    if (!selectedAsset) return;
    const currentRotation = selectedAsset.rotation || 0;
    const newRotation = direction === 'cw' ? (currentRotation + 45) % 360 : (currentRotation - 45 + 360) % 360;
    updateAsset(selectedAsset.id, { rotation: newRotation });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const handleDeleteSelected = () => {
    if (window.confirm(`선택한 ${selectedAssetIds.length}개 자산을 삭제하시겠습니까?`)) {
        selectedAssetIds.forEach(id => deleteAsset(id));
    }
  };

  if (selectedAssets.length === 0) {
    return <div className="properties-placeholder"><p className="placeholder-text">편집할 자산을 선택하세요.</p></div>;
  }

  if (!isSingleSelection) {
    return (
      <div className="properties-editor-container">
        <div className="editor-header"><h3 className="editor-title">{selectedAssetIds.length}개 자산 선택됨</h3></div>
        <div className="accordion-section p-2 flex flex-col gap-2">
            <button onClick={groupSelectedAssets} className="action-button group-btn">🔗 그룹 만들기</button>
            <button onClick={ungroupSelectedAssets} className="action-button group-btn">✂️ 그룹 해제</button>
            <button onClick={handleDeleteSelected} className="action-button delete-btn">🗑️ 선택 자산 모두 삭제</button>
        </div>
      </div>
    );
  }

  if (!editableAsset || !selectedAsset) return null;

  return (
    <div className="properties-editor-container">
      <div className="editor-header">
        <h3 className="editor-title">속성: {selectedAsset.name}</h3>
        <button onClick={() => updateAsset(selectedAsset.id, { isLocked: !selectedAsset.isLocked })} className="lock-toggle-button">
          {selectedAsset.isLocked ? '🔓' : '🔒'}
        </button>
      </div>

      <div className="accordion-section">
        <button onClick={() => toggleSection('basic')} className="accordion-header"><span>{openSections.basic ? '▼' : '▶'} 기본</span></button>
        {openSections.basic && <div className="accordion-content">
          <div className="input-group"><label className="input-label">이름</label><input type="text" name="name" className="input-field" value={editableAsset.name || ''} onChange={handleChange} disabled={selectedAsset.isLocked} /></div>
          
          {/* --- [추가] 랙 U 높이 선택 드롭다운 --- */}
          {selectedAsset.assetType === 'rack' && (
            <div className="input-group">
              <label className="input-label">랙 높이 (U)</label>
              <select name="uHeight" className="input-field" value={editableAsset.uHeight || 42} onChange={handleChange} disabled={selectedAsset.isLocked}>
                <option value="42">42U</option>
                <option value="45">45U</option>
                <option value="48">48U</option>
                <option value="52">52U</option>
              </select>
            </div>
          )}
          {/* --- U 높이 드롭다운 끝 --- */}

          <div className="input-row">
            <div className="input-group"><label className="input-label">X</label><input type="number" name="gridX" className="input-field" value={editableAsset.gridX ?? ''} onChange={handleChange} disabled={selectedAsset.isLocked} /></div>
            <div className="input-group"><label className="input-label">Y</label><input type="number" name="gridY" className="input-field" value={editableAsset.gridY ?? ''} onChange={handleChange} disabled={selectedAsset.isLocked} /></div>
          </div>
          <div className="input-row">
             <div className="input-group"><label className="input-label">너비(칸)</label><input type="number" name="widthInCells" className="input-field" min="1" value={editableAsset.widthInCells ?? 1} onChange={handleChange} disabled={selectedAsset.isLocked} /></div>
             <div className="input-group"><label className="input-label">높이(칸)</label><input type="number" name="heightInCells" className="input-field" min="1" value={editableAsset.heightInCells ?? 1} onChange={handleChange} disabled={selectedAsset.isLocked} /></div>
          </div>
          <div className="input-group"><label className="input-label">회전: {editableAsset.rotation || 0}°</label>
            <div className="rotation-buttons">
              <button onClick={() => handleRotate('ccw')} className="rotation-btn" disabled={selectedAsset.isLocked}>↺ -45°</button>
              <button onClick={() => handleRotate('cw')} className="rotation-btn" disabled={selectedAsset.isLocked}>↻ +45°</button>
            </div>
          </div>
          {selectedAsset.assetType === 'rack' && <div className="input-group"><label className="input-label">문 방향</label><select name="doorDirection" className="input-field" value={editableAsset.doorDirection || 'north'} onChange={handleChange} disabled={selectedAsset.isLocked}><option value="north">북</option><option value="south">남</option><option value="east">동</option><option value="west">서</option></select></div>}
        </div>}
      </div>

      <div className="accordion-section">
         <button onClick={() => toggleSection('visual')} className="accordion-header"><span>{openSections.visual ? '▼' : '▶'} 시각</span></button>
         {openSections.visual && <div className="accordion-content">
            <div className="input-group"><label className="input-label">색상</label>
                <div className="color-preset-grid">
                    {COLOR_PRESETS.map(color => <button key={color} className="color-preset-btn" style={{ backgroundColor: color }} onClick={() => updateAsset(selectedAsset.id, { customColor: color })} disabled={selectedAsset.isLocked}>{editableAsset.customColor === color && '✓'}</button>)}
                </div>
                <input type="color" name="customColor" className="color-picker" value={editableAsset.customColor || '#ecf0f1'} onChange={handleChange} disabled={selectedAsset.isLocked} />
            </div>
            <div className="input-group"><label className="input-label">투명도: {Math.round((editableAsset.opacity ?? 0.8) * 100)}%</label><input type="range" name="opacity" className="range-slider" min="0" max="1" step="0.1" value={editableAsset.opacity ?? 0.8} onChange={handleChange} disabled={selectedAsset.isLocked} /></div>
         </div>}
      </div>
      
      <div className="accordion-section">
        <button onClick={() => toggleSection('metadata')} className="accordion-header"><span>{openSections.metadata ? '▼' : '▶'} 메타데이터</span></button>
        {openSections.metadata && <div className="accordion-content">
            <div className="input-group"><label className="input-label">설명</label><textarea name="description" className="textarea-field" rows={3} value={editableAsset.description || ''} onChange={handleChange} disabled={selectedAsset.isLocked} /></div>
            {selectedAsset.createdAt && <div className="meta-info"><p className="meta-text">생성: {new Date(selectedAsset.createdAt).toLocaleString('ko-KR')}</p>{selectedAsset.updatedAt && <p className="meta-text">수정: {new Date(selectedAsset.updatedAt).toLocaleString('ko-KR')}</p>}</div>}
        </div>}
      </div>

      <div className="accordion-section">
        <button onClick={() => toggleSection('advanced')} className="accordion-header"><span>{openSections.advanced ? '▼' : '▶'} 고급</span></button>
        {openSections.advanced && <div className="accordion-content">
            <button className="action-button duplicate-btn" onClick={() => duplicateAsset(selectedAsset.id)}>📋 복제</button>
            <button className="action-button delete-btn" onClick={() => { if(window.confirm(`"${selectedAsset.name}" 자산을 삭제하시겠습니까?`)) deleteAsset(selectedAsset.id)}}>🗑️ 삭제</button>
        </div>}
      </div>
    </div>
  );
};

export default PropertiesEditor;
