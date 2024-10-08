import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        // const data = await response.json();
        console.log("로그인 성공:");
        // localStorage.setItem("accessToken", data.accessToken);
        window.location.href = "/home";
      } else {
        const errorData = await response.json();
        console.error("로그인 실패:", errorData);
        alert("로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div>
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">로그인</button>
        </form>
      </div>
      <a href="/signup">회원가입</a>
      <a
        href={`${
          import.meta.env.VITE_APP_BACKEND_URL
        }/oauth2/authorization/google`}
      >
        Google 로그인
      </a>
      <a
        href={`${
          import.meta.env.VITE_APP_BACKEND_URL
        }/oauth2/authorization/naver`}
      >
        Naver 로그인
      </a>
      <a
        href={`${
          import.meta.env.VITE_APP_BACKEND_URL
        }/oauth2/authorization/kakao`}
      >
        Kakao 로그인
      </a>
    </>
  );
}

export default Login;
