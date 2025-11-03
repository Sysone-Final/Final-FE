export type CircleSize = "small" | "medium";
export type CircleGradient =
  | "blue"
  | "purple"
  | "orange"
  | "yellow"
  | "pink"
  | "green";

export interface CircleConfig {
  id: string;
  size: CircleSize;
  gradient: CircleGradient;
  position: string;
}
