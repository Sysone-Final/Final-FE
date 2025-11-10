export type EquipmentType =
  | "SERVER"
  | "SWITCH"
  | "ROUTER"
  | "STORAGE"
  | "FIREWALL"
  | "LOAD_BALANCE"
  | "KVM";

export type EquipmentStatus = "NORMAL" | "WARNING" | "ERROR" | "MAINTENANCE";

export type EquipmentPosition = "FRONT" | "BACK";

export interface Equipments {
  id: number;
  equipmentName: string;
  equipmentCode: string | null;
  equipmentType: string;
  status: string;
  startUnit: number;
  unitSize: number;
  modelName: string | null;
  manufacturer: string | null;
  ipAddress: string | null;
  positionType: string;
  powerConsumption: number | null;
}

export interface Rack {
  rackName: string;
  rackId: number;
  serverRoomId: number;
}

export interface RackEquipmentsResult {
  rack: Rack;
  equipments: Equipments[];
  totalEquipmentCount: number;
}

export interface DeviceCard {
  key: string;
  label: string;
  size: string;
  img: string;
  height: number;
  type: EquipmentType;
}

export interface FloatingDevice {
  card: DeviceCard;
  mouseY: number;
}
