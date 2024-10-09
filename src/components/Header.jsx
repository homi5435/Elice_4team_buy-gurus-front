const Header = () => {
    return (
        <div className="container">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <a href="./home" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <svg className="bi me-2" width="40" height="32">
            <use xlinkHref="#bootstrap"/>
            </svg>
            <span className="fs-4">Buy-Gurus</span>
          </a>
    
          <ul className="nav nav-pills">
            <li className="nav-item"><a href="./home" class="nav-link active" aria-current="page">홈</a></li>
            <li className="nav-item"><a href="./mypage" class="nav-link">마이페이지</a></li>
            <li className="nav-item"><a href="./OrderItem" class="nav-link">장바구니</a></li>
            <li className="nav-item"><a href="./OrderDetail" class="nav-link">주문내역</a></li>
          </ul>
        </header>
      </div>
    )
}

export default Header