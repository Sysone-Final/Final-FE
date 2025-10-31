import React, { useState, useEffect, useMemo } from 'react';
import {
  useFloorPlanStore,
  updateServerRoomDetails,
  updateAsset, // updateAsset을 store에서 직접 가져옵니다.
} from '../../store/floorPlanStore';
import type { Asset, UHeight } from '../../types';
import { useParams } from 'react-router-dom';

const COLOR_PRESETS = [
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

  // --- [*** 1. 오류 수정 ***] ---
  // 스토어에서 값을 객체로 한번에 가져오지 않고, 개별적으로 선택합니다.
  // 이렇게 하면 스토어의 다른 값이 변경되어도 이 값들이 변하지 않으면 리렌더링되지 않습니다.
  const gridCols = useFloorPlanStore((state) => state.gridCols);
  const gridRows = useFloorPlanStore((state) => state.gridRows);
  const assets = useFloorPlanStore((state) => state.assets);
  const selectedAssetIds = useFloorPlanStore(
    (state) => state.selectedAssetIds,
  );
  const {
    deleteAsset,
    duplicateAsset,
    groupSelectedAssets,
    ungroupSelectedAssets,
  } = useFloorPlanStore();
  // --- (수정 끝) ---

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

  // 스토어(gridCols, gridRows)가 바뀌면 로컬 상태 업데이트
  useEffect(() => {
    setLocalGridCols(gridCols);
    setLocalGridRows(gridRows);
  }, [gridCols, gridRows]);

  // 스토어(selectedAsset)가 바뀌면 로컬 편집 상태(editableAsset) 업데이트
  useEffect(() => {
    setEditableAsset(selectedAsset);
  }, [selectedAsset]);

  const isSizeChanged = useMemo(
    () => localGridCols !== gridCols || localGridRows !== gridRows,
    [localGridCols, localGridRows, gridCols, gridRows],
  );

  const handleServerRoomSizeSave = () => {
    if (!roomId) return;
    if (
      window.confirm(
        `서버실 크기를 ${localGridCols} x ${localGridRows} (으)로 변경하시겠습니까?`,
      )
    ) {
      updateServerRoomDetails(roomId, {
        gridCols: localGridCols,
        gridRows: localGridRows,
      });
    }
  };

  // --- [*** 2. 오류 수정 (로직 변경) ***] ---
  // handleChange: 키 입력 시 *로컬* 상태(editableAsset)만 즉시 업데이트합니다.
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

    // 스토어(updateAsset)를 바로 호출하지 않고, 로컬 상태만 업데이트
    setEditableAsset((prev) =>
      prev ? { ...prev, [name]: updatedValue } : null,
    );
  };

  // handleBlur: 입력창에서 포커스가 벗어났을 때(onBlur) *글로벌* 스토어(updateAsset)를 업데이트합니다.
  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (!selectedAsset || !editableAsset) return;

    const { name } = e.target;
    const key = name as keyof Asset;

    // 로컬 상태와 스토어 상태가 다를 때만 스토어 업데이트
    if (editableAsset[key] !== selectedAsset[key]) {
      console.log(`Updating store for [${key}]:`, editableAsset[key]);
      updateAsset(selectedAsset.id, { [key]: editableAsset[key] });
    }
  };
  // --- (수정 끝) ---

  const handleRotate = (direction: 'cw' | 'ccw') => {
    if (!selectedAsset) return;
    const currentRotation = editableAsset?.rotation || 0; // editableAsset 기준으로 변경
    const newRotation =
      direction === 'cw'
        ? (currentRotation + 45) % 360
        : (currentRotation - 45 + 360) % 360;
    
    // 로컬과 글로벌 동시 업데이트 (회전은 즉시 반영)
    setEditableAsset((prev) => (prev ? { ...prev, rotation: newRotation } : null));
    updateAsset(selectedAsset.id, { rotation: newRotation });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDeleteSelected = () => {
    if (
      window.confirm(`선택한 ${selectedAssetIds.length}개 자산을 삭제하시겠습니까?`)
    ) {
      selectedAssetIds.forEach((id) => deleteAsset(id));
    }
  };

  if (selectedAssets.length === 0) {
    // (서버실 설정 UI - 이상 없음)
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
    // (다중 선택 UI - 이상 없음)
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

      <div className="accordion-section">
        <button
          onClick={() => toggleSection('basic')}
          className="accordion-header text-heading"
        >
          <span>{openSections.basic ? '▼' : '▶'} 기본</span>
        </button>
        {openSections.basic && (
          <div className="accordion-content">
            {/* --- [*** 2. 오류 수정 (적용) ***] ---
                모든 입력 필드에 onBlur={handleBlur}를 추가합니다. */}
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

      <div className="accordion-section">
        <button
          onClick={() => toggleSection('visual')}
          className="accordion-header text-heading"
        >
          <span>{openSections.visual ? '▼' : '▶'} 시각</span>
        </button>
        {openSections.visual && (
          <div className="accordion-content">
            <div className="input-group">
              <label className="input-label text-label-form">색상</label>
              <div className="color-preset-grid">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    className="color-preset-btn"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      // 색상/투명도 등은 즉시 반영 (로컬 + 글로벌 동시)
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
                onChange={handleChange} // 로컬에만 반영
                onBlur={handleBlur} // 스토어에 반영
                disabled={selectedAsset.isLocked}
              />
            </div>
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
                onChange={handleChange} // 로컬에만 반영
                onBlur={handleBlur} // 스토어에 반영
                disabled={selectedAsset.isLocked}
              />
            </div>
          </div>
        )}
      </div>

      <div className="accordion-section">
        <button
          onClick={() => toggleSection('metadata')}
          className="accordion-header text-heading"
        >
          <span>{openSections.metadata ? '▼' : '▶'} 메타데이터</span>
        </button>
        {openSections.metadata && (
          <div className="accordion-content">
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
                if (
                  window.confirm(`"${selectedAsset.name}" 자산을 삭제하시겠습니까?`)
                )
                  deleteAsset(selectedAsset.id);
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

