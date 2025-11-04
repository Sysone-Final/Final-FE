import { useState, useCallback } from "react";
import type { RackDevice, FloatingDevice, DeviceCard } from "../types";
import { checkCollision } from "../utils/rackCollisionDetection";

export function useRackManager() {
  const [installedDevices, setInstalledDevices] = useState<RackDevice[]>([
    {
      equipmentId: 1,
      equipmentName: "Dell PowerEdge R740",
      equipmentCode: "EQ-001",
      equipmentType: "SERVER",
      status: "NORMAL",
      startUnit: 1,
      unitSize: 2,
      rackName: "RACK-A01",
      modelName: "R740",
      manufacturer: "Dell",
      ipAddress: "192.168.1.10",
      powerConsumption: 500.0,
    },
    {
      equipmentId: 2,
      equipmentName: "HP ProLiant DL380",
      equipmentCode: "EQ-002",
      equipmentType: "SERVER",
      status: "WARNING",
      startUnit: 3,
      unitSize: 2,
      rackName: "RACK-A01",
      modelName: "DL380",
      manufacturer: "HP",
      ipAddress: "192.168.1.11",
      powerConsumption: 450.0,
    },
    {
      equipmentId: 3,
      equipmentName: "Cisco Catalyst 9300",
      equipmentCode: "EQ-003",
      equipmentType: "SWITCH",
      status: "NORMAL",
      startUnit: 5,
      unitSize: 1,
      rackName: "RACK-A01",
      modelName: "Catalyst 9300",
      manufacturer: "Cisco",
      ipAddress: "192.168.1.20",
      powerConsumption: 200.0,
    },
  ]);

  const [floatingDevice, setFloatingDevice] = useState<FloatingDevice | null>(
    null,
  );
  const [resetKey, setResetKey] = useState(0);

  // 카드 클릭 핸들러
  const handleCardClick = useCallback((card: DeviceCard) => {
    setFloatingDevice({
      card,
      mouseY: 0,
    });
  }, []);

  // 마우스 이동
  const handleMouseMove = useCallback((mouseY: number) => {
    setFloatingDevice((prev) => (prev ? { ...prev, mouseY } : null));
  }, []);

  // 드래그 종료 핸들러
  const handleDeviceDragEnd = useCallback(
    (deviceId: number, newPosition: number) => {
      setInstalledDevices((prevDevices) => {
        const draggedDevice = prevDevices.find(
          (d) => d.equipmentId === deviceId,
        );
        if (!draggedDevice) return prevDevices;

        if (draggedDevice.startUnit === newPosition) {
          return prevDevices;
        }

        const hasCollision = checkCollision(
          {
            position: newPosition,
            height: draggedDevice.unitSize,
          },
          prevDevices,
          deviceId,
        );

        if (hasCollision) {
          console.log("이동할 수 없습니다. 다른 장비와 겹칩니다.");
          setResetKey((prev) => prev + 1);
          return prevDevices;
        }

        return prevDevices.map((device) =>
          device.equipmentId === deviceId
            ? { ...device, position: newPosition }
            : device,
        );
      });
    },
    [],
  );

  // 랙 클릭 핸들러
  const handleRackClick = useCallback((position: number) => {
    setFloatingDevice((prevFloating) => {
      if (!prevFloating) return null;

      const newDevice: RackDevice = {
        equipmentId: Date.now(),
        equipmentName: prevFloating.card.label,
        equipmentCode: `EQ-${Date.now()}`,
        equipmentType: prevFloating.card.type,
        status: "NORMAL",
        startUnit: position,
        unitSize: prevFloating.card.height,
        rackName: "RACK-A01",
        modelName: "Unknown",
        manufacturer: "Unknown",
        ipAddress: "0.0.0.0",
        powerConsumption: 0,
      };

      setInstalledDevices((prevDevices) => {
        const hasCollision = checkCollision(
          {
            position,
            height: prevFloating.card.height,
          },
          prevDevices,
        );

        if (hasCollision) {
          console.log("이미 장비가 있습니다.");
          return prevDevices;
        }

        return [...prevDevices, newDevice];
      });
      return null;
    });
  }, []);

  //장비 삭제 함수 추가
  const removeDevice = (deviceId: number) => {
    setInstalledDevices((prev) =>
      prev.filter((d) => d.equipmentId !== deviceId),
    );
  };

  return {
    installedDevices,
    floatingDevice,
    resetKey,
    handleCardClick,
    handleMouseMove,
    handleDeviceDragEnd,
    handleRackClick,
    removeDevice,
  };
}
