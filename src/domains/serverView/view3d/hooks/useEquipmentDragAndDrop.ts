import { useCallback } from 'react';
import type { Scene } from '@babylonjs/core';
import { useBabylonDatacenterStore } from '../stores/useBabylonDatacenterStore';
import { createDevice } from '../api/serverRoomEquipmentApi';
import { getNextDeviceNumber, generateDeviceName } from '../utils/deviceNameGenerator';
import type { EquipmentType, GridConfig } from '../../types';
import type { ToastSeverity } from './useToast';

interface UseEquipmentDragAndDropParams {
  serverRoomId?: string;
  gridConfig: GridConfig;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  sceneRef: React.RefObject<Scene | null>;
  showToast: (message: string, severity?: ToastSeverity) => void;
}

/** 드래그앤드롭으로 장비 추가 */
export function useEquipmentDragAndDrop({
  serverRoomId,
  gridConfig,
  canvasRef,
  sceneRef,
  showToast,
}: UseEquipmentDragAndDropParams) {
  const { equipment, isValidPosition, isPositionOccupied } = useBabylonDatacenterStore();

  // 화면 좌표 → 격자 좌표 변환
  const screenToGrid = useCallback(
    (clientX: number, clientY: number): { gridX: number; gridY: number } | null => {
      const canvas = canvasRef.current;
      const scene = sceneRef.current;
      if (!canvas || !scene) return null;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const pickResult = scene.pick(x, y, (mesh) => mesh.name === 'ground');

      if (pickResult?.hit && pickResult.pickedPoint) {
        const worldX = pickResult.pickedPoint.x;
        const worldZ = pickResult.pickedPoint.z;

        const gridX = Math.floor(worldX / gridConfig.cellSize);
        const gridY = Math.floor(worldZ / gridConfig.cellSize);

        return { gridX, gridY };
      }

      return null;
    },
    [canvasRef, sceneRef, gridConfig.cellSize]
  );

  // 드롭 핸들러
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();

      if (!serverRoomId) {
        showToast('서버실 ID가 없습니다', 'error');
        return;
      }

      const equipmentType = e.dataTransfer.getData('equipmentType') as EquipmentType;
      if (!equipmentType) return;

      const gridPos = screenToGrid(e.clientX, e.clientY);

      if (!gridPos) {
        showToast('격자 범위를 벗어났습니다', 'error');
        return;
      }

      const { gridX, gridY } = gridPos;

      if (!isValidPosition(gridX, gridY)) {
        showToast('격자 범위를 벗어났습니다', 'error');
        return;
      }

      if (isPositionOccupied(gridX, gridY)) {
        showToast('이미 장치가 배치되어 있습니다', 'error');
        return;
      }

      try {
        const nextNumber = getNextDeviceNumber(equipment, equipmentType, serverRoomId);
        const deviceName = generateDeviceName(equipmentType, serverRoomId, nextNumber);

        const createdEquipment = await createDevice(
          {
            type: equipmentType,
            gridX,
            gridY,
            gridZ: 0,
            rotation: 0,
            metadata: {
              name: deviceName,
              status: 'NORMAL',
            },
          },
          Number(serverRoomId),
          equipment
        );

        useBabylonDatacenterStore.setState((state) => ({
          equipment: [...state.equipment, createdEquipment],
        }));

        showToast('장치가 추가되었습니다', 'success');
      } catch (error) {
        console.error('Failed to add equipment:', error);
        showToast('장치 추가에 실패했습니다', 'error');
      }
    },
    [
      serverRoomId,
      screenToGrid,
      isValidPosition,
      isPositionOccupied,
      equipment,
      showToast,
    ]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return {
    handleDrop,
    handleDragOver,
    screenToGrid,
  };
}
