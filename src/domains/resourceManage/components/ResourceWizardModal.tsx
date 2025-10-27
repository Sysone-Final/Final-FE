// src/domains/resourceManage/components/ResourceWizardModal.tsx
import React, { useState, useEffect, useMemo } from "react";
// [수정] Datacenter 타입을 import 합니다.
import type { Resource, Rack, Datacenter } from "../types/resource.types";
import {
  useCreateResource,
  useUpdateResource,
  useGetDatacenters,
  useGetRacksByDatacenter,
} from "../hooks/useResourceQueries";
import { X, ArrowLeft } from "lucide-react";

// --- [수정] 공통 폼 필드 스타일 (글래스모피즘 버전) ---
const inputStyle =
  "bg-white bg-opacity-10 border border-white border-opacity-30 text-white p-2 rounded w-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-500 disabled:bg-opacity-20";
const labelStyle = "block text-sm font-medium text-white mb-1";
const gridContainerStyle = "grid grid-cols-1 md:grid-cols-2 gap-4";
const gridSpanFullStyle = "md:col-span-2";
const fieldGroupStyle = "mb-6 p-4 border-t border-white border-opacity-20";
const fieldGroupTitleStyle = "text-lg font-semibold mb-3 text-white";
const helperTextStyle = "text-xs text-white text-opacity-70 mt-1 pl-1";

// --- [수정] Step 컴포넌트들의 prop 타입을 명시적으로 변경 ---
type ChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
) => void;
type FileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

interface Step1Props {
  formData: Partial<Resource>;
  handleChange: ChangeHandler;
  handleFileChange: FileChangeHandler;
}

interface Step2Props {
  formData: Partial<Resource>;
  handleChange: ChangeHandler;
}

interface Step3Props {
  formData: Partial<Resource>;
  handleChange: ChangeHandler;
}

// --- [이동] 스텝 1 컴포넌트 ---
const Step1Identity = ({
  formData,
  handleChange,
  handleFileChange,
}: Step1Props) => (
  <div className={gridContainerStyle}>
    {/* --- 필수 --- */}
    <div>
      <label className={labelStyle}>
        장비명 (Equipment Name) <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="equipmentName"
        value={formData.equipmentName}
        onChange={handleChange}
        className={inputStyle}
        required
      />
    </div>
    <div>
      <label className={labelStyle}>
        장비 유형 (Equipment Type) <span className="text-red-500">*</span>
      </label>
      <select
        name="equipmentType"
        value={formData.equipmentType}
        onChange={handleChange}
        className={inputStyle}
        required
      >
        <option value="SERVER">SERVER</option>
        <option value="SWITCH">SWITCH</option>
        <option value="ROUTER">ROUTER</option>
        <option value="PDU">PDU</option>
        <option value="UPS">UPS</option>
      </select>
    </div>

    {/* --- 선택 --- */}
    <div>
      <label className={labelStyle}>제조사 (Manufacturer)</label>
      <input
        type="text"
        name="manufacturer"
        value={formData.manufacturer || ""}
        onChange={handleChange}
        className={inputStyle}
      />
    </div>
    <div>
      <label className={labelStyle}>모델명 (Model Name)</label>
      <input
        type="text"
        name="modelName"
        value={formData.modelName || ""}
        onChange={handleChange}
        className={inputStyle}
      />
    </div>
    <div>
      <label className={labelStyle}>시리얼 번호 (Serial Number)</label>
      <input
        type="text"
        name="serialNumber"
        value={formData.serialNumber || ""}
        onChange={handleChange}
        className={inputStyle}
      />
    </div>
    <div>
      <label className={labelStyle}>자산 관리 코드 (Equipment Code)</label>
      <input
        type="text"
        name="equipmentCode"
        value={formData.equipmentCode || ""}
        onChange={handleChange}
        className={inputStyle}
      />
    </div>

    {/* --- 이미지 --- */}
    <div className={gridSpanFullStyle}>
      <label className={labelStyle}>장비 이미지 (앞면)</label>
      <input
        type="file"
        name="imageFrontFile"
        accept="image/*"
        onChange={handleFileChange}
        className={`${inputStyle} text-sm`}
      />
      {/* TODO: 이미지 미리보기 */}
    </div>
    <div className={gridSpanFullStyle}>
      <label className={labelStyle}>장비 이미지 (뒷면)</label>
      <input
        type="file"
        name="imageRearFile"
        accept="image/*"
        onChange={handleFileChange}
        className={`${inputStyle} text-sm`}
      />
      {/* TODO: 이미지 미리보기 */}
    </div>
  </div>
);

// --- 스텝 2 컴포넌트 (API 연동) ---
const Step2Location = ({ formData, handleChange }: Step2Props) => {
  // API 훅 호출 (훅의 반환값은 이미 배열)
  const { data: datacenters, isLoading: isLoadingDatacenters } = // [수정] 변수명 datacenters 로 변경
    useGetDatacenters();
  const { data: racks, isLoading: isLoadingRacks } = // [수정] 변수명 racks 로 변경
    useGetRacksByDatacenter(formData.datacenterId || null);

  // [삭제] 불필요한 result 추출 제거
  // const datacenters = datacentersData?.result;
  // const racks = racksData?.result;

  // 선택된 랙의 총 유닛 수 계산 (racks 변수 직접 사용)
  const maxUnits = useMemo(() => {
    if (!formData.rackId || !racks) return 48;
    const selectedRack = racks.find((r: Rack) => r.id === formData.rackId); // racks 변수 사용
    return selectedRack?.totalUnits || 48;
  }, [formData.rackId, racks]); // racks 변수 의존

  return (
    <div>
      {/* 2-1. 물리적 위치 */}
      <fieldset className={fieldGroupStyle}>
        <legend className={fieldGroupTitleStyle}>
          물리적 위치 (Physical Location)
        </legend>
        <div className={gridContainerStyle}>
          <div>
            <label className={labelStyle}>전산실 (Datacenter)</label>
            <select
              name="datacenterId"
              value={formData.datacenterId || ""}
              onChange={handleChange}
              className={inputStyle}
              disabled={isLoadingDatacenters} // 로딩 중 비활성화
            >
              <option value="">
                {isLoadingDatacenters
                  ? "불러오는 중..."
                  : "-- 전산실 선택 --"}
              </option>
              {datacenters?.map((dc: Datacenter) => (
                <option key={dc.id} value={dc.id}>
                  {dc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelStyle}>랙 (Rack)</label>
            <select
              name="rackId"
              value={formData.rackId || ""}
              onChange={handleChange}
              className={inputStyle}
              disabled={!formData.datacenterId || isLoadingRacks}
            >
              <option value="">
                {isLoadingRacks
                  ? "불러오는 중..."
                  : !formData.datacenterId
                    ? "-- 전산실을 먼저 선택 --"
                    : "-- 랙 선택 --"}
              </option>
              {racks?.map((rack: Rack) => (
                <option key={rack.id} value={rack.id}>
                  {rack.rackName} ({rack.availableUnits}U / {rack.totalUnits}U)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelStyle}>시작 유닛 (Start Unit)</label>
            <input
              type="number"
              name="startUnit"
              value={formData.startUnit || ""}
              min="1"
              max={maxUnits}
              onChange={handleChange}
              className={inputStyle}
              disabled={!formData.rackId}
            />
            <p className={helperTextStyle}>
              랙의 몇 번째 U부터 장착되나요? (최대: {maxUnits}U)
            </p>
          </div>
          <div>
            <label className={labelStyle}>
              유닛 크기 (Unit Size) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="unitSize"
              value={formData.unitSize}
              min="1"
              max={maxUnits}
              onChange={handleChange}
              className={inputStyle}
              required
              disabled={!formData.rackId}
            />
            <p className={helperTextStyle}>
              장비가 차지하는 U 크기 (예: 2U)
            </p>
          </div>
          <div className={gridSpanFullStyle}>
            <label className={labelStyle}>설치 방향 (Position Type)</label>
            <select
              name="positionType"
              value={formData.positionType || ""}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">-- 방향 선택 --</option>
              <option value="FRONT">FRONT - 전면 실장</option>
              <option value="REAR">REAR - 후면 실장</option>
              <option value="NORMAL">NORMAL (기타)</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* 2-2. 하드웨어 및 네트워크 사양 */}
      <fieldset className={`${fieldGroupStyle} mt-4`}>
        <legend className={fieldGroupTitleStyle}>HW & Network Specs</legend>
        <div className={gridContainerStyle}>
          <div>
            <label className={labelStyle}>운영체제 (OS)</label>
            <input
              type="text"
              name="os"
              value={formData.os || ""}
              onChange={handleChange}
              className={inputStyle}
              placeholder="예: Ubuntu 20.04, Windows Server 2019"
            />
          </div>
          <div>
            <label className={labelStyle}>CPU 사양 (CPU Spec)</label>
            <input
              type="text"
              name="cpuSpec"
              value={formData.cpuSpec || ""}
              onChange={handleChange}
              className={inputStyle}
              placeholder="예: Intel Xeon Gold 6248"
            />
          </div>
          <div>
            <label className={labelStyle}>메모리 사양 (Memory Spec)</label>
            <input
              type="text"
              name="memorySpec"
              value={formData.memorySpec || ""}
              onChange={handleChange}
              className={inputStyle}
              placeholder="예: 128GB DDR4"
            />
          </div>
          <div>
            <label className={labelStyle}>디스크 사양 (Disk Spec)</label>
            <input
              type="text"
              name="diskSpec"
              value={formData.diskSpec || ""}
              onChange={handleChange}
              className={inputStyle}
              placeholder="예: 2TB SSD x 2"
            />
          </div>
          <div>
            <label className={labelStyle}>IP 주소 (IP Address)</label>
            <input
              type="text"
              name="ipAddress"
              value={formData.ipAddress || ""}
              onChange={handleChange}
              className={inputStyle}
              placeholder="예: 192.168.1.10"
            />
          </div>
          <div>
            <label className={labelStyle}>MAC 주소 (MAC Address)</label>
            <input
              type="text"
              name="macAddress"
              value={formData.macAddress || ""}
              onChange={handleChange}
              className={inputStyle}
              placeholder="예: 00:1A:2B:3C:4D:5E"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

// --- [이동] 스텝 3 컴포넌트 ---
const Step3Management = ({ formData, handleChange }: Step3Props) => (
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
            name="managerId"
            value={formData.managerId || ""}
            onChange={handleChange}
            className={inputStyle}
            placeholder="담당자 ID 또는 이름"
          />
        </div>
        <div>
          <label className={labelStyle}>
            장비 상태 (Status) <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputStyle}
            required
          >
            <option value="INACTIVE">INACTIVE - 비활성/재고</option>
            <option value="NORMAL">NORMAL - 운영중</option>
            <option value="MAINTENANCE">MAINTENANCE - 점검중</option>
            <option value="DISPOSED">DISPOSED - 폐기</option>
          </select>
        </div>
        <div>
          <label className={labelStyle}>설치일 (Installation Date)</label>
          <input
            type="date"
            name="installationDate"
            value={formData.installationDate || ""}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>
        <div className={gridSpanFullStyle}>
          <label className={labelStyle}>메모 (Notes)</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            rows={3}
            className={inputStyle}
          ></textarea>
        </div>
      </div>
    </fieldset>

    {/* 3-2. 모니터링 설정 */}
    <fieldset className={`${fieldGroupStyle} mt-4`}>
      <legend className={fieldGroupTitleStyle}>
        모니터링 설정 (Monitoring Configuration)
      </legend>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="monitoringEnabled"
          name="monitoringEnabled"
          checked={!!formData.monitoringEnabled}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
        />
        <label
          htmlFor="monitoringEnabled"
          className="font-medium text-white" // [수정] text-white
        >
          실시간 모니터링 활성화
        </label>
      </div>

      <div className={gridContainerStyle}>
        <div>
          <label className={labelStyle}>CPU 경고 임계치 (%)</label>
          <input
            type="number"
            name="cpuThresholdWarning"
            value={formData.cpuThresholdWarning || ""}
            onChange={handleChange}
            className={inputStyle}
            disabled={!formData.monitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>CPU 위험 임계치 (%)</label>
          <input
            type="number"
            name="cpuThresholdCritical"
            value={formData.cpuThresholdCritical || ""}
            onChange={handleChange}
            className={inputStyle}
            disabled={!formData.monitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>메모리 경고 임계치 (%)</label>
          <input
            type="number"
            name="memoryThresholdWarning"
            value={formData.memoryThresholdWarning || ""}
            onChange={handleChange}
            className={inputStyle}
            disabled={!formData.monitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>메모리 위험 임계치 (%)</label>
          <input
            type="number"
            name="memoryThresholdCritical"
            value={formData.memoryThresholdCritical || ""}
            onChange={handleChange}
            className={inputStyle}
            disabled={!formData.monitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>디스크 경고 임계치 (%)</label>
          <input
            type="number"
            name="diskThresholdWarning"
            value={formData.diskThresholdWarning || ""}
            onChange={handleChange}
            className={inputStyle}
            disabled={!formData.monitoringEnabled}
          />
        </div>
        <div>
          <label className={labelStyle}>디스크 위험 임계치 (%)</label>
          <input
            type="number"
            name="diskThresholdCritical"
            value={formData.diskThresholdCritical || ""}
            onChange={handleChange}
            className={inputStyle}
            disabled={!formData.monitoringEnabled}
          />
        </div>
      </div>
    </fieldset>
  </div>
);

// 폼 기본값 (새 장비 등록 시)
const getDefaultFormData = (): Partial<Resource> => ({
  equipmentName: "",
  equipmentType: "SERVER",
  unitSize: 1,
  status: "INACTIVE", // '선등록' 시 기본 상태는 '비활성/재고'

  // Nullable 필드
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
  resource: Resource | null; // null이면 'Add', 객체면 'Edit'
}

export default function ResourceWizardModal({
  isOpen,
  onCloseHandler,
  resource,
}: ResourceWizardModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Resource>>(
    getDefaultFormData(),
  );

  // 이미지 파일 상태
  const [imageFrontFile, setImageFrontFile] = useState<File | null>(null);
  const [imageRearFile, setImageRearFile] = useState<File | null>(null);

  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();
  const isLoading =
    createResourceMutation.isPending || updateResourceMutation.isPending;

  // 'Edit' 모드일 때, 기존 데이터로 폼 채우기
  useEffect(() => {
    if (resource && isOpen) {
      setFormData({
        ...getDefaultFormData(), // 기본값으로 먼저 채우고
        ...resource, // 기존 데이터로 덮어쓰기
      });
      setStep(1); // 모달 열릴 때 항상 1단계부터
    } else if (!resource && isOpen) {
      // 'Add' 모드일 때 폼 초기화
      setFormData(getDefaultFormData());
      setStep(1);
    }
    // 모달 열릴 때마다 파일 선택 초기화
    setImageFrontFile(null);
    setImageRearFile(null);
  }, [resource, isOpen]);

  if (!isOpen) {
    return null;
  }

  // --- 핸들러 ---

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    let processedValue: string | number | boolean | null = value;

    if (type === "number") {
      processedValue = value === "" ? null : Number(value);
    }
    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]: processedValue,
      };

      // 전산실이 변경되면 랙 선택을 초기화
      if (name === "datacenterId") {
        newState.rackId = null;
        newState.startUnit = null;
      }

      return newState;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "imageFrontFile") {
        setImageFrontFile(files[0]);
      } else if (name === "imageRearFile") {
        setImageRearFile(files[0]);
      }
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleClose = () => {
    if (isLoading) return;
    onCloseHandler();
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    // FormData 생성
    const submitFormData = new FormData();

    // formData의 모든 키-값 쌍을 FormData에 추가
    for (const [key, value] of Object.entries(formData)) {
      if (value !== null && value !== undefined) {
        submitFormData.append(key, String(value));
      }
    }

    // 파일 추가
    if (imageFrontFile) {
      submitFormData.append("imageFrontFile", imageFrontFile); // 백엔드 키 이름
    }
    if (imageRearFile) {
      submitFormData.append("imageRearFile", imageRearFile); // 백엔드 키 이름
    }

    if (resource) {
      // 'Edit' 모드
      updateResourceMutation.mutate(
        { id: resource.id, formData: submitFormData },
        { onSuccess: handleClose },
      );
    } else {
      // 'Add' 모드
      createResourceMutation.mutate(submitFormData, { onSuccess: handleClose });
    }
  };

  // --- 스텝별 컨텐츠 렌더링 ---

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1Identity
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />
        );
      case 2:
        return <Step2Location formData={formData} handleChange={handleChange} />;
      case 3:
        return (
          <Step3Management formData={formData} handleChange={handleChange} />
        );
      default:
        return null;
    }
  };

  return (
    // 모달 배경 블러
    <div className="fixed inset-0 z-40 flex justify-center items-center p-4 backdrop-blur-sm bg-black/20">
      {/* 글래스모피즘 스타일 */}
      <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl w-full max-w-3xl z-50">
        <div className="p-6 md:p-8">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {resource ? "장비 수정" : "새 장비 등록"}
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* 스텝퍼 UI */}
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
                    ? "bg-blue-500 border-blue-500 text-white"
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
                    ? "bg-blue-500 border-blue-500 text-white"
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
                    ? "bg-blue-500 border-blue-500 text-white"
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
          <form onSubmit={submitHandler}>
            <div className="mb-6 max-h-[50vh] overflow-y-auto pr-2">
              {renderStepContent()}
            </div>

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
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  취소
                </button>

                {step < 3 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    다음
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {isLoading
                      ? "저장 중..."
                      : resource
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