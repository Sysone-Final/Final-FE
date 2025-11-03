interface ButtonProps {
  text: string;
  onClick: () => void;
}

function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="btn-create flex py-4 px-2.5 justify-center items-center gap-2.5 self-stretch"
    >
      {text}
    </button>
  );
}

export default Button;
