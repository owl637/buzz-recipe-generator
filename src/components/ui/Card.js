import React from "react";

const Card = ({ className, children }) => {
  return (
    <div className={`rounded shadow-md bg-white p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
