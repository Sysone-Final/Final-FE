import type { Equipment3D, EquipmentType as EquipmentType3D, GridConfig } from '../../view3d/types';
import type { Asset, AssetType as AssetType2D, AssetLayer } from '../types';

// 3D 뷰의 장비 타입 -> 2D 뷰의 장비 타입 매핑
const equipmentTypeMap: Record<EquipmentType3D, AssetType2D | null> = {
  server: 'rack',
  door: 'door_single',
  climatic_chamber: 'crac', // 항온항습기
  fire_extinguisher: 'fire_suppression', // 소화기
  aircon: 'in_row_cooling', // 에어컨 (인로우 쿨링으로 매핑)
  thermometer: null, // 2D 뷰에 해당 타입이 없으면 null
  // TODO: 2D/3D 타입이 추가되면 여기에 매핑
};

// 2D 뷰의 장비 타입 -> 2D 뷰의 레이어 매핑
const layerMap: Record<AssetType2D, AssetLayer> = {
  rack: 'floor',
  wall: 'floor',
  pillar: 'floor',
  ramp: 'floor',
  storage: 'floor',
  mainframe: 'floor',
  crash_cart: 'floor',
  crac: 'floor',
  in_row_cooling: 'floor',
  ups_battery: 'floor',
  power_panel: 'floor',
  speed_gate: 'floor',
  fire_suppression: 'floor',
  door_single: 'wall',
  door_double: 'wall',
  door_sliding: 'wall',
  access_control: 'wall',
  epo: 'wall',
  aisle_containment: 'overhead',
  cctv: 'overhead',
  leak_sensor: 'overhead',
};

/**
 * 3D 뷰의 Equipment3D[] 데이터를 2D 뷰의 Asset[] 데이터로 변환합니다.
 * @param equipment3DList - 3D 뷰가 API로부터 받은 장비 목록
 * @param gridConfig - 3D 뷰로부터 받은 그리드 설정 (좌표 반전을 위해 필요)
 * @returns 2D 뷰(Konva)가 사용할 수 있는 자산 목록
 */
export function transform3DTo2DAssets(
  equipment3DList: Equipment3D[],
  gridConfig: GridConfig, // 인자 받기
): Asset[] {
  const assets2D: Asset[] = [];
  
  const total2DRows = (gridConfig.rows || 8) + 2;
  
  const maxGridY = total2DRows - 1;

  for (const eq3D of equipment3DList) {
    
    const assetType2D = equipmentTypeMap[eq3D.type];



    if (!assetType2D) { 
      continue;
    }

    const layer = layerMap[assetType2D];
    
  
    const rotationInDegrees = (eq3D.rotation * 180) / Math.PI;

    let assetWidth = 1;
    let assetHeight = 1;

    if (assetType2D.startsWith('door_')) {
      assetWidth = 1;      
      assetHeight = 0.25;  
    }

    const paddedGridX = eq3D.gridX + 1;
    const paddedGridY = eq3D.gridY + 1;

    assets2D.push({
      id: eq3D.id,
      name: eq3D.metadata?.name || eq3D.type,

      gridX: paddedGridX, 
      gridY: maxGridY - paddedGridY, 
      

      widthInCells: assetWidth,
      heightInCells: assetHeight,
      assetType: assetType2D,
      layer: layer,
      rotation: rotationInDegrees,
      data: {
        rackServerId: eq3D.rackId || undefined, // rackId를 저장 (server 타입인 경우)
      },
    });
  }

  return assets2D;
}