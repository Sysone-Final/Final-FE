export type EquipmentType =
  | "SERVER"
  | "SWITCH"
  | "ROUTER"
  | "STORAGE"
  | "FIREWALL"
  | "LOAD_BALANCER"
  | "KVM";

export type EquipmentStatus =
  | "NORMAL"
  | "WARNING"
  | "ERROR"
  | "MAINTENANCE"
  | "POWERED_OFF"
  | "DECOMMISSIONED";

export interface RackDevice {
  equipmentId: number;
  equipmentName: string;
  equipmentCode: string;
  equipmentType: EquipmentType;
  status: EquipmentStatus;
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
