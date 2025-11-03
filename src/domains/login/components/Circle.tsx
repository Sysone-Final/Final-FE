import type { CircleSize, CircleGradient } from "../types/circle";
import "../css/circle.css";

interface CircleProps {
  gradient: CircleGradient;
  position: string;
  size: CircleSize;
}

const sizes: Record<CircleSize, string> = {
  small: "15vw",
  medium: "20vw",
};

const gradients: Record<CircleGradient, string> = {
  blue: "linear-gradient(to right, #06b6d4, #14b8a6)",
  purple: "linear-gradient(to right, #4F39F6, #9810FA)",
  orange: "linear-gradient(to right, #f97316, #ec4899)",
  yellow: "linear-gradient(to right, #eab308, #f97316)",
  pink: "linear-gradient(to right, #ec4899, #a855f7)",
  green: "linear-gradient(to right, #10b981, #06b6d4)",
};

const Circle = ({ size, gradient, position }: CircleProps) => {
  return (
    <div
      className={`absolute rounded-full ${position} animate-twinkle-slow`}
      style={{
        width: sizes[size],
        height: sizes[size],
        background: gradients[gradient],
      }}
    />
  );
};

export default Circle;
