import type { FormSelectProps, FormInputProps } from "@/types/forms";

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  hint,
  placeholder = 'Choose...',
  error,
  colClass = 'col-12 col-md-6 col-lg-6'
}) => (
  <div className={colClass}>
    <label className="form-label small fw-semibold text-muted mb-1">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <select
      className={`form-select w-100  border ${error ? 'is-invalid' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <div className="invalid-feedback d-block">{error}</div>}
    {hint && <small className="text-muted d-block mt-1">{hint}</small>}
  </div>
);

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  colClass = 'col-12 col-md-6 col-lg-6',
  error
}) => (
  <div className={colClass}>
    <label className="form-label small fw-semibold text-muted mb-1">{label}</label>
    <input
      type={type}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {error && <div className="invalid-feedback d-block">{error}</div>}
  </div>
);
