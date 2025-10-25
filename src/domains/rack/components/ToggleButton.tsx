import type { ViewMode } from "../types";
interface ViewToggleButtonProps {
  viewMode: ViewMode;
  onToggle: () => void;
}
function ToggleButton({ viewMode, onToggle }: ViewToggleButtonProps) {
  const label = viewMode === "front" ? "뒷면보기" : "앞면보기";

  return (
    <button
      onClick={onToggle}
      className="
        absolute top-4 right-4 z-10
        bg-gray-900/80 backdrop-blur-sm
        border border-gray-700
        px-3 py-2 rounded-lg
        flex items-center gap-2
        transition-all duration-300
        hover:bg-gray-800/95 hover:border-gray-600
        hover:-translate-y-0.5
        active:translate-y-0
        shadow-lg
      "
      title={label}
    >
      <span className="text-sm font-regular text-gray-300 transition-colors hover:text-white">
        {label}
      </span>
    </button>
  );
}

export default ToggleButton;
