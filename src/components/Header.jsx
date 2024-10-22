import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/interceptors";
import logo from "/public/Logo.PNG";
import { useUserContext } from "../context/UserContext";

const Header = () => {
  const nav = useNavigate();
  const { setUser } = useUserContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  const ADMIN = "ADMIN";

  // 로그인 조회
  useEffect(() => {
    axios
      .get("/api/userMe")
      .then((response) => {
        setUser(response.data.data);
        setUserName(response.data.data.nickname);
        setRole(response.data.data.role);
        setIsLoggedIn(true);
      })
      .catch((error) => console.log(error));
  }, [setUser]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    axios
      .post(
        "/api/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        setIsLoggedIn(false);
        setUserName("");
        setRole("");
        setUser(null);
        nav(0);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center py-3 mb-4 border-bottom">
        <Link
          to="/home"
          className="d-flex align-items-center text-dark text-decoration-none"
        >
          <img
            src={logo}
            alt="Logo"
            width="100"
            height="100"
            className="me-2"
          />
          <span className="fs-4">Buy-Gurus</span>
        </Link>

        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <div className="d-flex align-items-center">
              <ul className="nav nav-pills me-3">
                <li className="nav-item">
                  <Link to="/userMe" className="nav-link active">
                    마이페이지
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/OrderItem" className="nav-link">
                    장바구니
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/order?type=c" className="nav-link">
                    주문내역
                  </Link>
                </li>
                {role === ADMIN && (
                  <li className="nav-item">
                    <Link to="/order?type=s" className="nav-link">
                      판매내역
                    </Link>
                  </li>
                )}
              </ul>
              <span className="me-3">{userName}</span>
              <button className="btn btn-danger" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <ul className="nav nav-pills">
              <li className="nav-item">
                <Link to="/login" className="nav-link active">
                  로그인
                </Link>
              </li>
            </ul>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
