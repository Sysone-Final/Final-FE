import { useMemo } from 'react';
import type { DatacenterEquipment } from '../types';
import { createDatacenterEquipmentLayout } from '../data/equipmentLayouts';

interface UseDatacenterEquipmentProps {
  gridSize: number;
  cubeSize: number;
}

/**
 * @param gridSize - 격자 크기
 * @param cubeSize - 큐브 크기
 * @returns 장비 배치 데이터 배열
 */
export function useDatacenterEquipment({ gridSize, cubeSize }: UseDatacenterEquipmentProps): DatacenterEquipment[] {
  const equipmentData = useMemo(() => 
    createDatacenterEquipmentLayout(gridSize, cubeSize), 
    [gridSize, cubeSize]
  );

  return equipmentData;
}