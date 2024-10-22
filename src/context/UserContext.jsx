import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 초기 유저 정보는 null
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/userMe"); // 유저 정보 요청
                setUser(response.data.data); // 사용자 정보 설정
            } catch (error) {
                console.error("유저 정보 가져오기 실패:", error);
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        fetchUser();
    }, []); // 컴포넌트가 마운트될 때만 호출

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};