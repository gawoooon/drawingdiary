import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { IoIosLock } from "react-icons/io";
import { MdEmail } from "react-icons/md";

const Body = styled.body`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const LoginBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1000px;
  height: 600px;
  padding: 100px 130px;
  box-sizing: border-box;
`;

const ClickButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  padding: 50px 80px;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Icon = styled.div`
  padding-bottom: 40px;
  box-sizing: border-box;
`;

const Content = styled.div`
  font-size: 24px;
  color: #878787;
  font-weight: bold;
  padding-top: 10px;
  ${ClickButton}:hover & {
    color: white; /* 버튼에 hover 했을 때 텍스트 색상 변경 */
  }
`;

function LoginLostPage() {
  const navigate = useNavigate();

  const handlePassword = () => {
    // 로그인 로직을 처리한 후 '/calendar' 페이지로 이동
    navigate("/password");
  };

  const handleEmail = () => {
    // 로그인 로직을 처리한 후 '/calendar' 페이지로 이동
    navigate("/email");
  };

  return (
    <Body>
      <LoginBox>
        <ClickButton onClick={handleEmail}>
          <Icon>
            <MdEmail size={52} />
          </Icon>
          <Content>아이디</Content>
          <Content>찾기</Content>
        </ClickButton>
        <ClickButton onClick={handlePassword}>
          <Icon>
            <IoIosLock size={52} />
          </Icon>
          <Content>비밀번호</Content>
          <Content>찾기</Content>
        </ClickButton>
      </LoginBox>
    </Body>
  );
}

export default LoginLostPage;
