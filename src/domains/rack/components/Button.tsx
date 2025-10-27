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
            ? "bg-slate-500 border-slate-400 text-white"
            : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-500 hover:text-white"
        }
      `}
      title={label}
    >
      {label}
    </button>
  );
}

export default Button;
