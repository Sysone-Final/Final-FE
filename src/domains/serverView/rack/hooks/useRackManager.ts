import { useState, useCallback, useEffect } from "react";
import type { Equipments, FloatingDevice, DeviceCard } from "../types";
import { checkCollision } from "../utils/rackCollisionDetection";

interface UseRackManagerProps {
  initialDevices?: Equipments[];
}

export function useRackManager({
  initialDevices = [],
}: UseRackManagerProps = {}) {
  const [installedDevices, setInstalledDevices] = useState<Equipments[]>([]);

  const [floatingDevice, setFloatingDevice] = useState<FloatingDevice | null>(
    null
  );
  const [resetKey, setResetKey] = useState(0);
  const [editingDeviceId, setEditingDeviceId] = useState<number | null>(null);
  const [tempDeviceName, setTempDeviceName] = useState("");

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
            ? { ...device, startUnit: newPosition }
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

      const newDeviceId = Date.now();
      const newDevice: Equipments = {
        equipmentId: newDeviceId,
        equipmentName: "", // 빈 이름으로 시작
        equipmentCode: `EQ-${newDeviceId}`,
        equipmentType: prevFloating.card.type,
        status: "NORMAL",
        startUnit: position,
        positionType: "FRONT",
        unitSize: prevFloating.card.height,
        modelName: "Unknown",
        manufacturer: "Unknown",
        rackName: "RACK-A01",
        ipAddress: "0.0.0.0",
        powerConsumption: 500.0,
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

      // 편집 모드 활성화
      setEditingDeviceId(newDeviceId);
      setTempDeviceName("");

      return null;
    });
  }, []);

  const handleDeviceNameChange = useCallback((name: string) => {
    setTempDeviceName(name);
  }, []);

  const handleDeviceNameConfirm = useCallback(
    (deviceId: number, name: string) => {
      setInstalledDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.equipmentId === deviceId
            ? { ...device, equipmentName: name.trim() || device.equipmentType }
            : device
        )
      );
      setEditingDeviceId(null);
      setTempDeviceName("");
    },
    []
  );

  const handleDeviceNameCancel = useCallback((deviceId: number) => {
    setInstalledDevices((prevDevices) =>
      prevDevices.filter((device) => device.equipmentId !== deviceId)
    );
    setEditingDeviceId(null);
    setTempDeviceName("");
  }, []);

  //장비 삭제 함수 추가
  const removeDevice = useCallback((deviceId: number) => {
    setInstalledDevices((prev) =>
      prev.filter((d) => d.equipmentId !== deviceId)
    );
  }, []);

  return {
    installedDevices,
    floatingDevice,
    resetKey,
    editingDeviceId,
    tempDeviceName,
    handleCardClick,
    handleMouseMove,
    handleDeviceDragEnd,
    handleRackClick,
    handleDeviceNameChange,
    handleDeviceNameConfirm,
    handleDeviceNameCancel,
    removeDevice,
  };
}
