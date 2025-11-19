import ResetIcon from "../assets/reset.svg";
import CheckIcon from "../assets/check.svg";
import Button from "./Button";

interface ButtonPlaceholderProps {
  editMode: boolean;
  onReset: () => void;
  onSave: () => void;
  onToggleEdit: () => void;
}

function ButtonPlaceholder({
  editMode,
  onReset,
  onSave,
  onToggleEdit,
}: ButtonPlaceholderProps) {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <Button
        onClick={onReset}
        icon={ResetIcon}
        title="초기화"
        editMode={editMode}
      />

      <Button
        onClick={onSave}
        icon={CheckIcon}
        title="저장"
        editMode={editMode}
      />

      <div
        onClick={onToggleEdit}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ease-out ${
          editMode
            ? "bg-white/5 border border-slate-300/40"
            : "bg-[#2A2D34]/50 border border-slate-300/40"
        }`}
      >
        <span className="text-xs text-slate-200 font-medium">
          {editMode ? "편집중" : "편집"}
        </span>
      </div>
    </div>
  );
}

export default ButtonPlaceholder;
