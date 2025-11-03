import Circle from "./Circle";
import type { CircleConfig } from "../types/circle";

const CIRCLE_CONFIGS: CircleConfig[] = [
  { id: "1", size: "small", gradient: "blue", position: "top-1/3 left-1/12" },
  {
    id: "2",
    size: "small",
    gradient: "purple",
    position: "bottom-1/4 left-1/12",
  },
  { id: "3", size: "medium", gradient: "pink", position: "top-1/4 left-1/3" },
  {
    id: "4",
    size: "medium",
    gradient: "orange",
    position: "top-1/2 left-1/3",
  },
  { id: "5", size: "small", gradient: "blue", position: "top-1/2 right-1/4" },
  {
    id: "6",
    size: "small",
    gradient: "purple",
    position: "top-1/2 right-1/7",
  },
  {
    id: "7",
    size: "small",
    gradient: "pink",
    position: "top-1/6 right-1/12",
  },
];

function AnimationBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {CIRCLE_CONFIGS.map((config) => (
        <Circle
          key={config.id}
          size={config.size}
          gradient={config.gradient}
          position={config.position}
        />
      ))}
    </div>
  );
}

export default AnimationBackground;
