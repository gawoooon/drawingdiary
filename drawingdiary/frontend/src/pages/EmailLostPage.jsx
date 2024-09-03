import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginBar from "../components/LoginBar";
import LoginBtn from "../components/LoginBtn";

const Body = styled.body`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const LoginBody = styled.section`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 500px;
  border-radius: 30px;
  padding: 10px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
`;

const InnerBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: 200px;
`;

const Title = styled.div`
  font-size: 36px;
  font-weight: 800;
  padding: 10px 0;
`;

const Content = styled.p`
  font-size: 16px;
  padding: 10px 0;
  text-align: center;
`;

const PhoneSection = styled.section`
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const NumberSection = styled.section`
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const MessageContainer = styled.div`
  width: inherit;
  height: 20px;
  margin: 5px 0;
  min-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Message = styled.div`
  font-size: 14px;
  color: ${(props) => props.color};
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 48px;
  margin: 6px;
  background-color: rgba(106, 156, 253, 0.5);
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
  }
`;

function EmailLostPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyNumber, setVerifyNumber] = useState("");
  const [verifyMessage, setVerifyMessage] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(null);
  const [newEmail, setNewEmail] = useState("");

  const navigate = useNavigate();

  const goLogin = () => {
    navigate("/login");
  };

  const handlePhonePost = async (event) => {
    event.preventDefault();
    if (phoneNumber) {
      try {
        await axios.post(
          "http://localhost:8080/api/sms/codesending-existed",
          { phoneNumber },
          { headers: { "Content-Type": "application/json" } }
        );
        setVerifyMessage(true);
      } catch (error) {
        console.error("Error: ", error);
        setVerifyMessage(false);
      }
    } else {
      alert("핸드폰 번호를 입력해주세요!");
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (verifyNumber) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/sms/verify-existed",
          { phoneNumber, code: verifyNumber },
          { headers: { "Content-Type": "application/json" } }
        );
        setVerifyEmail(true);
        setNewEmail(response.data.email);
      } catch (error) {
        console.error("Error: ", error);
        setVerifyEmail(false);
      }
    } else {
      alert("인증번호를 입력해주세요!");
    }
  };

  return (
    <Body>
      <LoginBody>
        <Title>이메일 찾기</Title>
        <Content>
          계정에 등록된 휴대폰 번호를 인증하시면
          <br />
          사용 중인 계정의 이메일을 알려드립니다.
        </Content>
        <InnerBox>
          <PhoneSection>
            <LoginBar
              text="전화번호"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <LoginBtn text="전송" onClick={handlePhonePost} />
          </PhoneSection>
          <NumberSection>
            <LoginBar
              text="인증번호 입력"
              onChange={(e) => setVerifyNumber(e.target.value)}
            />
            <LoginBtn text="확인" onClick={handleVerify} />
          </NumberSection>
          <MessageContainer>
            {verifyEmail === true && (
              <Message color="#989898">
                회원님의 이메일은{" "}
                <span style={{ color: "green" }}>[ {newEmail} ]</span> 입니다.
              </Message>
            )}
            {verifyEmail === false && (
              <Message color="red">인증번호가 일치하지 않습니다.</Message>
            )}
          </MessageContainer>
        </InnerBox>
        <LoginButton onClick={goLogin}>로그인</LoginButton>
      </LoginBody>
    </Body>
  );
}

export default EmailLostPage;
