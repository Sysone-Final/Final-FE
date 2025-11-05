import { useState, useCallback, useEffect } from "react";
import type { RackDevice, FloatingDevice, DeviceCard } from "../types";
import { checkCollision } from "../utils/rackCollisionDetection";

interface UseRackManagerProps {
  initialDevices?: RackDevice[];
}

export function useRackManager({
  initialDevices = [],
}: UseRackManagerProps = {}) {
  const [installedDevices, setInstalledDevices] = useState<RackDevice[]>([]);

  const [floatingDevice, setFloatingDevice] = useState<FloatingDevice | null>(
    null
  );
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (initialDevices.length > 0) {
      setInstalledDevices(initialDevices);
    }
  }, [initialDevices]);

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
          (d) => d.equipmentId === deviceId
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
          deviceId
        );

        if (hasCollision) {
          console.log("이동할 수 없습니다. 다른 장비와 겹칩니다.");
          setResetKey((prev) => prev + 1);
          return prevDevices;
        }

        return prevDevices.map((device) =>
          device.equipmentId === deviceId
            ? { ...device, position: newPosition }
            : device
        );
      });
    },
    []
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
          prevDevices
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
      prev.filter((d) => d.equipmentId !== deviceId)
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
