import React, {useEffect} from "react";
import './Modal.css'; // 스타일을 추가할 CSS 파일

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      const modal = document.querySelector(".modal-content");

      // 이 부분을 어떻게든 해결해야하는데...
      // if (e.target === document.querySelector("#root > div > div:nth-child(5) > button")) return;
      if (!modal.contains(e.target)) onClose();
    }
    isOpen ? document.addEventListener('click', handleClickOutside) : document.removeEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen])

  if (!isOpen) return null;

  return (
    <div id="modal" className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;