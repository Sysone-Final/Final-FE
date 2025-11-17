import { useState } from "react";
import Tools from "./Tools";
import Dropdown from "./Dropdown";
import type { DeviceCard, UnassignedEquipment } from "../types";
import { useUnassignedEquipments } from "../hooks/useGetUnassignedEquipments";
import { deviceImageMap } from "../utils/deviceImageMap";

interface SidebarProps {
  onCardClick: (card: DeviceCard) => void;
  isOpen: boolean;
}

function Sidebar({ onCardClick, isOpen }: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedCard, setSelectedCard] = useState<DeviceCard | null>(null);

  const { data: unassignedEquipments, isLoading } = useUnassignedEquipments({
    enabled: dropdownOpen,
  });

  console.log("Sidebar render:", {
    dropdownOpen,
    selectedCard,
    unassignedEquipments,
    isLoading,
  });

  const handleContextMenu = (e: React.MouseEvent, card: DeviceCard) => {
    e.preventDefault();
    e.stopPropagation();

    const iconRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const sidebarRect = (e.currentTarget as HTMLElement)
      .closest(".relative.flex-col")
      ?.getBoundingClientRect();

    if (sidebarRect) {
      setDropdownPosition({
        x: iconRect.left - sidebarRect.left,
        y: iconRect.top - sidebarRect.top,
      });
    }

    setSelectedCard(card);
    setDropdownOpen(true);
  };

  const handleDropdownSelect = (item: DeviceCard) => {
    onCardClick(item);
    setDropdownOpen(false);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const getFilteredEquipments = (): DeviceCard[] => {
    console.log("getFilteredEquipments 호출됨"); // 1. 함수 호출 확인

    console.log("체크:", {
      selectedCard,
      unassignedEquipments,
      isLoading,
    }); // 2. 값들 확인
    if (!selectedCard || !unassignedEquipments) {
      return [];
    }

    const filtered = unassignedEquipments.filter(
      (equipment: UnassignedEquipment) => {
        console.log("equipment.equipmentType:", equipment.equipmentType);
        return equipment.equipmentType === selectedCard.type;
      }
    );

    console.log("filtered:", filtered);

    return unassignedEquipments
      .filter(
        (equipment: UnassignedEquipment) =>
          equipment.equipmentType?.toUpperCase() ===
          selectedCard.type?.toUpperCase()
      )
      .map((equipment: UnassignedEquipment) => ({
        key: equipment.id.toString(),
        label: equipment.equipmentName,
        size: `${equipment.unitSize}U`,
        img:
          deviceImageMap[equipment.equipmentType]?.front ||
          deviceImageMap.SERVER.front,
        height: equipment.unitSize,
        type: equipment.equipmentType,
        equipmentId: equipment.id,
      }));
  };

  return (
    <div
      className={`
        relative
        flex-col items-center justify-start flex-shrink-0
        bg-[#404452]/90 backdrop-blur-sm
        border-r border-slate-300/40
        rounded-lb-xl
        pt-10 transition-all duration-300 ease-in-out
        ${isOpen ? "w-[56px] opacity-100" : "w-0 opacity-0 pointer-events-none"}
        overflow-visible
      `}
    >
      <Tools onCardClick={onCardClick} onContextMenu={handleContextMenu} />

      <Dropdown
        open={dropdownOpen}
        position={dropdownPosition}
        items={getFilteredEquipments()}
        onSelect={handleDropdownSelect}
        onClose={handleDropdownClose}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Sidebar;
