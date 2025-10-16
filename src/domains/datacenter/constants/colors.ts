import type { EquipmentType } from '../types';

export interface CubeColors {
  top: string;
  left: string;
  right: string;
  back: string;
  front: string;
  bottom: string;
}

//장비 유형별 색상
export const EQUIPMENT_COLORS: Record<EquipmentType, CubeColors> = {
  server: {
    top: '#5599FF', 
    left: '#4488EE', 
    right: '#3377DD',
    back: '#2266CC',
    front: '#1155BB',
    bottom: '#0044AA'
  },
  storage: {
    top: '#FF9933', 
    left: '#EE8822', 
    right: '#DD7711',
    back: '#CC6600',
    front: '#BB5500',
    bottom: '#AA4400'
  },
  network: {
    top: '#66CC33', 
    left: '#55BB22', 
    right: '#44AA11',
    back: '#339900',
    front: '#228800',
    bottom: '#117700'
  },
  ups: {
    top: '#FF3366', 
    left: '#EE2255', 
    right: '#DD1144',
    back: '#CC0033',
    front: '#BB0022',
    bottom: '#AA0011'
  },
  ac: {
    top: '#9966FF', 
    left: '#8855EE', 
    right: '#7744DD',
    back: '#6633CC',
    front: '#5522BB',
    bottom: '#4411AA'
  }
};

//기본색상
export const DEFAULT_COLORS: CubeColors = {
  top: '#33CCAA', 
  left: '#22BB99', 
  right: '#11AA88',
  back: '#009977',
  front: '#008866',
  bottom: '#007755'
};

/**
 * 장비 타입에 따른 색상 가져오기
 * @param type - 장비 타입
 * @returns 해당 타입의 색상 객체
 */
export const getEquipmentColors = (type: EquipmentType): CubeColors => {
  return EQUIPMENT_COLORS[type] || DEFAULT_COLORS;
};