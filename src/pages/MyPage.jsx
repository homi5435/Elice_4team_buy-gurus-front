const MyPage = () => {
  const token = localStorage.getItem("accessToken");

  fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/userMe`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("회원 정보:", data);
    })
    .catch((error) => {
      console.error("오류 발생:", error);
    });

  return <></>;
};

export default MyPage;
