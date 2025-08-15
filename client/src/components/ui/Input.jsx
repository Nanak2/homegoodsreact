// components/ui/CustomInput.jsx
import React from 'react';

const CustomInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = "text", 
  required = false,
  error,
  className = "",
  style = {},
  ...props 
}) => {
  const baseStyle = {
    padding: "0.75rem",
    fontSize: "0.85rem",
    borderLeft: "4px solid #ea580c",
    borderRadius: "4px",
    transition: "all 0.15s",
    outline: "none",
    width: "100%",
    ...style // Allow custom styles to override
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

  // Error styling
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
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-control h-25 custom-input ${className}`}
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
      
      <style jsx>{`
        .custom-input::placeholder {
          color: #9ca3af !important;
          opacity: 0.6 !important;
          font-style: italic !important;
        }
        .custom-input:focus::placeholder {
          opacity: 0.3 !important;
        }
      `}</style>
    </div>
  );
};

export default CustomInput;