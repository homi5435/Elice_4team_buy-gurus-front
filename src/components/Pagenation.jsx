import { useState, useEffect } from "react";

import "./pagenation.styles.css";

const Pagenation = ({ totalPage, changeHandler }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    changeHandler(page);
    setCurrentPage(page);
  }

  const renderPagination = (totalPage) => {
    const pages = [];
    
    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      } 
    } else {
      pages.push(
        <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
      );
      if (currentPage > 4) {
        pages.push(
          <li key="dots1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }

      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPage - 1, currentPage + 2); i++) {
        pages.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(i)} >
              {i}
            </button>
          </li>
        )
      }

      if (currentPage < totalPage - 3) {
        pages.push(
          <li key="dots2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      pages.push(
        <li key={totalPage} className={`page-item ${currentPage === totalPage ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPage)}>
            {totalPage}
          </button>
        </li>
      );
    }
    return pages;
  }

  return(
    <nav>
      <ul className="pagination justify-content-center">
        <li key="to-first" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>&lt;&lt;</button>
        </li>
        {renderPagination(totalPage)}
        <li key = "to-last" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(totalPage)}>&gt;&gt;</button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagenation;