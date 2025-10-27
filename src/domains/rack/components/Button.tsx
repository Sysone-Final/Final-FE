interface ViewToggleButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}
function Button({ label, onClick, active = false }: ViewToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 
        rounded-lg
        border
        transition-all duration-200
        text-xs font-medium
        ${
          active
            ? "bg-blue-600 border-blue-500 text-white"
            : "bg-slate-800/90 backdrop-blur-sm border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
        }
      `}
      title={label}
    >
      {label}
    </button>
  );
}

export default Button;
