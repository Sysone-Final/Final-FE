import { useState, useCallback, useMemo } from "react";
import type { Equipments, FloatingDevice, DeviceCard } from "../types";
import { checkCollision } from "../utils/rackCollisionDetection";
import { useGetRackEquipments } from "./useGetRackEquipments";
import { usePostEquipment } from "./usePostRackEquipments";
import { useDeleteEquipments } from "./useDeleteRackEquipments";
import { useUpdateRackEquipments } from "./useUpdateRackEquipments";
import type { GetRackEquipmentsParams } from "../api/getRackEquipments";
import type { PostEquipmentRequest } from "../api/postRackEquipments";

interface UseRackManagerProps {
  rackId: number;
  params?: GetRackEquipmentsParams;
  frontView?: boolean;
  serverRoomId: number;
}
export function useRackManager({
  rackId,
  serverRoomId,
  params,
  frontView = true,
}: UseRackManagerProps) {
  const [tempDevices, setTempDevices] = useState<Equipments[]>([]);
  const [floatingDevice, setFloatingDevice] = useState<FloatingDevice | null>(
    null
  );
  const [resetKey, setResetKey] = useState(0);
  const [editingDeviceId, setEditingDeviceId] = useState<number | null>(null);
  const [tempDeviceName, setTempDeviceName] = useState<Map<number, string>>(
    new Map()
  );

  //GET
  const { data, isLoading, error } = useGetRackEquipments(rackId || 0, params);

  //POST
  const { mutate: postEquipment } = usePostEquipment();

  //DELETE
  const { mutate: deleteEquipment } = useDeleteEquipments();

  //UPDATE
  const { mutate: updateEquipment } = useUpdateRackEquipments();

  const installedDevices = useMemo(() => {
    const devices = [...(data?.result || []), ...tempDevices];
    return devices;
  }, [data?.result, tempDevices]);

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
      const draggedDevice = installedDevices.find((d) => d.id === deviceId);
      if (!draggedDevice) return;

      if (draggedDevice.startUnit === newPosition) {
        return;
      }

      const hasCollision = checkCollision(
        {
          position: newPosition,
          height: draggedDevice.unitSize,
        },
        installedDevices,
        deviceId
      );
      if (hasCollision) {
        console.log("이동할 수 없습니다. 다른 장비와 겹칩니다.");
        setResetKey((prev) => prev + 1);
        return;
      }

      updateEquipment({
        id: deviceId,
        data: {
          rackId,
          equipmentName: draggedDevice.equipmentName,
          equipmentType: draggedDevice.equipmentType,
          startUnit: newPosition,
          unitSize: draggedDevice.unitSize,
          status: draggedDevice.status,
        },
      });
    },
    [updateEquipment, rackId, installedDevices]
  );

  // 랙 클릭 핸들러
  const handleRackClick = useCallback(
    (position: number) => {
      setFloatingDevice((prevFloating) => {
        if (!prevFloating) return null;

        const hasCollision = checkCollision(
          {
            position,
            height: prevFloating.card.height,
          },
          installedDevices
        );
        if (hasCollision) {
          return prevFloating;
        }

        const tempId = Date.now();
        const newDevice: Equipments = {
          id: tempId,
          equipmentName: "",
          equipmentCode: `TEMP-${tempId}`,
          equipmentType: prevFloating.card.type,
          status: "NORMAL",
          startUnit: position,
          positionType: frontView ? "BACK" : "FRONT",
          unitSize: prevFloating.card.height,
          modelName: "Unknown",
          manufacturer: "Unknown",
          rackName: "RACK-A01",
          ipAddress: "0.0.0.0",
          powerConsumption: 500.0,
          rackId: rackId,
          serverRoomId: serverRoomId,
        };
        setTempDevices((prevDevices) => {
          const filteredDevices = editingDeviceId
            ? prevDevices.filter((d) => d.id !== editingDeviceId)
            : prevDevices;
          return [...filteredDevices, newDevice];
        });

        setTempDeviceName((prev) => {
          const newMap = new Map(prev);
          if (editingDeviceId) {
            newMap.delete(editingDeviceId);
          }
          newMap.set(tempId, "");
          return newMap;
        });

        // 편집 모드 활성화
        setEditingDeviceId(tempId);

        return null;
      });
    },
    [frontView, editingDeviceId, installedDevices]
  );

  const handleDeviceNameChange = useCallback(
    (deviceId: number, name: string) => {
      setTempDeviceName((prev) => {
        const newMap = new Map(prev);
        newMap.set(deviceId, name);
        return newMap;
      });
    },
    []
  );

  // Enter 누름 → 이름 확정 & 배치 → 그 다음 서버 요청
  const handleDeviceNameConfirm = useCallback(
    (device: Equipments) => {
      const inputName = tempDeviceName.get(device.id) || "";
      const finalName = inputName.trim() || device.equipmentType;

      if (!device.equipmentCode?.startsWith("TEMP-")) {
        console.log("임시 장비가 아닙니다");
        return;
      }

      setEditingDeviceId(null);

      const requestData: PostEquipmentRequest = {
        equipmentName: finalName,
        equipmentType: device.equipmentType,
        startUnit: device.startUnit,
        unitSize: device.unitSize,
        status: device.status,
        rackId: rackId,
      };

      postEquipment(requestData, {
        onSuccess: () => {
          setTempDevices((prev) => prev.filter((d) => d.id !== device.id));
          setTempDeviceName((prev) => {
            const newMap = new Map(prev);
            newMap.delete(device.id);
            return newMap;
          });
        },
        onError: (error) => {
          console.error("장비 생성 실패:", error);
          setTempDevices((prev) => prev.filter((d) => d.id !== device.id));
          setTempDeviceName((prev) => {
            const newMap = new Map(prev);
            newMap.delete(device.id);
            return newMap;
          });
        },
      });
    },
    [rackId, postEquipment, tempDeviceName]
  );

  const handleDeviceNameCancel = useCallback((deviceId: number) => {
    setTempDevices((prevDevices) =>
      prevDevices.filter((device) => device.id !== deviceId)
    );
    setTempDeviceName((prev) => {
      const newMap = new Map(prev);
      newMap.delete(deviceId);
      return newMap;
    });
    setEditingDeviceId(null);
  }, []);

  //장비 삭제 함수 추가
  const handleDeviceDelete = useCallback(
    (deviceId: number) => {
      deleteEquipment({ id: deviceId, rackId });
    },
    [deleteEquipment, rackId]
  );

  const getDeviceName = useCallback(
    (deviceId: number) => {
      return tempDeviceName.get(deviceId) || "";
    },
    [tempDeviceName]
  );

  return {
    installedDevices,
    floatingDevice,
    resetKey,
    editingDeviceId,
    tempDeviceName,
    isLoading,
    error,
    handleCardClick,
    handleMouseMove,
    handleDeviceDragEnd,
    handleRackClick,
    handleDeviceNameChange,
    handleDeviceNameConfirm,
    handleDeviceNameCancel,
    handleDeviceDelete,
    getDeviceName,
  };
}
