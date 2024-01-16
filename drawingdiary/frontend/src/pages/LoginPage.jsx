import styled from "styled-components";

import Background from "../components/Background";
import LoginBar from "../components/LoginBar";
import LoginBtn from "../components/LoginBtn";

import { IoMdPerson } from "react-icons/io";
import { FaLock } from "react-icons/fa";

const Body = styled.body`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Title = styled.p`
  font-size: 40px;
  font-weight: 800;
`;

const LoginBox = styled.form`
  display: flex;
  width: 800px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.1);
  box-shadow: 2px 5px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 70px 80px 40px 80px;
  box-sizing: border-box;
`;

const LeftBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 70%;
  height: 100%;
`;

const JoinBtn = styled.div`
  padding-left: 30px;
  color: #989898;
  opacity: 0.5;
  font-weight: 800;
  font-size: 16px;
`;

const RightBox = styled.div`
  width: 30%;
  height: 100%;
  padding: 50px 10px 100px 55px;
  box-sizing: border-box;
`;

const LoginLostBtn = styled.div`
  width: 800px;
  font-size: 20px;
  font-weight: 800;
  color: #090071;
  text-align: right;
`;

function LoginPage() {
  return (
    <Background>
      <Body>
        <Title>감성 일기</Title>
        <LoginBox>
          <LeftBox>
            <LoginBar icon={<IoMdPerson />} text="아이디"></LoginBar>
            <LoginBar icon={<FaLock />} text="비밀번호"></LoginBar>
            <JoinBtn>회원가입</JoinBtn>
          </LeftBox>
          <RightBox>
            <LoginBtn text="로그인" />
          </RightBox>
        </LoginBox>
        <LoginLostBtn>아이디·비밀번호를 잃어버리셨나요? </LoginLostBtn>
      </Body>
    </Background>
  );
}

export default LoginPage;
