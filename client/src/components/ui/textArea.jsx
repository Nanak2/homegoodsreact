// components/ui/CustomTextarea.jsx
import React from 'react';

const CustomTextarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  rows = 3,
  error,
  className = "",
  style = {},
  ...props 
}) => {
  const baseStyle = {
    padding: "0.75rem",
    fontSize: "0.85rem",
    borderLeft: "4px solid #ea580c",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    transition: "all 0.15s",
    outline: "none",
    width: "100%",
    resize: "vertical",
    ...style
  };

  const handleFocus = (e) => {
    e.target.style.borderLeft = "4px solid #ea580c";
    e.target.style.borderColor = "#ea580c";
    e.target.style.boxShadow = "0 0 0 0.1rem rgba(234, 88, 12, 0.25)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#ced4da";
    e.target.style.borderLeft = "4px solid #ea580c";
    e.target.style.boxShadow = "none";
  };

  const errorStyle = error ? {
    borderColor: '#dc3545',
    borderLeft: '4px solid #dc3545'
  } : {};

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-bold mb-0" style={{ fontWeight: "350" }}>
          {label} {required && '*'}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`form-control custom-input ${className}`}
        style={{
          ...baseStyle,
          ...errorStyle
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <small style={{ color: '#dc3545', fontSize: '0.8rem' }}>
          {error}
        </small>
      )}
    </div>
  );
};

export default CustomTextarea;