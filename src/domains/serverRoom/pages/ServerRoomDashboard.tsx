import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { CiMenuKebab } from "react-icons/ci";
import ServerRoomList from "../components/ServerRoomList";
import ServerRoomCreateModal from "../components/ServerRoomCreateModal";
import ServerRoomEditModal from "../components/ServerRoomEditModal";
import DataCenterCreateModal from "../components/DataCenterCreateModal";
import DataCenterEditModal from "../components/DataCenterEditModal";
import {
  useServerRooms,
  useDeleteServerRoom,
  useDeleteDataCenter,
} from "../hooks/useServerRoomQueries";
import { useAuthStore } from "@domains/login/store/useAuthStore";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import type { ServerRoom, DataCenterGroup } from "../types";
import "../css/serverRoomDashboard.css";

const ServerRoomDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDataCenterCreateModalOpen, setIsDataCenterCreateModalOpen] =
    useState(false);
  const [isDataCenterEditModalOpen, setIsDataCenterEditModalOpen] =
    useState(false);
  const [selectedServerRoom, setSelectedServerRoom] =
    useState<ServerRoom | null>(null);
  const [selectedDataCenter, setSelectedDataCenter] =
    useState<DataCenterGroup | null>(null);
  const [selectedDataCenterId, setSelectedDataCenterId] = useState<
    number | null
  >(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    serverRoom?: ServerRoom;
  }>({ isOpen: false });
  const [deleteDataCenterModalState, setDeleteDataCenterModalState] = useState<{
    isOpen: boolean;
    dataCenter?: DataCenterGroup;
  }>({ isOpen: false });

  // 로그인한 사용자의 회사 ID 가져오기
  const { user } = useAuthStore();
  const companyId = user?.companyId;

  const {
    data: dataCenters = [],
    isLoading,
    isError,
    error,
  } = useServerRooms(companyId!);
  const deleteMutation = useDeleteServerRoom();
  const deleteDataCenterMutation = useDeleteDataCenter();

  // 편집 모달 열기
  const handleOpenEditModal = (serverRoom: ServerRoom) => {
    setSelectedServerRoom(serverRoom);
    setIsEditModalOpen(true);
  };

  // 편집 모달 닫기
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedServerRoom(null);
  };

  // 삭제 모달 열기
  const handleOpenDeleteModal = (serverRoom: ServerRoom) => {
    setDeleteModalState({ isOpen: true, serverRoom });
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setDeleteModalState({ isOpen: false });
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (deleteModalState.serverRoom) {
      try {
        await deleteMutation.mutateAsync(deleteModalState.serverRoom.id);
        handleCloseDeleteModal();
      } catch (error) {
        console.error("서버실 삭제 실패:", error);
      }
    }
  };

  // 데이터센터 수정 모달 열기
  const handleOpenDataCenterEditModal = (dataCenter: DataCenterGroup) => {
    setSelectedDataCenter(dataCenter);
    setIsDataCenterEditModalOpen(true);
    setOpenDropdownId(null);
  };

  // 데이터센터 수정 모달 닫기
  const handleCloseDataCenterEditModal = () => {
    setIsDataCenterEditModalOpen(false);
    setSelectedDataCenter(null);
  };

  // 데이터센터 삭제 모달 열기
  const handleOpenDataCenterDeleteModal = (dataCenter: DataCenterGroup) => {
    setDeleteDataCenterModalState({ isOpen: true, dataCenter });
    setOpenDropdownId(null);
  };

  // 데이터센터 삭제 모달 닫기
  const handleCloseDataCenterDeleteModal = () => {
    setDeleteDataCenterModalState({ isOpen: false });
  };

  // 데이터센터 삭제 확인
  const handleConfirmDataCenterDelete = async () => {
    if (deleteDataCenterModalState.dataCenter) {
      try {
        await deleteDataCenterMutation.mutateAsync(
          deleteDataCenterModalState.dataCenter.dataCenterId
        );
        // 삭제된 데이터센터가 현재 선택된 경우 선택 해제
        if (selectedDataCenterId === deleteDataCenterModalState.dataCenter.dataCenterId) {
          setSelectedDataCenterId(null);
        }
        handleCloseDataCenterDeleteModal();
      } catch (error) {
        console.error("데이터센터 삭제 실패:", error);
      }
    }
  };

  // 드롭다운 토글
  const toggleDropdown = (dataCenterId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (openDropdownId === dataCenterId) {
      setOpenDropdownId(null);
      setDropdownPosition(null);
    } else {
      const button = e.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX, // 드롭다운 너비(100px)를 고려하여 우측 정렬
      });
      setOpenDropdownId(dataCenterId);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 케밥 버튼이나 드롭다운 내부를 클릭한 경우가 아니면 닫기
      if (!target.closest('.datacenter-tab-menu') && !target.closest('.datacenter-tab-dropdown')) {
        setOpenDropdownId(null);
        setDropdownPosition(null);
      }
    };

    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openDropdownId]);

  // 첫 번째 데이터센터를 기본으로 선택
  React.useEffect(() => {
    if (dataCenters.length > 0 && selectedDataCenterId === null) {
      setSelectedDataCenterId(dataCenters[0].dataCenterId);
    }
  }, [dataCenters, selectedDataCenterId]);

  // 선택된 데이터센터 필터링
  const filteredDataCenters = useMemo(() => {
    if (selectedDataCenterId === null) return dataCenters;
    return dataCenters.filter((dc) => dc.dataCenterId === selectedDataCenterId);
  }, [dataCenters, selectedDataCenterId]);

  const stats = useMemo(() => {
    const dataToCalculate = filteredDataCenters;
    const totalRooms = dataToCalculate.reduce(
      (sum, dc) => sum + dc.serverRooms.length,
      0
    );
    const totalDataCenters = dataToCalculate.length;
    const activeRooms = dataToCalculate.reduce(
      (sum, dc) =>
        sum + dc.serverRooms.filter((room) => room.status === "ACTIVE").length,
      0
    );
    const maintenanceRooms = dataToCalculate.reduce(
      (sum, dc) =>
        sum +
        dc.serverRooms.filter((room) => room.status === "MAINTENANCE").length,
      0
    );

    return { totalRooms, totalDataCenters, activeRooms, maintenanceRooms };
  }, [filteredDataCenters]);

  // companyId 체크
  if (!companyId) {
    return (
      <div className="tab-layout">
        <div className="flex items-center justify-center h-full">
          <p className="text-body-primary text-red-400">
            회사 정보를 불러올 수 없습니다. 다시 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="tab-layout">
        <div className="flex items-center justify-center h-full">
          <p className="text-body-primary text-gray-400">
            서버실 목록을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="tab-layout">
        <div className="flex items-center justify-center h-full">
          <p className="text-body-primary text-red-400">
            서버실 목록을 불러오는데 실패했습니다:{" "}
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-layout">
      {/* Header */}
      <header className="tab-header flex items-center justify-between">
        <div className="flex">
          <div>
            <h1 className="tab-title text-main-title">서버실 관리</h1>
            <p className="tab-subtitle text-body-primary text-gray-400">
              데이터 센터 인프라를 모니터링하고 관리하세요
            </p>
          </div>
          {/* Header Stats */}
          <div className="flex items-center gap-8 px-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-50">{stats.totalDataCenters}</span>
              <span className="text-xs text-gray-400">총 데이터센터</span>
            </div>
            <div className="w-px h-8 bg-gray-700/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-50">
                {stats.totalRooms}
              </span>
              <span className="text-xs text-gray-400">총 서버실</span>
            </div>
            <div className="w-px h-8 bg-gray-700/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-400">
                {stats.activeRooms}
              </span>
              <span className="text-xs text-gray-400">활성 상태</span>
            </div>
            <div className="w-px h-8 bg-gray-700/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-400">
                {stats.maintenanceRooms}
              </span>
              <span className="text-xs text-gray-400">유지보수</span>
            </div>
          </div>
        </div>
        <button
          className="btn-create px-4 py-3"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + 새 서버실 추가
        </button>
      </header>

      {/* Data Center Tabs */}
      <div className="datacenter-tabs">
        {dataCenters.map((dataCenter) => (
          <div
            key={dataCenter.dataCenterId}
            className={`datacenter-tab ${selectedDataCenterId === dataCenter.dataCenterId ? "active" : ""}`}
          >
            <button
              className="datacenter-tab-content"
              onClick={() => setSelectedDataCenterId(dataCenter.dataCenterId)}
            >
              <span>
                {dataCenter.dataCenterName} ({dataCenter.dataCenterCode})
              </span>
            </button>
            <div className="datacenter-tab-menu">
              <button
                className="datacenter-tab-menu-button"
                onClick={(e) => toggleDropdown(dataCenter.dataCenterId, e)}
              >
                <CiMenuKebab size={20} />
              </button>
              {openDropdownId === dataCenter.dataCenterId && dropdownPosition && (
                <div 
                  className="datacenter-tab-dropdown"
                  style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                  }}
                >
                  <div
                    className="datacenter-tab-dropdown-item"
                    onClick={() => handleOpenDataCenterEditModal(dataCenter)}
                  >
                    수정
                  </div>
                  <div
                    className="datacenter-tab-dropdown-item text-red-400 hover:text-red-300"
                    onClick={() => handleOpenDataCenterDeleteModal(dataCenter)}
                  >
                    삭제
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {/* 데이터센터 추가 버튼 */}
        <button
          className="datacenter-tab"
          onClick={() => setIsDataCenterCreateModalOpen(true)}
          title="새 데이터센터 추가"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <ServerRoomList
          dataCenters={filteredDataCenters}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDeleteModal}
        />
      </main>

      {/* 서버실 생성 모달 */}
      <ServerRoomCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 데이터센터 생성 모달 */}
      <DataCenterCreateModal
        isOpen={isDataCenterCreateModalOpen}
        onClose={() => setIsDataCenterCreateModalOpen(false)}
      />

      {/* 데이터센터 수정 모달 */}
      <DataCenterEditModal
        isOpen={isDataCenterEditModalOpen}
        onClose={handleCloseDataCenterEditModal}
        dataCenter={selectedDataCenter}
      />

      {/* 서버실 수정 모달 */}
      <ServerRoomEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        serverRoom={selectedServerRoom}
      />

      {/* 서버실 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="서버실 삭제"
        confirmText="삭제"
        isDestructive={true}
      >
        <p>{deleteModalState.serverRoom?.name}서버실을 삭제하시겠습니까?</p>
      </ConfirmationModal>

      {/* 데이터센터 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={deleteDataCenterModalState.isOpen}
        onClose={handleCloseDataCenterDeleteModal}
        onConfirm={handleConfirmDataCenterDelete}
        title="데이터센터 삭제"
        confirmText="삭제"
        isDestructive={true}
      >
        <p>
          {deleteDataCenterModalState.dataCenter?.dataCenterName} 데이터센터를 삭제하시겠습니까?
        </p>
        <p className="text-sm text-gray-400 mt-2">
          데이터센터에 속한 모든 서버실도 함께 삭제될 수 있습니다.
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default ServerRoomDashboard;
