import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCreateServerRoom } from "../hooks/useServerRoomQueries";
import type { CreateServerRoomRequest } from "../api/serverRoomApi";

// 공통 스타일
const labelStyle = "block text-sm font-medium text-white mb-1";
const errorTextStyle = "text-xs text-red-400 mt-1";

interface ServerRoomCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = {
  name: string;
  code: string;
  location: string;
  floor: string;
  rows: number;
  columns: number;
  description?: string;
  managerId?: number;
};

function ServerRoomCreateModal({
  isOpen,
  onClose,
}: ServerRoomCreateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      code: "",
      location: "",
      floor: "",
      rows: 10,
      columns: 10,
      description: "",
      managerId: undefined,
    },
  });

  const createServerRoomMutation = useCreateServerRoom();
  const isLoading = createServerRoomMutation.isPending;

  const handleClose = () => {
    if (isLoading) return;
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // 백엔드로 보낼 데이터 구성 (기본값 포함)
    const serverRoomData: CreateServerRoomRequest = {
      name: data.name,
      code: data.code,
      location: data.location,
      floor: data.floor,
      rows: data.rows,
      columns: data.columns,
    //   status: "ACTIVE",
      description: data.description || "",
    //   totalArea: 800.5,
    //   totalPowerCapacity: 2000.0,
    //   totalCoolingCapacity: 1500.0,
    //   maxRackCount: 150,
    //   temperatureMin: 18.0,
    //   temperatureMax: 27.0,
    //   humidityMin: 40.0,
    //   humidityMax: 60.0,
      managerId: data.managerId,
    };

    createServerRoomMutation.mutate(serverRoomData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm bg-black/20">
      <div className="modal">
        <div className="p-6 md:p-8">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">새 서버실 추가</h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 데이터센터명 */}
                <div>
                  <label className={labelStyle}>
                    데이터센터 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "IDC 필수 입력 항목입니다.",
                    })}
                    className={`modal-input ${errors.name ? "border-red-500 " : ""}`}
                    placeholder="예: 서울 데이터센터"
                  />
                  {errors.name && (
                    <p className={errorTextStyle}>{errors.name.message}</p>
                  )}
                </div>

                {/* 코드 */}
                <div>
                  <label className={labelStyle}>
                    코드 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("code", {
                      required: "코드는 필수 입력 항목입니다.",
                    })}
                    className={`modal-input ${errors.code ? "border-red-500" : ""}`}
                    placeholder="예: DC-BSN-001"
                  />
                  {errors.code && (
                    <p className={errorTextStyle}>{errors.code.message}</p>
                  )}
                </div>

                {/* 위치 */}
                <div className="md:col-span-2">
                  <label className={labelStyle}>
                    위치 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("location", {
                      required: "위치는 필수 입력 항목입니다.",
                    })}
                    className={`modal-input ${errors.location ? "border-red-500" : ""}`}
                    placeholder="예: 부산시 해운대구 센텀중앙로 48"
                  />
                  {errors.location && (
                    <p className={errorTextStyle}>{errors.location.message}</p>
                  )}
                </div>

                {/* 층 */}
                <div>
                  <label className={labelStyle}>
                    층 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("floor", {
                      required: "층 정보는 필수 입력 항목입니다.",
                    })}
                    className={`modal-input ${errors.floor ? "border-red-500" : ""}`}
                    placeholder="예: 지하 1층"
                  />
                  {errors.floor && (
                    <p className={errorTextStyle}>{errors.floor.message}</p>
                  )}
                </div>

                {/* 담당자 ID */}
                <div>
                  <label className={labelStyle}>담당자 ID</label>
                  <input
                    type="number"
                    {...register("managerId", { valueAsNumber: true })}
                    className="modal-input"
                    placeholder="예: 2"
                  />
                </div>

                {/* 행 수 */}
                <div>
                  <label className={labelStyle}>
                    행 수 (Rows) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("rows", {
                      required: "행 수는 필수 입력 항목입니다.",
                      valueAsNumber: true,
                      min: { value: 1, message: "행 수는 1 이상이어야 합니다." },
                    })}
                    className={`modal-input ${errors.rows ? "border-red-500 ring-red-500" : ""}`}
                    placeholder="10"
                  />
                  {errors.rows && (
                    <p className={errorTextStyle}>{errors.rows.message}</p>
                  )}
                </div>

                {/* 열 수 */}
                <div>
                  <label className={labelStyle}>
                    열 수 (Columns) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("columns", {
                      required: "열 수는 필수 입력 항목입니다.",
                      valueAsNumber: true,
                      min: { value: 1, message: "열 수는 1 이상이어야 합니다." },
                    })}
                    className={`modal-input ${errors.columns ? "border-red-500 ring-red-500" : ""}`}
                    placeholder="10"
                  />
                  {errors.columns && (
                    <p className={errorTextStyle}>{errors.columns.message}</p>
                  )}
                </div>

                {/* 설명 */}
                <div className="md:col-span-2">
                  <label className={labelStyle}>설명</label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="modal-input"
                    placeholder="부산 지역 주요 데이터센터"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 btn-cancel"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 btn-create"
              >
                {/* 임시 로딩 */}
                {isLoading ? "생성 중..." : "생성"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ServerRoomCreateModal;
