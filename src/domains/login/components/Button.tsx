interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ text, onClick, disabled }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-create flex py-4 px-2.5 justify-center items-center gap-2.5 self-stretch"
    >
      {text}
    </button>
  );
}

export default Button;
