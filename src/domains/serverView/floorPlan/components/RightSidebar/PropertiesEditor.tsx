import React, { useState, useEffect, useMemo } from 'react';
import {
  useFloorPlanStore,
  updateServerRoomDetails,
  updateAsset,
  deleteAsset,
  duplicateAsset,
  groupSelectedAssets,
  ungroupSelectedAssets,
} from '../../store/floorPlanStore';
import type { Asset, UHeight } from '../../types';
import { useParams } from 'react-router-dom';
import { useConfirmationModal } from '../ConfirmationModal';

const COLOR_PRESETS = [
  // ... (preset colors) ...
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#9b59b6',
  '#3498db',
  '#2ecc71',
  '#1abc9c',
  '#34495e',
  '#95a5a6',
  '#ecf0f1',
];
const U_HEIGHT_OPTIONS: UHeight[] = [42, 45, 48, 52];

const PropertiesEditor: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();

  const { confirm } = useConfirmationModal();
  
  const gridCols = useFloorPlanStore((state) => state.gridCols);
  const gridRows = useFloorPlanStore((state) => state.gridRows);
  const assets = useFloorPlanStore((state) => state.assets);
  const selectedAssetIds = useFloorPlanStore(
    (state) => state.selectedAssetIds,
  );

  // const {} = useFloorPlanStore();

  const selectedAssets = assets.filter((asset) =>
    selectedAssetIds.includes(asset.id),
  );

  const isSingleSelection = selectedAssets.length === 1;
  const selectedAsset = isSingleSelection ? selectedAssets[0] : null;

  const [editableAsset, setEditableAsset] = useState<Partial<Asset> | null>(
    null,
  );
  const [openSections, setOpenSections] = useState({
    basic: true,
    visual: true,
    metadata: false,
    advanced: true,
  });

  const [localGridCols, setLocalGridCols] = useState(gridCols);
  const [localGridRows, setLocalGridRows] = useState(gridRows);

  useEffect(() => {
    setLocalGridCols(gridCols);
    setLocalGridRows(gridRows);
  }, [gridCols, gridRows]);

  useEffect(() => {
    setEditableAsset(selectedAsset);
  }, [selectedAsset]);

  const isSizeChanged = useMemo(
    () => localGridCols !== gridCols || localGridRows !== gridRows,
    [localGridCols, localGridRows, gridCols, gridRows],
  );

  const handleServerRoomSizeSave = () => {
    if (!roomId) return;
    confirm({
      title: '서버실 크기 변경',
      message: (
        <p>
          서버실 크기를 <strong>{localGridCols} x {localGridRows}</strong> (으)로
          변경하시겠습니까?
        </p>
      ),
      confirmText: '변경',
      confirmAction: () => {
        updateServerRoomDetails(roomId, {
          gridCols: localGridCols,
          gridRows: localGridRows,
        });
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (!editableAsset) return;
    const { name, value } = e.target;
    const numericFields = [
      'gridX',
      'gridY',
      'rotation',
      'widthInCells',
      'heightInCells',
      'opacity',
      'uHeight',
    ];
    const updatedValue = numericFields.includes(name)
      ? parseFloat(value) || 0
      : value;
    setEditableAsset((prev) =>
      prev ? { ...prev, [name]: updatedValue } : null,
    );
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (!selectedAsset || !editableAsset) return;
    const { name } = e.target;
    const key = name as keyof Asset;
    if (editableAsset[key] !== selectedAsset[key]) {
      console.log(`Updating store for [${key}]:`, editableAsset[key]);
      updateAsset(selectedAsset.id, { [key]: editableAsset[key] });
    }
  };

  const handleRotate = (direction: 'cw' | 'ccw') => {
    if (!selectedAsset) return;
    const currentRotation = editableAsset?.rotation || 0;
    const newRotation =
      direction === 'cw'
        ? (currentRotation + 45) % 360
        : (currentRotation - 45 + 360) % 360;
    setEditableAsset((prev) => (prev ? { ...prev, rotation: newRotation } : null));
    updateAsset(selectedAsset.id, { rotation: newRotation });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDeleteSelected = () => {
    confirm({
      title: '자산 삭제',
      message: (
        <p>
          선택한 <strong>{selectedAssetIds.length}개</strong> 자산을
          삭제하시겠습니까?
        </p>
      ),
      confirmText: '삭제',
      confirmAction: () => {
        selectedAssetIds.forEach((id) => deleteAsset(id));
      },
    });
  };

  if (selectedAssets.length === 0) {
    // (서버실 설정 UI)
    return (
      <div className="properties-editor-container h-full overflow-y-auto pr-2">
        <div className="editor-header">
          <h3 className="editor-title text-heading">서버실 설정</h3>
        </div>
        <div className="accordion-section">
          <div className="accordion-header text-heading">
            <span>▼ 크기 (Grid)</span>
          </div>
          <div className="accordion-content">
            <div className="input-row">
              <div className="input-group">
                <label className="input-label text-label-form">
                  가로 (Cols)
                </label>
                <input
                  type="number"
                  name="gridCols"
                  className="input-field"
                  min="1"
                  value={localGridCols}
                  onChange={(e) =>
                    setLocalGridCols(parseInt(e.target.value) || 1)
                  }
                />
              </div>
              <div className="input-group">
                <label className="input-label text-label-form">
                  세로 (Rows)
                </label>
                <input
                  type="number"
                  name="gridRows"
                  className="input-field"
                  min="1"
                  value={localGridRows}
                  onChange={(e) =>
                    setLocalGridRows(parseInt(e.target.value) || 1)
                  }
                />
              </div>
            </div>
            <button
              onClick={handleServerRoomSizeSave}
              className="action-button duplicate-btn text-button"
              disabled={!isSizeChanged}
            >
              💾 서버실 크기 저장
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isSingleSelection) {
    // (다중 선택 UI)
    return (
      <div className="properties-editor-container">
        <div className="editor-header">
          <h3 className="editor-title text-heading">
            {selectedAssetIds.length}개 자산 선택됨
          </h3>
        </div>
        <div className="p-2 flex flex-col gap-2">
          <button
            onClick={groupSelectedAssets} 
            className="action-button group-btn text-button"
          >
            🔗 그룹 만들기
          </button>
          <button
            onClick={ungroupSelectedAssets} 
            className="action-button group-btn text-button"
          >
            ✂️ 그룹 해제
          </button>
          <button
            onClick={handleDeleteSelected} 
            className="action-button delete-btn text-button"
          >
            🗑️ 선택 자산 모두 삭제
          </button>
        </div>
      </div>
    );
  }

  if (!editableAsset || !selectedAsset) return null;

  // (단일 선택 UI)
  return (
    <div className="properties-editor-container h-full overflow-y-auto pr-2">
      <div className="editor-header">
        <h3 className="editor-title">속성: {editableAsset.name}</h3>
        <button
          onClick={() =>
            updateAsset(selectedAsset.id, { 
              isLocked: !selectedAsset.isLocked,
            })
          }
          className="lock-toggle-button"
        >
          {editableAsset.isLocked ? '🔓' : '🔒'}
        </button>
      </div>

      {/* (기본 섹션) */}
      <div className="accordion-section">
        <button
          onClick={() => toggleSection('basic')}
          className="accordion-header text-heading"
        >
          <span>{openSections.basic ? '▼' : '▶'} 기본</span>
        </button>
        {openSections.basic && (
          <div className="accordion-content">
            {/* ( ... 폼 필드들 ... ) */}
            {/* 이름 */}
            <div className="input-group">
              <label className="input-label text-label-form">이름</label>
              <input
                type="text"
                name="name"
                className="input-field"
                value={editableAsset.name || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={selectedAsset.isLocked}
              />
            </div>
            {/* X, Y */}
            <div className="input-row">
              <div className="input-group">
                <label className="input-label text-label-form">X</label>
                <input
                  type="number"
                  name="gridX"
                  className="input-field"
                  value={editableAsset.gridX ?? ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={selectedAsset.isLocked}
                />
              </div>
              <div className="input-group">
                <label className="input-label text-label-form">Y</label>
                <input
                  type="number"
                  name="gridY"
                  className="input-field"
                  value={editableAsset.gridY ?? ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={selectedAsset.isLocked}
                />
              </div>
            </div>
            {/* 너비, 높이 */}
            <div className="input-row">
              <div className="input-group">
                <label className="input-label text-label-form">너비 (칸)</label>
                <input
                  type="number"
                  name="widthInCells"
                  className="input-field"
                  min="1"
                  value={editableAsset.widthInCells ?? 1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={selectedAsset.isLocked}
                />
              </div>
              <div className="input-group">
                <label className="input-label text-label-form">높이 (칸)</label>
                <input
                  type="number"
                  name="heightInCells"
                  className="input-field"
                  min="1"
                  value={editableAsset.heightInCells ?? 1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={selectedAsset.isLocked}
                />
              </div>
            </div>
            {/* U 높이 */}
            {selectedAsset.assetType === 'rack' && (
              <div className="input-group">
                <label className="input-label text-label-form">
                  랙 높이 (U)
                </label>
                <select
                  name="uHeight"
                  className="input-field"
                  value={editableAsset.uHeight || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={selectedAsset.isLocked}
                >
                  <option value="">선택 안 함</option>
                  {U_HEIGHT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}U
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* 회전 */}
            <div className="input-group">
              <label className="input-label text-label-form">
                회전: {editableAsset.rotation || 0}°
              </label>
              <div className="rotation-buttons">
                <button
                  onClick={() => handleRotate('ccw')}
                  className="rotation-btn text-button"
                  disabled={selectedAsset.isLocked}
                >
                  ↺ -45°
                </button>
                <button
                  onClick={() => handleRotate('cw')}
                  className="rotation-btn text-button"
                  disabled={selectedAsset.isLocked}
                >
                  ↻ +45°
                </button>
              </div>
            </div>
            {/* 문 방향 */}
            {(selectedAsset.assetType === 'rack' ||
              selectedAsset.assetType.startsWith('door')) && (
              <div className="input-group">
                <label className="input-label text-label-form">문 방향</label>
                <select
                  name="doorDirection"
                  className="input-field"
                  value={editableAsset.doorDirection || 'north'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={selectedAsset.isLocked}
                >
                  <option value="north">북</option>
                  <option value="south">남</option>
                  <option value="east">동</option>
                  <option value="west">서</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* (시각 섹션) */}
      <div className="accordion-section">
        <button
          onClick={() => toggleSection('visual')}
          className="accordion-header text-heading"
        >
          <span>{openSections.visual ? '▼' : '▶'} 시각</span>
        </button>
        {openSections.visual && (
          <div className="accordion-content">
            {/* ( ... 폼 필드들 ... ) */}
            {/* 색상 */}
            <div className="input-group">
              <label className="input-label text-label-form">색상</label>
              <div className="color-preset-grid">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    className="color-preset-btn"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setEditableAsset((prev) =>
                        prev ? { ...prev, customColor: color } : null,
                      );
                      updateAsset(selectedAsset.id, { customColor: color });
                    }}
                    disabled={selectedAsset.isLocked}
                  >
                    {editableAsset.customColor === color && '✓'}
                  </button>
                ))}
              </div>
              <input
                type="color"
                name="customColor"
                className="color-picker"
                value={editableAsset.customColor || '#ecf0f1'}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={selectedAsset.isLocked}
              />
            </div>
            {/* 투명도 */}
            <div className="input-group">
              <label className="input-label text-label-form">
                투명도: {Math.round((editableAsset.opacity ?? 1) * 100)}%
              </label>
              <input
                type="range"
                name="opacity"
                className="range-slider"
                min="0"
                max="1"
                step="0.1"
                value={editableAsset.opacity ?? 1}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={selectedAsset.isLocked}
              />
            </div>
          </div>
        )}
      </div>

      {/* (메타데이터 섹션) */}
      <div className="accordion-section">
        <button
          onClick={() => toggleSection('metadata')}
          className="accordion-header text-heading"
        >
          <span>{openSections.metadata ? '▼' : '▶'} 메타데이터</span>
        </button>
        {openSections.metadata && (
          <div className="accordion-content">
            {/* ( ... 폼 필드들 ... ) */}
            <div className="input-group">
              <label className="input-label text-label-form">설명</label>
              <textarea
                name="description"
                className="textarea-field"
                rows={3}
                value={editableAsset.description || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={selectedAsset.isLocked}
              />
            </div>
            {selectedAsset.createdAt && (
              <div className="meta-info">
                <p className="meta-text text-meta">
                  생성:{' '}
                  {new Date(selectedAsset.createdAt).toLocaleString('ko-KR')}
                </p>
                {selectedAsset.updatedAt && (
                  <p className="meta-text text-meta">
                    수정:{' '}
                    {new Date(selectedAsset.updatedAt).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* (고급 섹션) */}
      <div className="accordion-section">
        <button
          onClick={() => toggleSection('advanced')}
          className="accordion-header text-heading"
        >
          <span>{openSections.advanced ? '▼' : '▶'} 고급</span>
        </button>
        {openSections.advanced && (
          <div className="accordion-content">
            <button
              className="action-button duplicate-btn text-button"
              onClick={() => duplicateAsset(selectedAsset.id)} 
            >
              📋 복제
            </button>
            <button
              className="action-button delete-btn text-button"
              onClick={() => {
                confirm({
                  title: '자산 삭제',
                  message: (
                    <p>
                      "<strong>{selectedAsset.name}</strong>" 자산을
                      삭제하시겠습니까?
                    </p>
                  ),
                  confirmText: '삭제',
                  confirmAction: () => deleteAsset(selectedAsset.id), 
                });
              }}
            >
              🗑️ 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesEditor;