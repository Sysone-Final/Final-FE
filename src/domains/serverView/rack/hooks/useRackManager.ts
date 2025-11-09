import { useState, useCallback, useEffect } from "react";
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
  initialDevices?: Equipments[];
  frontView?: boolean;
}
export function useRackManager({
  rackId,
  params,
  initialDevices = [],
  frontView = true,
}: UseRackManagerProps) {
  const [installedDevices, setInstalledDevices] = useState<Equipments[]>([]);
  const [floatingDevice, setFloatingDevice] = useState<FloatingDevice | null>(
    null
  );
  const [resetKey, setResetKey] = useState(0);
  const [editingDeviceId, setEditingDeviceId] = useState<number | null>(null);
  //장비 입력
  const [tempDeviceName, setTempDeviceName] = useState("");

  //GET
  const { data, isLoading, error } = useGetRackEquipments(rackId || 0, params);

  //POST
  const { mutate: postEquipment } = usePostEquipment();

  //DELETE
  const { mutate: deleteEquipment } = useDeleteEquipments();

  //UPDATE
  const { mutate: updateEquipment } = useUpdateRackEquipments();

  useEffect(() => {
    if (data?.data) {
      setInstalledDevices(data.data);
    } else if (initialDevices.length > 0) {
      setInstalledDevices(initialDevices);
    }
  }, [data?.data, initialDevices]);

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

        const updated = prevDevices.map((d) =>
          d.equipmentId === deviceId ? { ...d, startUnit: newPosition } : d
        );

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
        return updated;
      });
    },
    [updateEquipment, rackId]
  );

  // 랙 클릭 핸들러
  const handleRackClick = useCallback(
    (position: number) => {
      setFloatingDevice((prevFloating) => {
        if (!prevFloating) return null;

        const tempId = Date.now();
        const newDevice: Equipments = {
          equipmentId: tempId,
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
            return prevDevices;
          }
          return [...prevDevices, newDevice];
        });

        // 편집 모드 활성화
        setEditingDeviceId(tempId);
        setTempDeviceName("");

        return null;
      });
    },
    [frontView]
  );

  const handleDeviceNameChange = useCallback((name: string) => {
    setTempDeviceName(name);
  }, []);

  // Enter 누름 → 이름 확정 & 배치 → 그 다음 서버 요청
  const handleDeviceNameConfirm = useCallback(
    (device: Equipments, inputName: string) => {
      const finalName = inputName.trim() || device.equipmentType;

      if (!device.equipmentCode?.startsWith("TEMP-")) {
        console.log("임시 장비가 아닙니다");
        return;
      }

      setInstalledDevices((prev) =>
        prev.map((d) =>
          d.equipmentId === device.equipmentId
            ? { ...d, equipmentName: finalName }
            : d
        )
      );
      setEditingDeviceId(null);
      setTempDeviceName("");

      const requestData: PostEquipmentRequest = {
        equipmentName: finalName,
        equipmentType: device.equipmentType,
        startUnit: device.startUnit,
        unitSize: device.unitSize,
        status: device.status,
        rackId: rackId,
      };

      postEquipment(requestData, {
        onSuccess: (response) => {
          setInstalledDevices((prev) =>
            prev.map((d) =>
              d.equipmentId === device.equipmentId ? { ...response.data } : d
            )
          );
        },
        onError: (error) => {
          console.error("장비 생성 실패:", error);
          setInstalledDevices((prev) =>
            prev.filter((d) => d.equipmentId !== device.equipmentId)
          );
        },
      });
    },
    [rackId, postEquipment]
  );

  const handleDeviceNameCancel = useCallback((deviceId: number) => {
    setInstalledDevices((prevDevices) =>
      prevDevices.filter((device) => device.equipmentId !== deviceId)
    );
    setEditingDeviceId(null);
    setTempDeviceName("");
  }, []);

  //장비 삭제 함수 추가
  const handleDeviceDelete = useCallback(
    (deviceId: number) => {
      deleteEquipment(deviceId);
    },
    [deleteEquipment]
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
  };
}
