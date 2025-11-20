import { useMemo } from "react";
import "../css/serverDashboard.css";
import ServerDashboardHeader from "./ServerDashboardHeader";
import GaugeChart from "./GaugeChart";
import BarChart from "./BarChart";
import CpuIcon from "../assets/cpu.svg";
import MemoryIcon from "../assets/memory.svg";
import DiskIcon from "../assets/disk.svg";
import SmoothLineChart from "./SmoothLineChart";
import AreaLineChart from "./AreaLineChart";
import ChartCard from "./ChartCard";
import ThresholdHeader from "./ThresholdHeader";
import { useUpdateEquipment } from "../hooks/useUpdateEquipment";
import type { Equipments } from "../../rack/types";

interface ServerDashboardProps {
  deviceId: number;
  deviceName: string;
  onClose: () => void;
  isOpen: boolean;
  rackId: number;
  serverRoomId: number;
  currentEquipment?: Equipments;
}

interface ThresholdValues {
  cpu: { warning: number; critical: number };
  memory: { warning: number; critical: number };
  disk: { warning: number; critical: number };
}

const generateConsistentValue = (
  deviceId: number,
  base: number,
  variance: number
) => {
  const seed = deviceId * 9301 + 49297;
  const random = (seed % 233280) / 233280;
  return base + (random - 0.5) * variance;
};

function ServerDashboard({
  deviceName,
  isOpen,
  onClose,
  deviceId,
  rackId,
  serverRoomId,
  currentEquipment,
}: ServerDashboardProps) {
  const { mutate: updateEquipment, isPending } = useUpdateEquipment();

  const initialThresholds = useMemo<ThresholdValues>(() => {
    if (!currentEquipment) {
      return {
        cpu: { warning: 0, critical: 0 },
        memory: { warning: 0, critical: 0 },
        disk: { warning: 0, critical: 0 },
      };
    }

    const result = {
      cpu: {
        warning: currentEquipment.cpuThresholdWarning || 0,
        critical: currentEquipment.cpuThresholdCritical || 0,
      },
      memory: {
        warning: currentEquipment.memoryThresholdWarning || 0,
        critical: currentEquipment.memoryThresholdCritical || 0,
      },
      disk: {
        warning: currentEquipment.diskThresholdWarning || 0,
        critical: currentEquipment.diskThresholdCritical || 0,
      },
    };

    return result;
  }, [currentEquipment]);

  // 임계치 저장 핸들러
  const handleSaveThresholds = (values: ThresholdValues) => {
    if (!currentEquipment) {
      console.error("장비 정보를 찾을 수 없습니다.");
      return;
    }

    updateEquipment(
      {
        id: deviceId,
        data: {
          equipmentName: currentEquipment.equipmentName,
          equipmentType: currentEquipment.equipmentType,
          startUnit: currentEquipment.startUnit,
          unitSize: currentEquipment.unitSize,
          status: currentEquipment.status,
          serverRoomId: serverRoomId,
          rackId: rackId,
          cpuThresholdWarning: values.cpu.warning,
          cpuThresholdCritical: values.cpu.critical,
          memoryThresholdWarning: values.memory.warning,
          memoryThresholdCritical: values.memory.critical,
          diskThresholdWarning: values.disk.warning,
          diskThresholdCritical: values.disk.critical,
        },
      },
      {
        onSuccess: (response) => {
          console.log("임계치 저장 성공:", response);
        },
        onError: (error) => {
          console.error("임계치 저장 실패:", error);
        },
      }
    );
  };

  //더미 데이터 생성
  const generateTimeLabels = (count: number = 31) => {
    const labels = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 1000);
      labels.push(
        `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`
      );
    }
    return labels;
  };

  const generateRandomData = (
    base: number,
    variance: number,
    count: number = 31
  ) => {
    return Array.from(
      { length: count },
      () => Math.random() * variance + base - variance / 2
    );
  };

  const chartData = useMemo(() => {
    const timeLabels = generateTimeLabels();
    const barTimeLabels = generateTimeLabels(12);

    return {
      timeLabels,
      barTimeLabels,
      cpuUsage: Math.round(generateConsistentValue(deviceId, 60, 40)),
      memoryUsage: Math.round(generateConsistentValue(deviceId, 50, 40)),
      diskUsage: Math.round(generateConsistentValue(deviceId, 30, 40)),

      cpuModes: [
        {
          name: "User",
          data: generateRandomData(35, 10, 12),
          color: "#5B8FF9",
        },
        {
          name: "System",
          data: generateRandomData(15, 5, 12),
          color: "#9270CA",
        },
        {
          name: "I/O Wait",
          data: generateRandomData(5, 3, 12),
          color: "#F6BD16",
        },
        {
          name: "IRQ",
          data: generateRandomData(2, 1, 12),
          color: "#5AD8A6",
        },
        {
          name: "Softirq",
          data: generateRandomData(2, 1, 12),
          color: "#f472b6",
        },
      ],

      loadAverage: [
        {
          name: "1분 평균",
          data: generateRandomData(2.0, 1.0, 31),
          color: "#5B8FF9",
        },
        {
          name: "5분 평균",
          data: generateRandomData(1.7, 0.8, 31),
          color: "#5AD8A6",
        },
        {
          name: "15분 평균",
          data: generateRandomData(1.2, 0.5, 31),
          color: "#F6BD16",
        },
      ],

      memorySwap: [
        {
          name: "메모리",
          data: generateRandomData(60, 20),
          color: "#5AD8A6",
          showAverage: true,
        },
        {
          name: "스왑",
          data: generateRandomData(30, 15),
          color: "#F6BD16",
          showAverage: true,
          lineType: "dashed" as const,
        },
      ],

      networkBandwidth: [
        {
          name: "수신 (RX)",
          data: generateRandomData(50, 30),
          color: "#5AD8A6",
        },
        {
          name: "송신 (TX)",
          data: generateRandomData(30, 20),
          color: "#F6BD16",
        },
      ],

      networkErrors: [
        {
          name: "수신 에러",
          data: generateRandomData(0.3, 0.3),
          color: "#5B8FF9",
          lineType: "solid" as const,
        },
        {
          name: "송신 에러",
          data: generateRandomData(0.2, 0.2),
          color: "#9270CA",
          lineType: "solid" as const,
        },
        {
          name: "수신 드롭",
          data: generateRandomData(0.6, 0.4),
          color: "#5AD8A6",
          lineType: "dashed" as const,
        },
        {
          name: "송신 드롭",
          data: generateRandomData(0.5, 0.3),
          color: "#F6BD16",
          lineType: "dashed" as const,
        },
      ],

      diskIO: [
        {
          name: "읽기",
          data: generateRandomData(50, 30),
          color: "#5AD8A6",
        },
        {
          name: "쓰기",
          data: generateRandomData(70, 40),
          color: "#F6BD16",
        },
      ],

      diskIOPS: [
        {
          name: "읽기 IOPS",
          data: generateRandomData(1000, 400),
          color: "#5AD8A6",
        },
        {
          name: "쓰기 IOPS",
          data: generateRandomData(700, 300),
          color: "#F6BD16",
        },
      ],
    };
  }, [deviceId]);

  return (
    <div
      className={`dashboard-container ${isOpen ? "open" : "closed"}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ServerDashboardHeader deviceName={deviceName} onClose={onClose} />
      <ThresholdHeader
        key={deviceId}
        initialValues={initialThresholds}
        onSave={handleSaveThresholds}
        isOpen={isOpen}
        isLoading={isPending}
      />

      <div className="dashboard-content scrollbar-none">
        <div className="chart-grid">
          {/* 첫 번째 행 - 3개 열 (small) */}
          <div className="chart-row-small">
            <ChartCard title="CPU 사용률" icon={CpuIcon} size="small">
              <div className="flex-1 w-full h-full">
                <GaugeChart
                  value={chartData.cpuUsage}
                  max={100}
                  min={0}
                  color="#5B8FF9"
                />
              </div>
            </ChartCard>

            <ChartCard title="MEMORY 사용률" icon={MemoryIcon} size="small">
              <div className="flex-1 w-full h-full">
                <GaugeChart
                  value={chartData.memoryUsage}
                  max={100}
                  min={0}
                  color="#5AD8A6"
                />
              </div>
            </ChartCard>

            <ChartCard title="DISK 사용률" icon={DiskIcon} size="small">
              <div className="flex-1 w-full h-full">
                <GaugeChart
                  value={chartData.diskUsage}
                  max={100}
                  min={0}
                  color="#F6BD16"
                />
              </div>
            </ChartCard>
          </div>

          {/* 두 번째 행 - 2개 열 (medium) */}
          <div className="chart-row-medium">
            <ChartCard title="CPU 사용 모드별 분포" size="medium">
              <div className="flex-1 w-full h-full">
                <BarChart
                  xAxisData={chartData.barTimeLabels}
                  series={chartData.cpuModes}
                  yAxisUnit="%"
                />
              </div>
            </ChartCard>

            <ChartCard title="시스템 부하 (Load Average)" size="medium">
              <div className="flex-1 w-full h-full">
                <SmoothLineChart
                  xAxisData={chartData.timeLabels}
                  series={chartData.loadAverage}
                  yAxisUnit="%"
                />
              </div>
            </ChartCard>
          </div>

          {/* 세 번째 행 - 1개 열 (large) */}
          <div className="chart-row-large">
            <ChartCard title="메모리 & 스왑 사용률" size="large">
              <div className="flex-1 w-full h-full">
                <SmoothLineChart
                  xAxisData={chartData.timeLabels}
                  series={chartData.memorySwap}
                  yAxisUnit="%"
                />
              </div>
            </ChartCard>
          </div>

          {/* 네 번째 행 - 2개 열 (medium) */}
          <div className="chart-row-medium">
            <ChartCard title="네트워크 대역폭" size="medium">
              <div className="flex-1 w-full h-full">
                <AreaLineChart
                  xAxisData={chartData.timeLabels}
                  series={chartData.networkBandwidth}
                  yAxisUnit="Mbps"
                />
              </div>
            </ChartCard>

            <ChartCard title="네트워크 에러 & 드롭 패킷" size="medium">
              <div className="flex-1 w-full h-full">
                <SmoothLineChart
                  xAxisData={chartData.timeLabels}
                  series={chartData.networkErrors}
                  yAxisUnit="count/s"
                />
              </div>
            </ChartCard>
          </div>

          {/* 다섯 번째 행 - 2개 열 (medium) */}
          <div className="chart-row-medium">
            <ChartCard title="디스크 읽기/쓰기 속도" size="medium">
              <div className="flex-1 w-full h-full">
                <AreaLineChart
                  xAxisData={chartData.timeLabels}
                  series={chartData.diskIO}
                  yAxisUnit="MB/s"
                />
              </div>
            </ChartCard>

            <ChartCard title="디스크 IOPS" size="medium">
              <div className="flex-1 w-full h-full">
                <SmoothLineChart
                  xAxisData={chartData.timeLabels}
                  series={chartData.diskIOPS}
                  yAxisUnit="IOPS"
                />
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerDashboard;
