import "./ToggleSwitch.css";

interface ToggleSwitchProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label?: string;
  readonly disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, label, disabled }: ToggleSwitchProps) {
  return (
    <label className={`toggle-switch ${disabled ? "toggle-disabled" : ""}`}>
      {label && <span className="toggle-label">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-slider" />
    </label>
  );
}
