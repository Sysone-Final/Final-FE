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
  equipmentId: number;
  equipmentName: string;
  equipmentCode: string;
  equipmentType: EquipmentType;
  status: EquipmentStatus;
  positionType: EquipmentPosition;
  startUnit: number;
  unitSize: number;
  rackName: string;
  modelName: string;
  manufacturer: string;
  ipAddress: string;
  powerConsumption: number;
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
