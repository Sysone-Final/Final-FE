import type { Equipment3D, EquipmentType as EquipmentType3D } from '../../view3d/types';
import type { Asset, AssetType as AssetType2D, AssetLayer } from '../types';

const equipmentTypeMap: Record<EquipmentType3D, AssetType2D | null> = {
  server: 'rack',
  door: 'door_single',
  climatic_chamber: 'crac', // 항온항습기
  fire_extinguisher: 'fire_suppression', // 소화기
  aircon: 'in_row_cooling', // 에어컨 (인로우 쿨링으로 매핑)
  thermometer: null, // 2D 뷰에 해당 타입이 없으면 null
  // TODO: 2D/3D 타입이 추가되면 여기에 매핑
};

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
 * @param equipment3DList - 3D 뷰가 API로부터 받은 장비 목록
 * @returns 2D 뷰(Konva)가 사용할 수 있는 자산 목록
 */
export function transform3DTo2DAssets(equipment3DList: Equipment3D[]): Asset[] {
  const assets2D: Asset[] = [];

  for (const eq3D of equipment3DList) {
    const assetType2D = equipmentTypeMap[eq3D.type];

    if (!assetType2D) {
      continue;
    }

    const layer = layerMap[assetType2D];

    const rotationInDegrees = (eq3D.rotation * 180) / Math.PI;

    assets2D.push({
      id: eq3D.id, 
      name: eq3D.metadata?.name || eq3D.type,
      
      gridX: eq3D.gridX,
      gridY: eq3D.gridY,
      

      widthInCells: 1, 
      heightInCells: 1,
      
      assetType: assetType2D,
      layer: layer,
      rotation: rotationInDegrees,

      data: {
        rackServerId: eq3D.id,
      }
    });
  }

  return assets2D;
}