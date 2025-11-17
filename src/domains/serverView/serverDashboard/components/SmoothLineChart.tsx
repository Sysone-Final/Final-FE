import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

interface SeriesData {
  name: string;
  data: number[];
  color: string;
  smooth?: boolean;
  showAverage?: boolean;
  lineType?: "solid" | "dashed" | "dotted";
}

interface SmoothLineChartProps {
  xAxisData: string[];
  series: SeriesData[];
  yAxisUnit?: string;
  height?: string;
}

interface TooltipParams {
  axisValue: string;
  marker: string;
  seriesName: string;
  value: number | string;
}

function SmoothLineChart({
  xAxisData,
  series,
  yAxisUnit = "",
  height = "100%",
}: SmoothLineChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const option = {
    backgroundColor: "transparent",
    textStyle: {
      color: "#999",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(50, 50, 50, 0.9)",
      borderColor: "#777",
      textStyle: {
        color: "#fff",
      },
      formatter: (params: TooltipParams[]) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((item: TooltipParams) => {
          const value =
            typeof item.value === "number" ? item.value.toFixed(2) : item.value;
          result += `${item.marker} ${item.seriesName}: ${value}${yAxisUnit}<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: series.map((s) => s.name),
      textStyle: {
        color: "#fff",
      },
      bottom: "3%",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "25%",
      top: "5%",
      containLabel: false,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLabel: {
        color: "#fff",
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
    },
    yAxis: {
      type: "value",
      scale: true,
      name: yAxisUnit,
      nameLocation: "middle",
      nameRotate: 90,
      nameTextStyle: {
        color: "#fff",
        fontSize: 12,
      },
      axisLabel: {
        color: "#fff",
      },
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#333",
        },
      },
    },
    series: series.map((s) => ({
      name: s.name,
      type: "line",
      data: s.data,
      smooth: s.smooth !== undefined ? s.smooth : true,
      itemStyle: {
        color: s.color,
      },
      lineStyle: {
        color: s.color,
        width: 2,
        type: s.lineType || "solid",
      },
      symbol: "circle",
      symbolSize: 6,
      markLine: s.showAverage
        ? {
            silent: true,
            lineStyle: {
              color: s.color,
              type: "dashed",
              width: 1,
            },
            label: {
              color: "#fff",
              fontSize: 12,
            },
            data: [
              {
                type: "average",
                name: "평균",
              },
            ],
          }
        : undefined,
    })),
  };

  if (!mounted) return null;

  return (
    <ReactECharts
      option={option}
      style={{ height, width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}

export default SmoothLineChart;
