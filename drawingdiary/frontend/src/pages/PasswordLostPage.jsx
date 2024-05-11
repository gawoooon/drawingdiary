import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Background from "../components/Background";
import LoginBar from "../components/LoginBar";
import LoginBtn from "../components/LoginBtn";

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 1000px;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.1);
  box-shadow: 3px 5px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 100px 80px;
  box-sizing: border-box;
`;

const Title = styled.p`
  font-size: 40px;
  font-weight: 800;
  padding-bottom: 20px;
`;

const Content = styled.p`
  font-size: 20px;
  font-weight: 800;
  padding-top: 1px;
  color: #989898;
`;

const PasswdBox = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  height: 70px;
  padding-top: 70px;
`;

const LeftBox = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
  padding-right: 30px;
`;

const RightBox = styled.div`
  display: flex;
  width: 20%;
  height: 100%;
`;

const LoginBtn2 = styled(Link)`
  font-size: 30px;
  font-weight: 800;
  padding-top: 70px;
  color: #616161;
  text-decoration: none;
`;

const MessageContainer = styled.div`
  width: 100%;
  margin: 0 0 3px 20px;
  min-height: 20px;
  padding: 10px 0px 0px 250px;
`;

const Message = styled.p`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => props.color};
`;

function PasswordLostPage() {
  const accessToken = localStorage.getItem("accessToken");
  const [email, setEmail] = useState("");
  const [verifyMessage, setVerifyMessage] = useState(null);

  const handlePost = async (event) => {
    event.preventDefault();
    console.log(email);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/member/resetpassword",
        { email: email },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("response", response);
      setVerifyMessage(true);
    } catch (error) {
      console.log("error: ", error);
      setVerifyMessage(false);
    }
  };

  if (verifyMessage) {
    setTimeout(() => {
      setVerifyMessage("");
    }, 2000);
  }

  return (
    <Background>
      <Body>
        <LoginBox>
          <Title>암호 재설정</Title>
          <Content>
            계속하려면 계정에서 사용하는 이메일주소를 입력하세요.
          </Content>
          <Content>
            전송 버튼을 누르면 헤당 이메일로 임시 비밀번호가 전송됩니다.
          </Content>
          <PasswdBox>
            <LeftBox>
              <LoginBar
                icon={<MdEmail />}
                text="이메일"
                onChange={(e) => setEmail(e.target.value)}
              ></LoginBar>
            </LeftBox>
            <RightBox>
              <LoginBtn text="전송" onClick={handlePost} />
            </RightBox>
          </PasswdBox>

          <MessageContainer>
            {verifyMessage === true && (
              <Message color="green">이메일 인증되었습니다</Message>
            )}
            {verifyMessage === false && (
              <Message color="red">인증되지 않았습니다</Message>
            )}
          </MessageContainer>

          <LoginBtn2 to="/login">로그인</LoginBtn2>
        </LoginBox>
      </Body>
    </Background>
  );
}

export default PasswordLostPage;
