import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import LoginBar from "../components/LoginBar/BasicBar";

import { IoMdPerson } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const Title = styled(Link)`
  font-size: 40px;
  font-weight: 800;
  padding: 20px 0;
  text-decoration: none;
`;

const LoginBox = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 700px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  box-sizing: border-box;
`;

const InnerBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: 250px;
`;

const LoginLostBtnBox = styled.div`
  width: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 10px;
`;

const LoginLostBtn = styled(Link)`
  width: 100px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  color: #828282;
  &:hover {
    color: rgba(106, 156, 253, 0.5)
  }
`;

const ErrorMessageContainer = styled.div`
  margin: 0 0 3px 20px;
  min-height: 20px;
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: gray;
`;

const MoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 48px;
  margin: 5px 0;
  background-color: rgba(106, 156, 253, 0.5);
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
  }
`;

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  localStorage.setItem("selectedColor", 0);

  const handleLogin = async (e) => {
    e.preventDefault();

    // 입력값 검증
    const specialCharacters = /['";\\<>\[\]\{\}\|\&=]/;
    if (specialCharacters.test(email) || specialCharacters.test(password)) {
      setErrorMessage("특수문자는 사용할 수 없습니다.");
      return;
    }

    axios
      .post("http://localhost:8080/api/login", {
        email,
        password,
      })
      .then((response) => {
        login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.memberID
        );
        navigate("/");
      })
      .catch((error) => {
        console.log("에러 status: ", error.code);
        if (error.response && error.response.status === 500) {
          console.log("로그인 실패: 잘못된 자격증명입니다.");
        } else if (error.response && error.response.status === 403) {
          setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
          console.log("Error: ", error.response.data.message);
        } else {
          console.log("Error: ", error);
        }
      });
  };

  return (
    <Body>
      <LoginBox onSubmit={handleLogin}>
        <Title to="/">감성 일기</Title>
        <InnerBox>
          <LoginBar
            icon={<IoMdPerson size={18} color="#3d3d3d" />}
            text="아이디"
            onChange={(e) => setEmail(e.target.value)}
          ></LoginBar>
          <LoginBar
            icon={<FaLock size={16} color="#3d3d3d" />}
            text="비밀번호"
            type="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></LoginBar>
          <ErrorMessageContainer>
            {errorMessage && <ErrorMessage> {errorMessage} </ErrorMessage>}
          </ErrorMessageContainer>
          <MoveButton type="submit">로그인</MoveButton>
        </InnerBox>
        <LoginLostBtnBox>
          <LoginLostBtn to="/email">아이디 찾기</LoginLostBtn>
          <LoginLostBtn to="/password">비밀번호 찾기</LoginLostBtn>
          <LoginLostBtn to="/join">회원가입</LoginLostBtn>
        </LoginLostBtnBox>
      </LoginBox>
    </Body>
  );
}

export default LoginPage;