interface ButtonProps {
  onClick: () => void;
  icon: string;
  title: string;
  editMode: boolean;
  disabled?: boolean;
}

function Button({ onClick, icon, title, editMode, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 bg-white/5 border border-slate-300/40 rounded-lg hover:bg-white/10 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-white/10 cursor-pointer"
      } ${editMode ? "animate-slideInRight" : "animate-slideOutRight"}`}
      style={{ display: editMode ? "block" : "none" }}
      title={title}
    >
      <img src={icon} alt={title} className="w-4 h-4" />
    </button>
  );
}

export default Button;
