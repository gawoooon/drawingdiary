import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import LoginBar from "../components/LoginBar/BasicBar";
import { MdEmail } from "react-icons/md";

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
  height: 430px;
  border-radius: 30px;
  padding: 20px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
`;

const InnerBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 400px;
  height: 250px;
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: 800;
  padding: 20px 0;
`;

const Content = styled.p`
  font-size: 16px;
  padding: 10px 0;
  text-align: center;
`;

const EmailSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 380px;
  height: 48px;
  margin-top: 20px;
  border: none;
  outline: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: rgba(106, 156, 253, 0.5);
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
  }
`;

const MessageContainer = styled.div`
  width: 100%;
  height: 30px;
  margin: 10px 0;
  min-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Message = styled.div`
  width: 100%;
  font-size: 14px;
  color: ${(props) => props.color};
`;

function PasswordLostPage() {
  const [email, setEmail] = useState("");
  const [verifyMessage, setVerifyMessage] = useState(null);

  const handlePost = async (event) => {
    event.preventDefault();
    
    if(email !== "") {
      try {
        axios.post(
          "http://drawingdiary.kro.kr/api/member/resetpassword", { 
            email: email 
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setVerifyMessage(true);
      } catch (error) {
        console.log("error: ", error);
        setVerifyMessage(false);
      }
    } else {
      alert("이메일을 입력해주세요!");
    }

  };

  return (
    <Body>
      <LoginBody>
        <Title>비밀번호 찾기</Title>
        <Content>
          가입한 이메일을 입력해 주세요.<br/>
          이메일을 통해 비밀번호 변경 링크가 전송됩니다
        </Content>
        <InnerBox>
          <EmailSection>
            <LoginBar
              icon={<MdEmail />}
              text="이메일"
              onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={handlePost}>전송</Button>
          </EmailSection>
          <MessageContainer>
            {verifyMessage === true && (
              <Message color="green">임시 비밀번호를 전송하였습니다.</Message>
            )}
            {verifyMessage === false && (
              <Message color="red">이메일이 일치하지 않습니다.</Message>
            )}
          </MessageContainer>
        </InnerBox>
      </LoginBody>
    </Body>
  );
}

export default PasswordLostPage;
