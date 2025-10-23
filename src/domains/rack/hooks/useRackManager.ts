import { useState, useCallback } from "react";
import type { RackDevice, FloatingDevice, DeviceCard } from "../types";
import { typeColorMap } from "../utils/colorMap";
import { checkCollision } from "../utils/rackCollisionDetection";

export function useRackManager() {
  const [installedDevices, setInstalledDevices] = useState<RackDevice[]>([
    {
      id: 1,
      name: "Server_1",
      type: "server",
      position: 1,
      height: 1,
      color: typeColorMap["server"],
    },
    {
      id: 2,
      name: "Firewall_1",
      type: "firewall",
      position: 3,
      height: 1,
      color: typeColorMap["firewall"],
    },
    {
      id: 3,
      name: "UPS_5F",
      type: "other",
      position: 4,
      height: 3,
      color: typeColorMap["other"],
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
        const draggedDevice = prevDevices.find((d) => d.id === deviceId);
        if (!draggedDevice) return prevDevices;

        if (draggedDevice.position === newPosition) {
          return prevDevices;
        }

        const hasCollision = checkCollision(
          {
            position: newPosition,
            height: draggedDevice.height,
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
          device.id === deviceId
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

      const color = typeColorMap[prevFloating.card.type] || "#334155";
      const newDevice: RackDevice = {
        id: Date.now(),
        name: prevFloating.card.label,
        type: prevFloating.card.type,
        position,
        height: prevFloating.card.height,
        color,
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

  return {
    installedDevices,
    floatingDevice,
    resetKey,
    handleCardClick,
    handleMouseMove,
    handleDeviceDragEnd,
    handleRackClick,
  };
}
