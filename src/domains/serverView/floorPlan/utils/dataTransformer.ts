import type { Equipment3D, EquipmentType as EquipmentType3D, GridConfig } from '../../view3d/types';
import type { Asset, AssetType as AssetType2D, AssetLayer } from '../types';

// 3D 뷰의 장비 타입 -> 2D 뷰의 장비 타입 매핑
const equipmentTypeMap: Record<EquipmentType3D, AssetType2D | null> = {
  server: 'rack',
  door: 'door_single',
  climatic_chamber: 'crac', // 항온항습기
  fire_extinguisher: 'fire_suppression', // 소화기
  aircon: 'in_row_cooling', // 에어컨 (인로우 쿨링으로 매핑)
  thermometer: 'leak_sensor', // 온도계 -> 누수 센서로 임시 매핑
  // TODO: 2D/3D 타입이 추가되면 여기에 매핑
};

// 2D 뷰의 장비 타입 -> 3D 뷰의 장비 타입 역매핑
const assetToEquipmentTypeMap: Record<AssetType2D, EquipmentType3D | null> = {
  rack: 'server',
  door_single: 'door',
  door_double: 'door',
  door_sliding: 'door',
  crac: 'climatic_chamber',
  fire_suppression: 'fire_extinguisher',
  in_row_cooling: 'aircon',
  leak_sensor: 'thermometer',
  // 나머지는 3D에 매핑되지 않음
  wall: null,
  pillar: null,
  ramp: null,
  storage: null,
  mainframe: null,
  crash_cart: null,
  ups_battery: null,
  power_panel: null,
  speed_gate: null,
  access_control: null,
  epo: null,
  aisle_containment: null,
  cctv: null,
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
  
  const total2DRows = gridConfig.rows || 8;
  
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

    assets2D.push({
      id: eq3D.id,
      name: eq3D.metadata?.name || eq3D.type,

      gridX: eq3D.gridX, 
      gridY: maxGridY - eq3D.gridY, 
      

      widthInCells: assetWidth,
      heightInCells: assetHeight,
      assetType: assetType2D,
      layer: layer,
      rotation: rotationInDegrees,
      rackDoorDirection: eq3D.doorDirection, // 랙의 문 방향 (server 타입인 경우)
      data: {
        rackServerId: eq3D.rackId || undefined, // rackId를 저장 (server 타입인 경우)
      },
    });
  }

  return assets2D;
}

/**
 * 2D 뷰의 Asset을 3D 뷰의 Equipment3D로 변환합니다.
 * @param asset2D - 2D 뷰의 자산
 * @param gridConfig - 그리드 설정 (좌표 반전을 위해 필요)
 * @returns 3D API에 전송할 수 있는 Equipment3D 객체
 */
export function transform2DToEquipment(
  asset2D: Partial<Asset>,
  gridConfig: GridConfig,
): Partial<Equipment3D> | null {
  const equipmentType = asset2D.assetType 
    ? assetToEquipmentTypeMap[asset2D.assetType] 
    : null;
  
  if (!equipmentType) {
    console.warn(`Asset type ${asset2D.assetType} cannot be mapped to 3D equipment type`);
    return null;
  }

  const total2DRows = gridConfig.rows || 8;
  const maxGridY = total2DRows - 1;

  // 2D 좌표 -> 3D 좌표로 변환
  const gridX = asset2D.gridX ?? 0;
  const gridY = maxGridY - (asset2D.gridY ?? 0);

  return {
    id: asset2D.id,
    equipmentId: asset2D.id,
    type: equipmentType,
    gridX: gridX,
    gridY: gridY,
    gridZ: 0,
    rotation: ((asset2D.rotation || 0) * Math.PI) / 180, // degree -> radian
    rackId: asset2D.data?.rackServerId?.toString(),
    doorDirection: asset2D.rackDoorDirection, // 랙의 문 방향
    metadata: {
      name: asset2D.name,
      status: asset2D.status,
    },
  };
}