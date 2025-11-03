import "../css/input.css";

interface InputProps {
  placeholder: string;
  type?: string;
  value: string;
  label: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

function Input({
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  id,
  label,
  error,
  disabled,
}: InputProps) {
  return (
    <div className="input-container">
      <label htmlFor={id} className="text-body-primary">
        {label}
      </label>
      <div className="input-wrapper">
        <div className="input-icon">{icon}</div>
        <input
          id={id}
          className="text-placeholder"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      {error && <div className="input-error">{error}</div>}
    </div>
  );
}

export default Input;
