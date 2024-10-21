import React from "react";
import { FaShoppingBag } from "react-icons/fa"; // react-icons 사용

const Header2 = ({ leftchild, rightchild }) => {
  return (
    <header className="d-flex justify-content-between align-items-center py-3 mb-4 border-bottom">
      <div className="header_left d-flex justify-content-start align-items-center">
        {leftchild}
      </div>

      <div className="header_center mx-auto text-center">
        <a
          href="./home"
          className="text-decoration-none d-flex flex-column align-items-center"
        >
          <div className="d-flex align-items-center">
            <span className="fs-1 fw-bold" style={{ color: "#e74c3c" }}>
              Buy
            </span>
            <FaShoppingBag className="ms-2 me-2" size={40} color="#000" />
            <span className="fs-1 fw-bold" style={{ color: "#e74c3c" }}>
              Gurus
            </span>
          </div>
          <small className="text-muted" style={{ fontSize: "0.8rem" }}>
            DIGITALS
          </small>
        </a>
      </div>

      <div className="header_right d-flex justify-content-end align-items-center">
        {rightchild}
      </div>
    </header>
  );
};

export default Header2;
