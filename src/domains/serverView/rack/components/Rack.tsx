import { Stage, Layer, Rect, Line, Text } from "react-konva";
import { useMemo, Fragment } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Equipments, FloatingDevice } from "../types";
import Device from "./Device";
import { RACK_CONFIG, UNIT_COUNT } from "../constants/rackConstants";
import {
  getFloatingDeviceInfo,
  calculateDraggedPosition,
  calculateDeviceY,
} from "../utils/rackCalculation";
import { rackLayout } from "../utils/rackLayout";

interface RackProps {
  devices: Equipments[];
  floatingDevice: FloatingDevice | null;
  onMouseMove: (mouseY: number) => void;
  onRackClick: (position: number) => void;
  onDeviceDragEnd: (deviceId: number, newPosition: number) => void;
  onDeviceDelete: (deviceId: number) => void;
  frontView: boolean;
  editMode: boolean;
  editingDeviceId: number | null;
  tempDeviceName: string;
  onDeviceNameChange: (name: string) => void;
  onDeviceNameConfirm: (deviceId: number, name: string) => void;
  onDeviceNameCancel: (deviceId: number) => void;
}

const FLOATING_DEVICE_ID = -1;

function Rack({
  devices,
  floatingDevice,
  onMouseMove,
  onRackClick,
  onDeviceDragEnd,
  onDeviceDelete,
  frontView,
  editMode,
  editingDeviceId,
  tempDeviceName,
  onDeviceNameChange,
  onDeviceNameConfirm,
  onDeviceNameCancel,
}: RackProps) {
  const { width: rackWidth, unitHeight } = RACK_CONFIG;

  const layout = useMemo(() => rackLayout(RACK_CONFIG), []);
  const { rackHeight, baseY, fullWidth, fullHeight, rackX } = layout;

  const floatingInfo = useMemo(
    () =>
      getFloatingDeviceInfo(floatingDevice, {
        rackHeight,
        baseY,
        unitHeight,
      }),
    [floatingDevice, rackHeight, baseY, unitHeight]
  );

  const handleDeviceDragEnd = (deviceId: number, newY: number) => {
    const draggedDevice = devices.find((d) => d.equipmentId === deviceId);
    if (!draggedDevice) return;

    const newPosition = calculateDraggedPosition(
      newY,
      draggedDevice.unitSize,
      baseY,
      unitHeight
    );
    onDeviceDragEnd(deviceId, newPosition);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (pos) onMouseMove(pos.y);
  };

  const handleRackClick = () => {
    if (floatingDevice && floatingInfo) {
      onRackClick(floatingInfo.position);
    }
  };

  return (
    <div
      className="flex justify-center items-start overflow-y-auto overflow-x-hidden h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mx-auto"
      style={{ width: `${fullWidth}px` }}
    >
      <Stage
        width={fullWidth}
        height={fullHeight}
        className="block m-0 p-0"
        onMouseMove={handleMouseMove}
        onClick={handleRackClick}
      >
        <Layer>
          {/* 랙 본체 */}
          <Rect
            x={rackX}
            y={baseY}
            width={rackWidth}
            height={rackHeight}
            fill="#000000"
            stroke="#374151"
            strokeWidth={1}
          />

          {/* U 단위 구분선 및 번호 */}
          {Array.from({ length: UNIT_COUNT + 1 }).map((_, i) => {
            const unitNumber = UNIT_COUNT - i;
            const yPos = baseY + i * unitHeight;

            return (
              <Fragment key={i}>
                <Line
                  points={[rackX, yPos, rackX + rackWidth, yPos]}
                  stroke="#4b5563"
                  strokeWidth={0.5}
                />
                {i < UNIT_COUNT && (
                  <Text
                    x={rackX + 8}
                    y={yPos + 12}
                    text={`${unitNumber}U`}
                    fontSize={12}
                    fill="#6b7280"
                  />
                )}
              </Fragment>
            );
          })}

          {/* 설치된 장비들 */}
          {devices.map((device) => {
            const y = calculateDeviceY(
              device.startUnit,
              device.unitSize,
              rackHeight,
              baseY,
              unitHeight
            );
            const height = unitHeight * device.unitSize;

            return (
              <Device
                key={device.equipmentId}
                device={device}
                y={y}
                height={height}
                rackWidth={rackWidth}
                x={rackX}
                onDragEnd={handleDeviceDragEnd}
                onDelete={onDeviceDelete}
                frontView={frontView}
                editMode={editMode}
                isEditing={editingDeviceId === device.equipmentId}
                tempDeviceName={tempDeviceName}
                onDeviceNameChange={onDeviceNameChange}
                onDeviceNameConfirm={onDeviceNameConfirm}
                onDeviceNameCancel={onDeviceNameCancel}
              />
            );
          })}

          {/* 떠있는 장비 */}
          {floatingDevice && floatingInfo && (
            <Device
              device={{
                equipmentId: FLOATING_DEVICE_ID,
                equipmentName: floatingDevice.card.label,
                equipmentCode: `TEMP-${Date.now()}`,
                equipmentType: floatingDevice.card.type,
                startUnit: floatingInfo.position,
                unitSize: floatingDevice.card.height,
                positionType: "FRONT",
                status: "NORMAL",
                manufacturer: "Unknown",
                modelName: "Unknown",
                ipAddress: "0.0.0.0",
                rackName: "RACK_A02",
                powerConsumption: 500.0,
              }}
              y={floatingInfo.y}
              height={floatingInfo.height}
              rackWidth={rackWidth}
              x={rackX}
              isFloating={true}
              opacity={0.2}
              frontView={frontView}
              editMode={editMode}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default Rack;
