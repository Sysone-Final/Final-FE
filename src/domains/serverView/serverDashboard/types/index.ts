import type { Equipments } from "../../rack/types/index";

export interface UpdateEquipmentRequest
  extends Pick<
    Equipments,
    "equipmentName" | "equipmentType" | "startUnit" | "unitSize" | "status"
  > {
  serverRoomId: number;
  rackId: number;
  cpuThresholdWarning: number;
  cpuThresholdCritical: number;
  memoryThresholdWarning: number;
  memoryThresholdCritical: number;
  diskThresholdWarning: number;
  diskThresholdCritical: number;
}
