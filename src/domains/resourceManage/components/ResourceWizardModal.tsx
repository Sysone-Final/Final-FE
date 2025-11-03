import React, { useState, useEffect, useMemo } from "react";
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
  useGetDatacenters,
  useGetRacksByDatacenter,
  useGetResourceById,
} from "../hooks/useResourceQueries";
import { X, ArrowLeft, Loader2 } from "lucide-react";

// --- 공통 폼 필드 스타일 ---
const inputStyle =
  // "bg-gray-900/20 border-white border-opacity-30 text-white ..."; -> 배경/테두리 조정
  "bg-gray-800 border border-gray-700 text-gray-50 p-2 rounded w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-700 disabled:placeholder-gray-500";
// 텍스트 클래스
const labelStyle = "block mb-1 text-label-form"; 
const gridContainerStyle = "grid grid-cols-1 md:grid-cols-2 gap-4";
const gridSpanFullStyle = "md:col-span-2";
const fieldGroupStyle = "mb-6 p-4 border-t border-gray-700"; // 테두리 색상
// 텍스트 클래스 
const fieldGroupTitleStyle = "mb-3 text-heading"; 
const helperTextStyle = "text-xs text-gray-400 mt-1 pl-1"; // 색상 조정
const errorTextStyle = "text-xs text-red-400 mt-1";


type FormValues = Partial<Resource>;

// --- Step 컴포넌트들의 prop 타입을 react-hook-form 기준으로 변경 ---
type FileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

//  props 변경
interface Step1Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  handleFileChange: FileChangeHandler;
  imageFrontPreview: string | null;
  imageRearPreview: string | null;
}

interface Step2Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  getValues: UseFormGetValues<FormValues>;
}

interface Step3Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
}

// --- 스텝 1 컴포넌트 ---
// (CHANGES: register, errors 적용)
const Step1Identity = ({
  register,
  errors,
  handleFileChange,
  imageFrontPreview,
  imageRearPreview,
}: Step1Props) => (
  <div className={gridContainerStyle}>
    {/* --- 필수 --- */}
    <div>
      <label className={labelStyle}>
        장비명 (Equipment Name) <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register("equipmentName", { required: "장비명은 필수 입력 항목입니다." })}
        className={`${inputStyle} ${errors.equipmentName ? "border-red-500 ring-red-500" : ""}`}
      />
      {errors.equipmentName && <p className={errorTextStyle}>{errors.equipmentName.message}</p>}
    </div>

    <div>
      <label className={labelStyle}>
        장비 유형 (Equipment Type) <span className="text-red-500">*</span>
      </label>
      <select
        {...register("equipmentType", { required: "장비 유형을 선택하세요." })}
        className={`${inputStyle} ${errors.equipmentType ? "border-red-500 ring-red-500" : ""}`}
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
        className={inputStyle}
      />
    </div>
    <div>
      <label className={labelStyle}>모델명 (Model Name)</label>
      <input
        type="text"
        {...register("modelName")}
        className={inputStyle}
      />
    </div>
    <div>
      <label className={labelStyle}>시리얼 번호 (Serial Number)</label>
      <input
        type="text"
        {...register("serialNumber")}
        className={inputStyle}
      />
    </div>
    <div>
      <label className={labelStyle}>자산 관리 코드 (Equipment Code)</label>
      <input
        type="text"
        {...register("equipmentCode")}
        className={inputStyle}
      />
    </div>

    {/* --- 이미지 (파일 입력은 기존 방식 유지) --- */}
    <div className={gridSpanFullStyle}>
      <label className={labelStyle}>장비 이미지 (앞면)</label>
      <input
        type="file"
        name="imageFrontFile"
        accept="image/*"
        onChange={handleFileChange} // RHF register 사용 안 함
        className={`${inputStyle} text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-blue-50 hover:file:bg-blue-700`}
      />
      {imageFrontPreview && (
          // 이미지 미리보기 테두리
        <div className="mt-2 border border-gray-700 rounded p-1 inline-block">
          <img
            src={imageFrontPreview}
            alt="앞면 미리보기"
            className="max-h-32 max-w-full object-contain rounded"
          />
        </div>
      )}
    </div>
    <div className={gridSpanFullStyle}>
      <label className={labelStyle}>장비 이미지 (뒷면)</label>
      <input
        type="file"
        name="imageRearFile"
        accept="image/*"
        onChange={handleFileChange} // RHF register 사용 안 함
        className={`${inputStyle} text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-blue-50 hover:file:bg-blue-700`}
      />
      {imageRearPreview && (
// 이미지 미리보기 테두리
        <div className="mt-2 border border-gray-700 rounded p-1 inline-block">          
        <img
            src={imageRearPreview}
            alt="뒷면 미리보기"
            className="max-h-32 max-w-full object-contain rounded"
          />
        </div>
      )}
    </div>
  </div>
);

// --- 스텝 2 컴포넌트 (API 연동) ---
// register, errors, watch, getValues 적용)
const Step2Location = ({ register, errors, watch, getValues }: Step2Props) => {
  //  watch를 사용하여 datacenterId 값 감시
  const watchedDatacenterId = watch("datacenterId");
  //  rackId 감시 (startUnit, unitSize 활성화용)
  const watchedRackId = watch("rackId");

  //  formData.datacenterId 대신 watchedDatacenterId 사용
  const {
    data: datacenters,
    isLoading: isLoadingDatacenters,
    isError: isErrorDatacenters,
  } = useGetDatacenters();
  const {
    data: racks,
    isLoading: isLoadingRacks,
    isError: isErrorRacks,
  } = useGetRacksByDatacenter(watchedDatacenterId || null);

  // 랙 목록(racks) 또는 선택된 랙(watchedRackId)이 바뀔 때 maxUnits 재계산
  const selectedRack = useMemo(() => {
    if (!watchedRackId || !racks || !Array.isArray(racks)) return null;
    return racks.find((r: Rack) => r.id === watchedRackId);
  }, [watchedRackId, racks]);

  const maxUnits = selectedRack?.totalUnits || 48;

  return (
    <div>
      {/* 2-1. 물리적 위치 */}
      <fieldset className={fieldGroupStyle}>
        <legend className={fieldGroupTitleStyle}>물리적 위치</legend>
        <div className={gridContainerStyle}>
          <div>
            <label className={labelStyle}>
              전산실 <span className="text-red-500">*</span>
            </label>
            <select
              {...register("datacenterId", {
                //  required 대신 validate 사용하여 빈 문자열("") 체크
                validate: (value) => value !== "" || "전산실을 선택해야 합니다.",
              })}
              className={`${inputStyle} ${errors.datacenterId ? "border-red-500 ring-red-500" : ""}`}
              disabled={isLoadingDatacenters || isErrorDatacenters}
            >
              <option value=""> {/* 기본 옵션의 value는 "" */}
                {isLoadingDatacenters
                  ? "불러오는 중..."
                  : isErrorDatacenters
                    ? "오류 발생"
                    : "-- 전산실 선택 --"}
              </option>
              {Array.isArray(datacenters) &&
                datacenters.map((dc) => (
                  <option key={dc.id} value={dc.id}>
                    {dc.name}
                  </option>
                ))}
            </select>
            {errors.datacenterId && (
              <p className={errorTextStyle}>{errors.datacenterId.message}</p>
            )}
          </div>
          <div>
            <label className={labelStyle}>
              랙 (Rack) <span className="text-red-500">*</span>
            </label>
            <select
              {...register("rackId", {
                //  전산실과 마찬가지로 validate 사용
                validate: (value) => value !== "" || "랙을 선택해야 합니다.",
              })}
              className={`${inputStyle} ${errors.rackId ? "border-red-500 ring-red-500" : ""}`}
              disabled={!watchedDatacenterId || isLoadingRacks || isErrorRacks}
            >
              <option value="">
                {isLoadingRacks
                  ? "불러오는 중..."
                  : !watchedDatacenterId
                    ? "-- 전산실 먼저 선택 --"
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
          
          {/* --- startUnit, unitSize RHF 적용 --- */}
          <div>
            <label className={labelStyle}>
              시작 유닛 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("startUnit", {
                required: "시작 유닛을 입력하세요.",
                valueAsNumber: true,
                min: { value: 1, message: "시작 유닛은 1 이상이어야 합니다." },
                max: {
                  value: maxUnits,
                  message: `이 랙의 최대 유닛(${maxUnits}U)을 초과할 수 없습니다.`,
                },
              })}
              min="1"
              max={maxUnits}
              className={`${inputStyle} ${errors.startUnit ? "border-red-500 ring-red-500" : ""}`}
              disabled={!watchedRackId}
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
                // (선택적) 시작 유닛 + 크기 검증
                validate: (value) => {
                  const startUnit = getValues("startUnit");
                  if (typeof startUnit === 'number' && typeof value === 'number') {
                    return (
                      startUnit + value - 1 <= maxUnits ||
                      `설치 위치(U)가 랙의 최대 크기(${maxUnits}U)를 초과합니다.`
                    );
                  }
                  return true; // startUnit이 없으면 이 검증은 통과
                },
              })}
              min="1"
              max={maxUnits}
              className={`${inputStyle} ${errors.unitSize ? "border-red-500 ring-red-500" : ""}`}
              disabled={!watchedRackId}
            />
            <p className={helperTextStyle}>장비가 차지하는 U 크기 (예: 2U)</p>
            {errors.unitSize && (
              <p className={errorTextStyle}>{errors.unitSize.message}</p>
            )}
          </div>
          {/* --- END --- */}

          <div className={gridSpanFullStyle}>
            <label className={labelStyle}>설치 방향</label>
            <select
              {...register("positionType")}
              className={inputStyle}
            >
              <option value="">-- 방향 선택 --</option>
              <option value="FRONT">FRONT</option>
              <option value="REAR">REAR</option>
              <option value="NORMAL">NORMAL</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* 2-2. 하드웨어 및 네트워크 사양 (모두 register 적용) */}
      <fieldset className={`${fieldGroupStyle} mt-4`}>
        <legend className={fieldGroupTitleStyle}>HW & Network Specs</legend>
        <div className={gridContainerStyle}>
          <div>
            <label className={labelStyle}>운영체제 (OS)</label>
            <input
              type="text"
              {...register("os")}
              className={inputStyle}
              placeholder="예: Ubuntu 20.04, Windows Server 2019"
            />
          </div>
          <div>
            <label className={labelStyle}>CPU 사양 (CPU Spec)</label>
            <input
              type="text"
              {...register("cpuSpec")}
              className={inputStyle}
              placeholder="예: Intel Xeon Gold 6248"
            />
          </div>
          <div>
            <label className={labelStyle}>메모리 사양 (Memory Spec)</label>
            <input
              type="text"
              {...register("memorySpec")}
              className={inputStyle}
              placeholder="예: 128GB DDR4"
            />
          </div>
          <div>
            <label className={labelStyle}>디스크 사양 (Disk Spec)</label>
            <input
              type="text"
              {...register("diskSpec")}
              className={inputStyle}
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
              className={`${inputStyle} ${errors.ipAddress ? "border-red-500 ring-red-500" : ""}`}
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
              className={`${inputStyle} ${errors.macAddress ? "border-red-500 ring-red-500" : ""}`}
              placeholder="예: 00:1A:2B:3C:4D:5E"
            />
            {errors.macAddress && (
              <p className={errorTextStyle}>{errors.macAddress.message}</p>
            )}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

// --- [이동] 스텝 3 컴포넌트 ---
//  register, errors, watch 적용
const Step3Management = ({ register, errors, watch }: Step3Props) => {
  // watch를 사용하여 monitoringEnabled 값 감시
  const watchedMonitoringEnabled = watch("monitoringEnabled");

  return (
    <div>
      {/* 3-1. 관리 정보 */}
      <fieldset className={fieldGroupStyle}>
        <legend className={fieldGroupTitleStyle}>
          관리 정보 (Management Info)
        </legend>
        <div className={gridContainerStyle}>
          <div>
            <label className={labelStyle}>담당자 (Manager)</label>
            <input
              type="text"
              {...register("managerId")}
              className={inputStyle}
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
              className={`${inputStyle} ${errors.status ? "border-red-500 ring-red-500" : ""}`}
            >
              <option value="INACTIVE">INACTIVE - 비활성/재고</option>
              <option value="NORMAL">NORMAL - 운영중</option>
              <option value="MAINTENANCE">MAINTENANCE - 점검중</option>
              <option value="DISPOSED">DISPOSED - 폐기</option>
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
              className={inputStyle}
            />
          </div>
          <div className={gridSpanFullStyle}>
            <label className={labelStyle}>메모 (Notes)</label>
            <textarea
              {...register("notes")}
              rows={3}
              className={inputStyle}
            ></textarea>
          </div>
        </div>
      </fieldset>

      {/* 3-2. 모니터링 설정 (모두 register, disabled 적용) */}
      <fieldset className={`${fieldGroupStyle} mt-4`}>
        <legend className={fieldGroupTitleStyle}>
          모니터링 설정 (Monitoring Configuration)
        </legend>

        <div className="flex items-center mb-4">
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

        <div className={gridContainerStyle}>
          <div>
            <label className={labelStyle}>CPU 경고 임계치 (%)</label>
            <input
              type="number"
              {...register("cpuThresholdWarning", { valueAsNumber: true })}
              className={inputStyle}
              disabled={!watchedMonitoringEnabled}
            />
          </div>
          <div>
            <label className={labelStyle}>CPU 위험 임계치 (%)</label>
            <input
              type="number"
              {...register("cpuThresholdCritical", { valueAsNumber: true })}
              className={inputStyle}
              disabled={!watchedMonitoringEnabled}
            />
          </div>
          <div>
            <label className={labelStyle}>메모리 경고 임계치 (%)</label>
            <input
              type="number"
              {...register("memoryThresholdWarning", { valueAsNumber: true })}
              className={inputStyle}
              disabled={!watchedMonitoringEnabled}
            />
          </div>
          <div>
            <label className={labelStyle}>메모리 위험 임계치 (%)</label>
            <input
              type="number"
              {...register("memoryThresholdCritical", { valueAsNumber: true })}
              className={inputStyle}
              disabled={!watchedMonitoringEnabled}
            />
          </div>
          <div>
            <label className={labelStyle}>디스크 경고 임계치 (%)</label>
            <input
              type="number"
              {...register("diskThresholdWarning", { valueAsNumber: true })}
              className={inputStyle}
              disabled={!watchedMonitoringEnabled}
            />
          </div>
          <div>
            <label className={labelStyle}>디스크 위험 임계치 (%)</label>
            <input
              type="number"
              {...register("diskThresholdCritical", { valueAsNumber: true })}
              className={inputStyle}
              disabled={!watchedMonitoringEnabled}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

// 폼 기본값 (새 장비 등록 시)
const getDefaultFormData = (): Partial<Resource> => ({
  equipmentName: "",
  equipmentType: "SERVER",
  unitSize: 1,
  status: "INACTIVE",
  manufacturer: "",
  modelName: "",
  serialNumber: "",
  equipmentCode: "",
  datacenterId: null,
  rackId: null,
  startUnit: null,
  positionType: null,
  os: "",
  cpuSpec: "",
  memorySpec: "",
  diskSpec: "",
  ipAddress: "",
  macAddress: "",
  managerId: "",
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
  // resource: Resource | null; // null이면 'Add', 객체면 'Edit'
  resourceId: string | null;// null이면 'Add', ID가 있으면 'Edit'
}

export default function ResourceWizardModal({
  isOpen,
  onCloseHandler,
  // resource,
  resourceId,
}: ResourceWizardModalProps) {
  const [step, setStep] = useState(1);

  // react-hook-form 훅 초기화 ---
  // trigger 포함
  const {
    register,
    handleSubmit,
    formState: { errors }, // 'errors' 객체
    watch,
    setValue,
    reset,
    trigger, // 스텝별 유효성 검사용
    getValues, // 현재 값 조회용
    control, // useFormState용
  } = useForm<FormValues>({
    defaultValues: getDefaultFormData(),
  });

  //  datacenterId 변경 감지 (rackId 리셋용)
  const { dirtyFields } = useFormState({ control });
  const watchedDatacenterId = watch("datacenterId");

  useEffect(() => {
    // 폼이 dirty(사용자 수정) 상태이고, datacenterId가 변경되었을 때만 rackId, startUnit 리셋
    if (dirtyFields.datacenterId) {
      setValue("rackId", null, { shouldValidate: true });
      setValue("startUnit", null, { shouldValidate: true });
    }
  }, [watchedDatacenterId, dirtyFields.datacenterId, setValue]);

  const [imageFrontFile, setImageFrontFile] = useState<File | null>(null);
  const [imageRearFile, setImageRearFile] = useState<File | null>(null);
  const [imageFrontPreview, setImageFrontPreview] = useState<string | null>(null);
  const [imageRearPreview, setImageRearPreview] = useState<string | null>(null);

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

  //  'Edit' 모드일 때 RHF의 reset 사용
  useEffect(() => {
  if (isOpen) {
      // 1. 'Add' 모드 (resourceId가 null)
   if (!resourceId) {
    // 'Add' 모드: 폼 기본값으로 리셋
    reset(getDefaultFormData());
    setImageFrontPreview(null);
    setImageRearPreview(null);
        setImageFrontFile(null); // 파일 상태도 초기화
        setImageRearFile(null);
    setStep(1); // 모달 열릴 때 항상 1단계
   } 
      
      // 2. 'Edit' 모드 (resourceId가 있고, 데이터 로드 완료)
      else if (resourceId && resourceDetailData) {
    // 'Edit' 모드: API로 받은 상세 데이터로 폼 채우기
    reset({
     ...getDefaultFormData(),
     ...resourceDetailData,
    });
    // 'Edit' 모드 시 기존 이미지 URL을 미리보기로 설정
    setImageFrontPreview(resourceDetailData.imageUrlFront || null);
    setImageRearPreview(resourceDetailData.imageUrlRear || null);
        setImageFrontFile(null); // 파일 상태는 초기화
        setImageRearFile(null);
    setStep(1); 
   }
      // 'Edit' 모드 (로딩 중)일 때는 아무것도 하지 않음 (로딩 스피너 표시)

  }
 }, [resourceId, resourceDetailData, isOpen, reset]);
// 모달이 닫힐 때(isOpen=false) 정리를 담당하는 useEffect
useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때: 폼 리셋 및 미리보기 URL 해제
      reset(getDefaultFormData());
      
      if (imageFrontPreview && imageFrontPreview.startsWith("blob:")) {
        URL.revokeObjectURL(imageFrontPreview);
      }
      if (imageRearPreview && imageRearPreview.startsWith("blob:")) {
        URL.revokeObjectURL(imageRearPreview);
      }
      
      setImageFrontPreview(null);
      setImageRearPreview(null);
    }
  }, [isOpen, reset, imageFrontPreview, imageRearPreview]);

  
  // (미리보기 URL 해제 로직 - blob URL만 해제하도록 수정)
  useEffect(() => {
    return () => {
      if (imageFrontPreview && imageFrontPreview.startsWith("blob:")) URL.revokeObjectURL(imageFrontPreview);
      if (imageRearPreview && imageRearPreview.startsWith("blob:")) URL.revokeObjectURL(imageRearPreview);
    };
  }, [imageFrontPreview, imageRearPreview]);

  if (!isOpen) return null;

  // (handleFileChange 함수는 이전과 동일하게 유지)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files && files.length > 0 ? files[0] : null;

    if (name === "imageFrontFile") {
      // 이전 'blob' 미리보기만 해제 (http/https URL은 해제 안 함)
      if (imageFrontPreview && imageFrontPreview.startsWith("blob:")) {
        URL.revokeObjectURL(imageFrontPreview);
      }
      setImageFrontFile(file);
      setImageFrontPreview(file ? URL.createObjectURL(file) : null);
    } else if (name === "imageRearFile") {
      if (imageRearPreview && imageRearPreview.startsWith("blob:")) {
        URL.revokeObjectURL(imageRearPreview);
      }
      setImageRearFile(file);
      setImageRearPreview(file ? URL.createObjectURL(file) : null);
    }
  };


  // '다음' 버튼 클릭 시 스텝별 유효성 검사 수행
  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) {
      // 1단계: 필수 필드
      fieldsToValidate = ['equipmentName', 'equipmentType'];
    } else if (step === 2) {
      // 2단계: 필수 필드
      
      // FIX: 2단계의 모든 필수 필드를 항상 검사하도록 수정
      fieldsToValidate.push(
        'unitSize',
        'datacenterId', // '전산실' 검사
        'rackId',       // '랙' 검사
        'startUnit'     // '시작 유닛' 검사
      );

      // ipAddress/macAddress는 필수는 아니지만, 입력했다면 패턴 검사
      if (getValues('ipAddress')) {
        fieldsToValidate.push('ipAddress');
      }
      if (getValues('macAddress')) {
        fieldsToValidate.push('macAddress');
      }
    }
    // (step 3 에서는 '다음' 버튼이 없으므로 검사 불필요)

    // trigger 타입이 없었던 문제 수정됨
    const isValid = await trigger(fieldsToValidate); // 현재 스텝 필드 유효성 검사

    if (isValid) {
      setStep((s) => Math.min(s + 1, 3));
    }
    // 유효하지 않으면 RHF가 자동으로 에러 메시지를 표시
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleClose = () => {
    if (isLoading) return;
    onCloseHandler();
    // 모달 닫힐 때 폼 리셋 (useEffect [isOpen]에서 이미 처리)
  };

  // submitHandler -> RHF의 SubmitHandler<FormValues> 타입인 'onSubmit'으로 변경
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // event.preventDefault() 불필요 (handleSubmit이 처리)

    const submitFormData = new FormData();

    // RHF가 전달해준 'data' 객체(유효성 검사 통과한)를 사용
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        submitFormData.append(key, String(value));
      }
    }

    if (imageFrontFile) {
      submitFormData.append("imageFrontFile", imageFrontFile);
    }
    if (imageRearFile) {
      submitFormData.append("imageRearFile", imageRearFile);
    }
    
    if (resourceId) {
   updateResourceMutation.mutate(
    { id: resourceId, formData: submitFormData }, // resource.id -> resourceId
    { onSuccess: handleClose },
   );
    } else {
      createResourceMutation.mutate(submitFormData, { onSuccess: handleClose });
    }
  };

  // --- 스텝별 컨텐츠 렌더링 ---
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          //  props 전달 (RHF 기준)
          <Step1Identity
            register={register}
            errors={errors}
            handleFileChange={handleFileChange}
            imageFrontPreview={imageFrontPreview}
            imageRearPreview={imageRearPreview}
          />
        );
      case 2:
        return (
          <Step2Location
            register={register}
            errors={errors}
            watch={watch}
            getValues={getValues}
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
    // 모달 배경 블러
    <div className="modal-bg">
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

          {/* 스텝퍼 UI  */}
          <div className="flex justify-between items-center mb-6 px-4">
             {/* 스텝 1 */}
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? "text-blue-300" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 1
                    ? "bg-green-500 border-blue-500 text-white"
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
                step > 1 ? "bg-blue-400" : "bg-white bg-opacity-30"
              }`}
            ></div>

            {/* 스텝 2 */}
            <div
              className={`flex flex-col items-center ${
                step >= 2 ? "text-blue-300" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 2
                    ? "bg-green-500 border-blue-500 text-white"
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
                step > 2 ? "bg-blue-400" : "bg-white bg-opacity-30"
              }`}
            ></div>

            {/* 스텝 3 */}
            <div
              className={`flex flex-col items-center ${
                step >= 3 ? "text-blue-300" : "text-gray-400"
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
              <div className="mb-6 max-h-[50vh] overflow-y-auto pr-2">
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
                    className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
                    onClick={nextStep} // 유효성 검사가 포함된 nextStep
                    disabled={isLoading}
                    className="px-4 py-2 btn-create"
                  >
                    다음
                  </button>
                )}

                {step === 3 && (
                  <button
          type="submit"
                      // 💡 상세 로딩/에러 시 '완료' 버튼 비활성화
          disabled={isLoading || isErrorDetail}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
         >
                        {/* ▼▼▼ [11] 수정: 로딩 텍스트 분리 ▼▼▼ */}
          {isLoadingMutation // 저장/수정 중일 때
           ? "저장 중..."
           : resourceId // 수정 모드일 때
            ? "수정 완료"
            : "등록 완료"}
                        {/* ▲▲▲ [11] 수정 ▲▲▲ */}
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

