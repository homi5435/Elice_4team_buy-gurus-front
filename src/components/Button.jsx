import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button className="btn btn-danger" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
