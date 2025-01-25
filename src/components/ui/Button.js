import React from "react";

const Button = ({ onClick, disabled, className, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
