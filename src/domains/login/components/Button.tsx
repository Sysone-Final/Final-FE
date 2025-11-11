interface ButtonProps {
  text: string;

  disabled?: boolean;
}

function Button({ text, disabled }: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn-create flex py-4 px-2.5 justify-center items-center gap-2.5 self-stretch"
    >
      {text}
    </button>
  );
}

export default Button;
