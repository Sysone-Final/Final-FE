export interface RackDevice {
  id: number;
  name: string;
  position: number;
  height: number;
  color?: string;
}

export interface DeviceCard {
  key: string;
  label: string;
  size: string;
  img: string;
  borderColor: string;
  height: number;
}

export interface FloatingDevice {
  card: DeviceCard;
  mouseY: number;
}
