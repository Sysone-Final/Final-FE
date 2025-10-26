export type DeviceType =
  | "server"
  | "switch"
  | "router"
  | "storage"
  | "firewall"
  | "loadbalancer"
  | "pdu"
  | "kvm"
  | "other";

export interface RackDevice {
  id: number;
  name: string;
  type: DeviceType;
  position: number;
  height: number;
  color?: string;
}

export interface DeviceCard {
  key: string;
  label: string;
  size: string;
  img: string;
  height: number;
  type: DeviceType;
}

export interface FloatingDevice {
  card: DeviceCard;
  mouseY: number;
}
