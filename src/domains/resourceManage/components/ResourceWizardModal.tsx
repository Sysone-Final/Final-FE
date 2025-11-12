import { useState, useEffect, useMemo } from "react";
import {
  useForm,
  useFormState,
} from "react-hook-form";
import type {
  SubmitHandler,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  UseFormGetValues,
} from "react-hook-form";
import type { Resource, Rack } from "../types/resource.types";
import {
  useCreateResource,
  useUpdateResource,
  useGetServerRooms,
  useGetRacksByServerRoom,
  useGetResourceById,
} from "../hooks/useResourceQueries";
import { X, ArrowLeft, Loader2 } from "lucide-react";

const labelStyle = "block text-sm font-medium text-white mb-1";
const gridContainerStyle = "grid grid-cols-1 md:grid-cols-2 gap-4";
const gridSpanFullStyle = "md:col-span-2";
const helperTextStyle = "text-xs text-gray-400 mt-1 pl-1";
const errorTextStyle = "text-xs text-red-400 mt-1";

type FormValues = Partial<Resource>;

// type FileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

interface Step1Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  // handleFileChange: FileChangeHandler;
  // imageFrontPreview: string | null;
  // imageRearPreview: string | null;
}

interface Step2Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  isUnallocated?: boolean;

  serverRooms: ServerRoom[] | undefined;
 isLoadingServerRooms: boolean;
 isErrorServerRooms: boolean;
 racks: Rack[] | undefined;
 isLoadingRacks: boolean;
 isErrorRacks: boolean;
 watchedServerRoomId: number | null | undefined;
}

interface Step3Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
}

// --- 스텝 1 컴포넌트 ---
const Step1Identity = ({
  register,
  errors,

}: Step1Props) => (
  // 3. inputStyle 대신 modal-input 적용
  <div className={gridContainerStyle}>
    {/* --- 필수 --- */}
    <div>
      <label className={labelStyle}>
        장비명 (Equipment Name) <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register("equipmentName", { required: "장비명은 필수 입력 항목입니다." })}
        className={`modal-input ${errors.equipmentName ? "border-red-500" : ""}`}
      />
      {errors.equipmentName && <p className={errorTextStyle}>{errors.equipmentName.message}</p>}
    </div>

    <div>
      <label className={labelStyle}>
        장비 유형 (Equipment Type) <span className="text-red-500">*</span>
      </label>
      <select
        {...register("equipmentType", { required: "장비 유형을 선택하세요." })}
        className={`modal-input ${errors.equipmentType ? "border-red-500" : ""}`}
      >
        <option value="SERVER">SERVER</option>
        <option value="SWITCH">SWITCH</option>
        <option value="ROUTER">ROUTER</option>
        <option value="PDU">PDU</option>
        <option value="UPS">UPS</option>
      </select>
      {errors.equipmentType && <p className={errorTextStyle}>{errors.equipmentType.message}</p>}
    </div>

    {/* --- 선택 (모두 register 적용) --- */}
    <div>
      <label className={labelStyle}>제조사 (Manufacturer)</label>
      <input
        type="text"
        {...register("manufacturer")}
        className="modal-input"
      />
    </div>
    <div>
      <label className={labelStyle}>모델명 (Model Name)</label>
      <input
        type="text"
        {...register("modelName")}
        className="modal-input"
      />
    </div>
    <div>
      <label className={labelStyle}>시리얼 번호 (Serial Number)</label>
      <input
        type="text"
        {...register("serialNumber")}
        className="modal-input"
      />
    </div>
    <div>
      <label className={labelStyle}>자산 관리 코드 (Equipment Code)</label>
      <input
        type="text"
        {...register("equipmentCode")}
        className="modal-input"
      />
    </div>

    
  </div>
);

// --- 스텝 2 컴포넌트 ---
const Step2Location = ({ 
  register, 
  errors, 
  watch, 
  getValues,
  isUnallocated = false,
  // --- props로 데이터 받기 ---
  serverRooms,
  isLoadingServerRooms,
  isErrorServerRooms,
  racks,
  isLoadingRacks,
  isErrorRacks,
  watchedServerRoomId
}: Step2Props) => {
 // const watchedServerRoomId = watch("serverRoomId"); // 모달에서 이미 watch함
  const watchedRackId = watch("rackId");

  // const {
  //   data: serverRooms,
  //   isLoading: isLoadingServerRooms,
  //   isError: isErrorServerRooms,
  // } = useGetServerRooms();
  // const {
  //   data: racks,
  //   isLoading: isLoadingRacks,
  //   isError: isErrorRacks,
  // } = useGetRacksByServerRoom(watchedServerRoomId || null);

  const selectedRack = useMemo(() => {
    if (!watchedRackId || !racks || !Array.isArray(racks)) return null;
    return racks.find((r: Rack) => r.id === watchedRackId);
  }, [watchedRackId, racks]);

  const maxUnits = selectedRack?.totalUnits || 48;

  return (
    //    div에 grid 스타일을 바로 적용하여 평평하게 만듦
    <div>
      {/* 2-1. 물리적 위치 */}
      <div className={gridContainerStyle}>
        <div>
          <label className={labelStyle}>
            서버실 {isUnallocated ? "" : <span className="text-red-500">*</span>}
          </label>
          <select
            {...register("serverRoomId", {
       validate: (value) =>
        isUnallocated || !!value || "서버실을 선택해야 합니다.",
       valueAsNumber: true,
      })}
      className={`modal-input ${errors.serverRoomId ? "border-red-500" : ""}`}
      disabled={isLoadingServerRooms || isErrorServerRooms || isUnallocated}
     >
            <option value="">
              {isLoadingServerRooms
                ? "불러오는 중..."
                : isErrorServerRooms
                  ? "오류 발생"
                  : "-- 서버실 선택 --"}
            </option>
            {Array.isArray(serverRooms) &&
              serverRooms.map((dc) => (
                <option key={dc.id} value={dc.id}>
                  {dc.name}
                </option>
              ))}
          </select>
          {errors.serverRoomId && (
            <p className={errorTextStyle}>{errors.serverRoomId.message}</p>
          )}
        </div>
        <div>
          <label className={labelStyle}>
            랙 (Rack) {isUnallocated ? "" : <span className="text-red-500">*</span>}
     </label>
     <select
      {...register("rackId", {
       validate: (value) =>
        isUnallocated || !!value || "랙을 선택해야 합니다.",
       valueAsNumber: true,
      })}
      className={`modal-input ${errors.rackId ? "border-red-500" : ""}`}
      disabled={!watchedServerRoomId || isLoadingRacks || isErrorRacks || isUnallocated}
     >
            <option value="">
              {isLoadingRacks
                ? "불러오는 중..."
                : !watchedServerRoomId
                  ? "-- 서버실 먼저 선택 --"
                  : isErrorRacks
                    ? "오류 발생"
                    : "-- 랙 선택 --"}
            </option>
            {Array.isArray(racks) &&
              racks.map((rack) => (
               <option key={rack.id} value={rack.id}>
                  {rack.rackName} ({rack.availableUnits}U / {rack.totalUnits}
                  U)
                </option>
              ))}
          </select>
          {errors.rackId && (
            <p className={errorTextStyle}>{errors.rackId.message}</p>
          )}
        </div>

        <div>
          <label className={labelStyle}>
            시작 유닛 {isUnallocated ? "" : <span className="text-red-500">*</span>}
     </label>
     <input
      type="number"
      {...register("startUnit", {
       required: isUnallocated ? false : "시작 유닛을 입력하세요.",
       valueAsNumber: true,
       min: isUnallocated
        ? undefined
        : { value: 1, message: "시작 유닛은 1 이상이어야 합니다." },
       max: isUnallocated
        ? undefined
        : {
          value: maxUnits,
          message: `이 랙의 최대 유닛(${maxUnits}U)을 초과할 수 없습니다.`,
         },
      })}
      min="1"
      max={maxUnits}
      className={`modal-input ${errors.startUnit ? "border-red-500" : ""}`}
      disabled={!watchedRackId || isUnallocated}
     />
          <p className={helperTextStyle}>
            랙의 몇 번째 U부터? (최대: {maxUnits}U)
          </p>
          {errors.startUnit && (
            <p className={errorTextStyle}>{errors.startUnit.message}</p>
          )}
        </div>
        <div>
          <label className={labelStyle}>
            유닛 크기 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("unitSize", {
              required: "유닛 크기는 필수입니다.",
              valueAsNumber: true,
              min: { value: 1, message: "유닛 크기는 1 이상이어야 합니다." },
              validate: (value) => {
        if (isUnallocated) return true; 

        const startUnit = getValues("startUnit");
                if (typeof startUnit === 'number' && typeof value === 'number') {
                  return (
                    startUnit + value - 1 <= maxUnits ||
                    `설치 위치(U)가 랙의 최대 크기(${maxUnits}U)를 초과합니다.`
                  );
                }
                return true;
              },
            })}
            min="1"
            max={maxUnits}
            className={`modal-input ${errors.unitSize ? "border-red-500" : ""}`}
            disabled={!watchedRackId && !isUnallocated}
          />
          <p className={helperTextStyle}>장비가 차지하는 U 크기 (예: 2U)</p>
          {errors.unitSize && (
            <p className={errorTextStyle}>{errors.unitSize.message}</p>
          )}
        </div>

        <div className={gridSpanFullStyle}>
          <label className={labelStyle}>설치 방향</label>
          <select
            {...register("positionType")}
            className="modal-input"
          >
            <option value="">-- 방향 선택 --</option>
            <option value="FRONT">FRONT</option>
            <option value="REAR">REAR</option>
            <option value="NORMAL">NORMAL</option>
          </select>
        </div>
      </div>

      {/* 2-2. 하드웨어 및 네트워크 사양 (fieldset 제거, 여백 추가) */}
      <div className={`${gridContainerStyle} mt-4`}>
        <div>
          <label className={labelStyle}>운영체제 (OS)</label>
          <input
            type="text"
            {...register("os")}
            className="modal-input"
            placeholder="예: Ubuntu 20.04, Windows Server 2019"
          />
        </div>
        <div>
          <label className={labelStyle}>CPU 사양 (CPU Spec)</label>
          <input
            type="text"
            {...register("cpuSpec")}
            className="modal-input"
            placeholder="예: Intel Xeon Gold 6248"
          />
        </div>
        <div>
          <label className={labelStyle}>메모리 사양 (Memory Spec)</label>
          <input
            type="text"
            {...register("memorySpec")}
            className="modal-input"
            placeholder="예: 128GB DDR4"
          />
        </div>
        <div>
          <label className={labelStyle}>디스크 사양 (Disk Spec)</label>
          <input
            type="text"
            {...register("diskSpec")}
            className="modal-input"
            placeholder="예: 2TB SSD x 2"
          />
        </div>
        <div>
          <label className={labelStyle}>IP 주소 (IP Address)</label>
          <input
            type="text"
            {...register("ipAddress", {
              pattern: {
                value: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
                message: "유효한 IP 주소 형식이 아닙니다. (예: 192.168.0.1)",
              },
            })}
            className={`modal-input ${errors.ipAddress ? "border-red-500" : ""}`}
            placeholder="예: 192.168.1.10"
          />
          {errors.ipAddress && (
            <p className={errorTextStyle}>{errors.ipAddress.message}</p>
          )}
        </div>
        <div>
          <label className={labelStyle}>MAC 주소 (MAC Address)</label>
          <input
            type="text"
            {...register("macAddress", {
              pattern: {
                value: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
                message: "유효한 MAC 주소 형식이 아닙니다. (예: 00:1A:2B:..)",
              }
            })}
            className={`modal-input ${errors.macAddress ? "border-red-500" : ""}`}
            placeholder="예: 00:1A:2B:3C:4D:5E"
          />
          {errors.macAddress && (
            <p className={errorTextStyle}>{errors.macAddress.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 스텝 3 컴포넌트 ---
const Step3Management = ({ register, errors, watch }: Step3Props) => {
  const watchedMonitoringEnabled = watch("monitoringEnabled");

  return (
    <div>
      {/* 3-1. 관리 정보 */}
      <div className={gridContainerStyle}>
        <div>
          <label className={labelStyle}>담당자 (Manager)</label>
          <input
            type="text"
            {...register("managerId")}
            className="modal-input"
            placeholder="담당자 ID 또는 이름"
          />
        </div>
        <div>
          <label className={labelStyle}>
            장비 상태 (Status) <span className="text-red-500">*</span>
          </label>
          <select
            {...register("status", {
              required: "장비 상태를 선택하세요.",
            })}
            className={`modal-input ${errors.status ? "border-red-500" : ""}`}
          >
            <option value="POWERED_OFF">비활성/재고</option>
            <option value="NORMAL">NORMAL - 운영중</option>
            <option value="MAINTENANCE">MAINTENANCE - 점검중</option>
            <option value="DECOMMISSIONED">폐기</option>
          </select>
          {errors.status && (
            <p className={errorTextStyle}>{errors.status.message}</p>
          )}
        </div>
        <div>
          <label className={labelStyle}>설치일 (Installation Date)</label>
          <input
            type="date"
            {...register("installationDate")}
            className="modal-input"
          />
        </div>
        <div className={gridSpanFullStyle}>
          <label className={labelStyle}>메모 (Notes)</label>
          <textarea
            {...register("notes")}
            rows={3}
            className="modal-input"
          ></textarea>
        </div>
      </div>

      {/* 3-2. 모니터링 설정  */}


      <div className={`${gridContainerStyle} mt-4`}>
        <div className={`${gridSpanFullStyle} mb-2`}>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="monitoringEnabled"
              {...register("monitoringEnabled")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
            />
            <label
              htmlFor="monitoringEnabled"
              className="font-medium text-white"
            >
              실시간 모니터링 활성화
            </label>
          </div>
        </div>

        {/* 임계치 입력란들 */}
        <div>
          <label className={labelStyle}>CPU 경고 임계치 (%)</label>
          <input
            type="number"
            {...register("cpuThresholdWarning", { valueAsNumber: true })}
            className="modal-input"
            disabled={!watchedMonitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>CPU 위험 임계치 (%)</label>
          <input
            type="number"
            {...register("cpuThresholdCritical", { valueAsNumber: true })}
            className="modal-input"
            disabled={!watchedMonitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>메모리 경고 임계치 (%)</label>
          <input
            type="number"
            {...register("memoryThresholdWarning", { valueAsNumber: true })}
            className="modal-input"
            disabled={!watchedMonitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>메모리 위험 임계치 (%)</label>
          <input
            type="number"
            {...register("memoryThresholdCritical", { valueAsNumber: true })}
            className="modal-input"
            disabled={!watchedMonitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>디스크 경고 임계치 (%)</label>
          <input
            type="number"
            {...register("diskThresholdWarning", { valueAsNumber: true })}
            className="modal-input"
            disabled={!watchedMonitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>디스크 위험 임계치 (%)</label>
          <input
            type="number"
            {...register("diskThresholdCritical", { valueAsNumber: true })}
            className="modal-input"
            disabled={!watchedMonitoringEnabled}
          />
        </div>
      </div>
    </div>
  );
};

// 폼 기본값 (새 장비 등록 시)
const getDefaultFormData = (): Partial<Resource> => ({
  equipmentName: "",
  equipmentType: "SERVER",
  unitSize: 1,
  status: "POWERED_OFF",
  manufacturer: "",
  modelName: "",
  serialNumber: "",
  equipmentCode: "",
  serverRoomId: null,
  rackId: null,
  startUnit: null,
  positionType: null,
  os: "",
  cpuSpec: "",
  memorySpec: "",
  diskSpec: "",
  ipAddress: "",
  macAddress: "",
  managerId: null,
  installationDate: "",
  notes: "",
  monitoringEnabled: false,
  cpuThresholdWarning: 70,
  cpuThresholdCritical: 90,
  memoryThresholdWarning: 70,
  memoryThresholdCritical: 90,
  diskThresholdWarning: 70,
  diskThresholdCritical: 90,
});

interface ResourceWizardModalProps {
  isOpen: boolean;
  onCloseHandler: () => void;
  resourceId: number | null;
  isUnallocated?: boolean;
}

export default function ResourceWizardModal({
  isOpen,
  onCloseHandler,
  resourceId,
  isUnallocated = false,
}: ResourceWizardModalProps) {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
    getValues,
    control,
  } = useForm<FormValues>({
    defaultValues: getDefaultFormData(),
  });

  const { dirtyFields } = useFormState({ control });
  const watchedServerRoomId = watch("serverRoomId");

  const {
  data: serverRooms,
  isLoading: isLoadingServerRooms,
  isError: isErrorServerRooms,
 } = useGetServerRooms();

 const {
  data: racks,
  isLoading: isLoadingRacks,
  isError: isErrorRacks,
 } = useGetRacksByServerRoom(watchedServerRoomId || null);

  useEffect(() => {
    if (dirtyFields.serverRoomId) {
      setValue("rackId", null, { shouldValidate: true });
      setValue("startUnit", null, { shouldValidate: true });
    }
  }, [watchedServerRoomId, dirtyFields.serverRoomId, setValue]);



  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();
  const {
    data: resourceDetailData,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
  } = useGetResourceById(resourceId);

  const isLoadingMutation =
    createResourceMutation.isPending || updateResourceMutation.isPending;

  const isLoading = isLoadingDetail || isLoadingMutation;

  // (useEffect 로직들은 동일하게 유지)
 useEffect(() => {
  if (isOpen) {
   if (!resourceId) {
    reset(getDefaultFormData());
    setStep(1);
   } else if (resourceId && resourceDetailData) {
        // [중요] reset 시 rackId가 설정됩니다.
    reset({
     ...getDefaultFormData(),
     ...resourceDetailData,
    });
    setStep(1);
   }
  }
 }, [resourceId, resourceDetailData, isOpen, reset]);

useEffect(() => {
    // 1. 랙 목록 로딩이 끝났고 (false)
    // 2. 랙 목록 데이터가 존재하며 (undefined 아님)
    // 3. 수정 모드 데이터(resourceDetailData)가 있고
    // 4. 해당 데이터에 rackId가 설정되어 있을 때
  if (
   !isLoadingRacks && 
   racks &&
   resourceDetailData && 
   resourceDetailData.rackId
  ) {
      // 5. 폼의 현재 rackId 값과 상세 데이터의 rackId 값이 일치하는지 확인
      // (이미 올바르게 설정되었다면 다시 설정할 필요 없음)
      const currentFormRackId = getValues("rackId");

      if (currentFormRackId !== resourceDetailData.rackId) {
        // 6. 폼의 rackId 값을 강제로 다시 설정하여 <select>가 값을 표시하도록 함
        setValue("rackId", resourceDetailData.rackId, { shouldDirty: false });
      }
  }
 }, [
    isLoadingRacks, // isLoadingRacks가 true -> false로 바뀔 때 실행됨
    racks, 
    resourceDetailData, 
    getValues, 
    setValue
  ]);

  if (!isOpen) return null;


  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['equipmentName', 'equipmentType'];
    } else if (step === 2) {
      fieldsToValidate.push(
        'unitSize',
   );

   if (!isUnallocated) {
    fieldsToValidate.push(
     'serverRoomId',
     'rackId',
     'startUnit'
    );
   }
      if (getValues('ipAddress')) {
        fieldsToValidate.push('ipAddress');
      }
      if (getValues('macAddress')) {
        fieldsToValidate.push('macAddress');
      }
    }
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleClose = () => {
    if (isLoading) return;
    onCloseHandler();
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {

if (resourceId) {
  updateResourceMutation.mutate(
   { id: resourceId, data: data as Resource }, 
   { onSuccess: handleClose }
  );
 } else {
  createResourceMutation.mutate(data as Resource, { onSuccess: handleClose }); 
 }
 };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1Identity
            register={register}
            errors={errors}

          />
        );
      case 2:
        return (
          <Step2Location
            register={register}
            errors={errors}
            watch={watch}
            getValues={getValues}
            isUnallocated={isUnallocated}
            serverRooms={serverRooms}
            isLoadingServerRooms={isLoadingServerRooms}
            isErrorServerRooms={isErrorServerRooms}
            racks={racks}
            isLoadingRacks={isLoadingRacks}
            isErrorRacks={isErrorRacks}
            watchedServerRoomId={watchedServerRoomId}
          />
        );
      case 3:
        return (
          <Step3Management
            register={register}
            errors={errors}
            watch={watch}
          />
        );
      default:
        return null;
    }
  };

  return (
    //  모달 배경 스타일 
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm bg-black/20">
      {/* 모달창 스타일 */}
      <div className="modal">
        <div className="p-6 md:p-8">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {resourceId ? "장비 수정" : "새 장비 등록"}
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* 스텝퍼 UI (디자인 수정 - '새 장비 등록' 모달의 기존 스타일) */}
          <div className="flex justify-between items-center mb-6 px-4">
            {/* 스텝 1 */}
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? "text-green-400" : "text-gray-400" // 녹색 계열로 변경
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 1
                    ? "bg-green-500 border-green-500 text-white" // 첫번째 이미지의 녹색 원
                    : "border-gray-400 text-gray-400"
                }`}
              >
                1
              </div>
              <span className="text-sm mt-1 text-white text-opacity-80">
                기본 식별
              </span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-4 ${
                step > 1 ? "bg-green-400" : "bg-white bg-opacity-30" // 녹색 계열로 변경
              }`}
            ></div>

            {/* 스텝 2 */}
            <div
              className={`flex flex-col items-center ${
                step >= 2 ? "text-green-400" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 2
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-400 text-gray-400"
                }`}
              >
                2
              </div>
              <span className="text-sm mt-1 text-white text-opacity-80">
                위치 & 사양
              </span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-4 ${
                step > 2 ? "bg-green-400" : "bg-white bg-opacity-30"
              }`}
            ></div>

            {/* 스텝 3 */}
            <div
              className={`flex flex-col items-center ${
                step >= 3 ? "text-green-400" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 3
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-400 text-gray-400"
                }`}
              >
                3
              </div>
              <span className="text-sm mt-1 text-white text-opacity-80">
                관리 & 모니터링
              </span>
            </div>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {isLoadingDetail ? (
              <div className="flex justify-center items-center min-h-[200px] text-white opacity-80">
                <Loader2 size={32} className="animate-spin mr-2" />
                상세 정보를 불러오는 중...
              </div>
            ) : isErrorDetail ? (
              <div className="flex justify-center items-center min-h-[200px] text-red-400">
                오류: 상세 정보를 불러오지 못했습니다.
              </div>
            ) : (
              // 5. 스크롤 높이 max-h-[60vh]로 변경
              <div className="mb-6 max-h-[60vh] overflow-y-auto pr-2">
                {renderStepContent()}
              </div>
            )}

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between items-center mt-8">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 btn-cancel" 
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    이전
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-2 btn-cancel"
                >
                  취소
                </button>

                {step < 3 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                    className="px-4 py-2 btn-create" 
                  >
                    다음
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="submit"
                    disabled={isLoading || isErrorDetail}
                    className="px-4 py-2 btn-create" 
                  >
                    {isLoadingMutation
                      ? "저장 중..."
                      : resourceId
                        ? "수정 완료"
                        : "등록 완료"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}