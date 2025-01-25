import React from "react";

const Input = ({ placeholder, className, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded px-3 py-2 w-full ${className}`}
    />
  );
};

export default Input;
