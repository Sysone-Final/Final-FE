import ServerDashboardHeader from "./ServerDashboardHeader";
import GaugeChart from "./GaugeChart";
import BarChart from "./BarChart";
import CpuIcon from "../assets/cpu.svg";
import MemoryIcon from "../assets/memory.svg";
import DiskIcon from "../assets/disk.svg";
import SmoothLineChart from "./SmoothLineChart";
import AreaLineChart from "./AreaLineChart";

interface ServerDashboardProps {
  deviceId: number;
  deviceName: string;
  onClose: () => void;
  isOpen: boolean;
}

function ServerDashboard({
  deviceName,
  isOpen,
  onClose,
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

  const timeLabels = generateTimeLabels();
  const barTimeLabels = generateTimeLabels(12);

  return (
    <div
      className={`
        absolute top-0 right-0
        h-full w-full
        rounded-xl flex flex-col overflow-hidden
        bg-[#404452]/70 backdrop-blur-md border border-slate-300/40
        transition-transform duration-300 ease-out
        px-4 py-3
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <ServerDashboardHeader deviceName={deviceName} onClose={onClose} />
      {/* 컨텐츠 */}
      <div
        className="flex-1 overflow-y-auto scrollbar-hide mt-3"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>

        <div className="flex flex-col gap-3">
          {/* 첫 번째 행 - 3개 열 */}
          <div className="flex gap-3 h-70">
            {/* CPU */}
            <div className="flex-1 bg-[#2A2D34] rounded-lg relative">
              <div className="flex items-center m-3 gap-2">
                <img src={CpuIcon} alt="CPU" className="w-4 h-4" />
                <span className="text-white text-sm font-semibold">
                  CPU 사용률 %
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center w-full h-full">
                <GaugeChart value={75} max={100} min={0} color="#58D9F9" />
              </div>
            </div>

            {/* MEMORY */}
            <div className="flex-1 bg-[#2A2D34] rounded-lg relative">
              <div className="flex items-center m-3 gap-2">
                <img src={MemoryIcon} alt="MEMORY" className="w-4 h-4" />
                <span className="text-white text-sm font-semibold">
                  MEMORY 사용률 %
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center w-full h-full">
                <GaugeChart value={60} max={100} min={0} color="#4ADE80" />
              </div>
            </div>

            {/* DISK */}
            <div className="flex-1 bg-[#2A2D34] rounded-lg relative">
              <div className="flex items-center m-3 gap-2">
                <img src={DiskIcon} alt="DISK" className="w-4 h-4" />
                <span className="text-white text-sm font-semibold">
                  DISK 사용률 %
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center w-full h-full">
                <GaugeChart value={20} max={100} min={0} color="#A78BFA" />
              </div>
            </div>
          </div>

          {/* 두 번째 행 - 2개 열 */}
          <div className="flex gap-3 h-80">
            <div className="flex-1 bg-[#2A2D34] rounded-lg flex flex-col">
              <div className="flex items-center m-3">
                <span className="text-white text-sm font-semibold">
                  CPU 사용 모드별 분포
                </span>
              </div>
              <div className="flex-1 m-3">
                <BarChart
                  xAxisData={barTimeLabels}
                  series={[
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
                  ]}
                  yAxisUnit="%"
                  height="100%"
                />
              </div>
            </div>
            <div className="flex-1 bg-[#2A2D34] rounded-lg flex flex-col">
              <div className="flex items-center m-3">
                <span className="text-white text-sm font-semibold">
                  시스템 부하 (Load Average)
                </span>
              </div>
              <div className="flex-1 m-3">
                <SmoothLineChart
                  xAxisData={timeLabels}
                  series={[
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
                  ]}
                  yAxisUnit="%"
                  height="100%"
                />
              </div>
            </div>
          </div>

          {/* 세 번째 행 */}
          <div className="flex gap-3 h-80">
            {/* 메모리 스왑 사용률 */}
            <div className="flex-1 bg-[#2A2D34] rounded-lg flex flex-col">
              <div className="flex items-center m-3">
                <span className="text-white text-sm font-semibold">
                  메모리 & 스왑 사용률
                </span>
              </div>
              <div className="flex-1 m-3">
                <SmoothLineChart
                  xAxisData={timeLabels}
                  series={[
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
                      lineType: "dashed",
                    },
                  ]}
                  yAxisUnit="%"
                  height="100%"
                />
              </div>
            </div>
          </div>

          {/* 네 번째 행 - 2개 열 */}
          <div className="flex gap-3 h-80">
            <div className="flex-1 bg-[#2A2D34] rounded-lg flex flex-col">
              <div className="flex items-center m-3">
                <span className="text-white text-sm font-semibold">
                  네트워크 대역폭
                </span>
              </div>
              <div className="flex-1 m-3">
                <AreaLineChart
                  xAxisData={timeLabels}
                  series={[
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
                  ]}
                  yAxisUnit="Mbps"
                  height="100%"
                />
              </div>
            </div>

            <div className="flex-1 bg-[#2A2D34] rounded-lg flex flex-col">
              <div className="flex items-center m-3">
                <span className="text-white text-sm font-semibold">
                  네트워크 에러 & 드롭 패킷
                </span>
              </div>
              <div className="flex-1 m-3">
                <SmoothLineChart
                  xAxisData={timeLabels}
                  series={[
                    {
                      name: "수신 에러",
                      data: generateRandomData(0.3, 0.3),
                      color: "#EF4444",
                      lineType: "solid",
                    },
                    {
                      name: "송신 에러",
                      data: generateRandomData(0.2, 0.2),
                      color: "#F59E0B",
                      lineType: "solid",
                    },
                    {
                      name: "수신 드롭",
                      data: generateRandomData(0.6, 0.4),
                      color: "#A78BFA",
                      lineType: "dashed",
                    },
                    {
                      name: "송신 드롭",
                      data: generateRandomData(0.5, 0.3),
                      color: "#EC4899",
                      lineType: "dashed",
                    },
                  ]}
                  yAxisUnit="count/s"
                  height="100%"
                />
              </div>
            </div>
          </div>

          {/* 다섯 번째 행 - 2개 열 */}
          <div className="flex gap-3 h-80">
            <div className="flex-1 bg-[#2A2D34] rounded-lg flex flex-col">
              <div className="flex items-center m-3">
                <span className="text-white text-sm font-semibold">
                  디스크 읽기/쓰기 속도
                </span>
              </div>
              <div className="flex-1 m-3">
                <AreaLineChart
                  xAxisData={timeLabels}
                  series={[
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
                  ]}
                  yAxisUnit="MB/s"
                  height="100%"
                />
              </div>
            </div>

            <div className="flex-1 bg-[#2A2D34] rounded-lg flex flex-col">
              <div className="flex items-center m-3">
                <span className="text-white text-sm font-semibold">
                  디스크 IOPS
                </span>
              </div>
              <div className="flex-1 m-3">
                <SmoothLineChart
                  xAxisData={timeLabels}
                  series={[
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
                  ]}
                  yAxisUnit="IOPS"
                  height="100%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerDashboard;
