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

interface ServerDashboardProps {
  deviceId: number;
  deviceName: string;
  onClose: () => void;
  isOpen: boolean;
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
}: ServerDashboardProps) {
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
          color: "#7E84E8",
        },
      ],

      loadAverage: [
        {
          name: "1분 평균",
          data: generateRandomData(2.0, 1.0, 31),
          color: "#EF4444",
        },
        {
          name: "5분 평균",
          data: generateRandomData(1.7, 0.8, 31),
          color: "#F59E0B",
        },
        {
          name: "15분 평균",
          data: generateRandomData(1.2, 0.5, 31),
          color: "#10B981",
        },
      ],

      memorySwap: [
        {
          name: "메모리",
          data: generateRandomData(60, 20),
          color: "#58D9F9",
          showAverage: true,
        },
        {
          name: "스왑",
          data: generateRandomData(30, 15),
          color: "#4ADE80",
          showAverage: true,
          lineType: "dashed" as const,
        },
      ],

      networkBandwidth: [
        {
          name: "수신 (RX)",
          data: generateRandomData(50, 30),
          color: "#3B82F6",
        },
        {
          name: "송신 (TX)",
          data: generateRandomData(30, 20),
          color: "#EF4444",
        },
      ],

      networkErrors: [
        {
          name: "수신 에러",
          data: generateRandomData(0.3, 0.3),
          color: "#EF4444",
          lineType: "solid" as const,
        },
        {
          name: "송신 에러",
          data: generateRandomData(0.2, 0.2),
          color: "#F59E0B",
          lineType: "solid" as const,
        },
        {
          name: "수신 드롭",
          data: generateRandomData(0.6, 0.4),
          color: "#A78BFA",
          lineType: "dashed" as const,
        },
        {
          name: "송신 드롭",
          data: generateRandomData(0.5, 0.3),
          color: "#EC4899",
          lineType: "dashed" as const,
        },
      ],

      diskIO: [
        {
          name: "읽기",
          data: generateRandomData(50, 30),
          color: "#3B82F6",
        },
        {
          name: "쓰기",
          data: generateRandomData(70, 40),
          color: "#EF4444",
        },
      ],

      diskIOPS: [
        {
          name: "읽기 IOPS",
          data: generateRandomData(1000, 400),
          color: "#10B981",
        },
        {
          name: "쓰기 IOPS",
          data: generateRandomData(700, 300),
          color: "#F59E0B",
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

      <div className="dashboard-content scrollbar-none">
        <div className="chart-grid">
          {/* 첫 번째 행 - 3개 열 (small) */}
          <div className="chart-row-small">
            <ChartCard title="CPU 사용률" icon={CpuIcon} size="small">
              <div className="gauge-container">
                <GaugeChart
                  value={chartData.cpuUsage}
                  max={100}
                  min={0}
                  color="#58D9F9"
                />
              </div>
            </ChartCard>

            <ChartCard title="MEMORY 사용률" icon={MemoryIcon} size="small">
              <div className="gauge-container">
                <GaugeChart
                  value={chartData.memoryUsage}
                  max={100}
                  min={0}
                  color="#4ADE80"
                />
              </div>
            </ChartCard>

            <ChartCard title="DISK 사용률" icon={DiskIcon} size="small">
              <div className="gauge-container">
                <GaugeChart
                  value={chartData.diskUsage}
                  max={100}
                  min={0}
                  color="#A78BFA"
                />
              </div>
            </ChartCard>
          </div>

          {/* 두 번째 행 - 2개 열 (medium) */}
          <div className="chart-row-medium">
            <ChartCard title="CPU 사용 모드별 분포" size="medium">
              <BarChart
                xAxisData={chartData.barTimeLabels}
                series={chartData.cpuModes}
                yAxisUnit="%"
              />
            </ChartCard>

            <ChartCard title="시스템 부하 (Load Average)" size="medium">
              <SmoothLineChart
                xAxisData={chartData.timeLabels}
                series={chartData.loadAverage}
                yAxisUnit="%"
              />
            </ChartCard>
          </div>

          {/* 세 번째 행 - 1개 열 (large) */}
          <div className="chart-row-large">
            <ChartCard title="메모리 & 스왑 사용률" size="large">
              <SmoothLineChart
                xAxisData={chartData.timeLabels}
                series={chartData.memorySwap}
                yAxisUnit="%"
              />
            </ChartCard>
          </div>

          {/* 네 번째 행 - 2개 열 (medium) */}
          <div className="chart-row-medium">
            <ChartCard title="네트워크 대역폭" size="medium">
              <AreaLineChart
                xAxisData={chartData.timeLabels}
                series={chartData.networkBandwidth}
                yAxisUnit="Mbps"
              />
            </ChartCard>

            <ChartCard title="네트워크 에러 & 드롭 패킷" size="medium">
              <SmoothLineChart
                xAxisData={chartData.timeLabels}
                series={chartData.networkErrors}
                yAxisUnit="count/s"
              />
            </ChartCard>
          </div>

          {/* 다섯 번째 행 - 2개 열 (medium) */}
          <div className="chart-row-medium">
            <ChartCard title="디스크 읽기/쓰기 속도" size="medium">
              <AreaLineChart
                xAxisData={chartData.timeLabels}
                series={chartData.diskIO}
                yAxisUnit="MB/s"
              />
            </ChartCard>

            <ChartCard title="디스크 IOPS" size="medium">
              <SmoothLineChart
                xAxisData={chartData.timeLabels}
                series={chartData.diskIOPS}
                yAxisUnit="IOPS"
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerDashboard;
