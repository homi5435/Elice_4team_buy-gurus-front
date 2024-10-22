import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/userMe");
        setUserInfo(response.data);
      } catch (error) {
        console.error("사용자 정보를 가져오는 데 오류가 발생했습니다:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return userInfo;
};

export default useUserInfo;
