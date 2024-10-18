import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '/public/Logo.PNG';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    // 로그인 조회
    useEffect(() => {
        axios.get('/api/userMe', {   
            withCredentials: true
        })
        .then(response => {
            console.log(response.data);
            setUserName(response.data.data.nickname);
            setIsLoggedIn(true);
        })
        .catch(error => console.log(error));
    }, []);

    // 로그아웃 핸들러
    const handleLogout = () => {
        axios.post('/api/logout', {}, {
            withCredentials: true
        })
        .then(response => {
            console.log(response.data);
            setIsLoggedIn(false);
            setUserName('');
        })
        .catch(error => console.log(error));
    };

    return (
        <div className="container">
            <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
                <Link to="/home" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                    <img src={logo} alt="Logo" width="100" height="100" className="me-2" />  {/* 이미지 추가 */}
                    <span className="fs-4">Buy-Gurus</span>
                </Link>

                <div className="d-flex flex-column align-items-start">
                    <ul className="nav nav-pills mb-2">
                        <li className="nav-item"><Link to="/home" className="nav-link active" aria-current="page">홈</Link></li>
                        <li className="nav-item"><Link to="/userMe" className="nav-link">마이페이지</Link></li>
                        <li className="nav-item"><Link to="/OrderItem" className="nav-link">장바구니</Link></li>
                        <li className="nav-item"><Link to="/order?type=c" className="nav-link">주문내역</Link></li>
                    </ul>
                    
                    {isLoggedIn ? (
                        <div className="d-flex align-items-center">
                            <span className="me-3">{userName}</span>
                            <button className="btn btn-danger" onClick={handleLogout}>로그아웃</button> {/* 로그아웃 버튼 추가 */}
                        </div>
                    ) : (
                        <div className="d-flex">
                        <ul className="nav nav-pills mb-2">
                            <li className="nav-item"><Link to="/login" className="nav-link active">로그인</Link></li>
                            <li className="nav-item"><Link to="/signup" className="nav-link">회원가입</Link></li>
                        </ul>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;