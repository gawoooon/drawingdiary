import axios from "axios";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../auth/AuthContext";

// 팝업창
const BackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1); /* 어두운 배경 색상 */
  z-index: 99; /* 모달보다 낮은 z-index를 설정하여 모달 위로 올라오도록 함 */
`;

const PopupBox = styled.div`
  width: 600px;
  height: 500px;
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 40px;
  box-sizing: border-box;
`;

// 팝업창 상단
const PopupTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 7%;
`;

const PopupTopText = styled.div`
  font-size: 20px;
`;

const PopupTopCloseBtn = styled.button`
  border: none;
  font-size: 20px;
  cursor: pointer;
  background-color: white;
`;

// 팝업창 하단 - 수정 버튼
const PopupBottom = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupBottomCheckBtn = styled.button`
  width: 420px;
  height: 48px;
  background-color: rgba(106, 156, 253, 0.5);
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
  }
`;

// 팝업창 중단
const PopupBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70%;
  box-sizing: border-box;
  padding: 10px 0;
`;

const PopupTitle = styled.div`
  font-size: 36px;
  font-weight: bold;
  padding-bottom: 10px;
`;

const PopupText = styled.div`
  font-size: 14px;
  padding-top: 5px;
`;

const PopupInput = styled.input`
  width: 420px;
  height: 48px;
  outline: none;
  font-size: 12px;
  border: 1px solid #828282;
  border-radius: 10px;
  padding-left: 10px;
  margin-top: 80px;
`;

function PopupPassword({ onClose, onPopup }) {
  const { getToken } = useAuth();
  const accessToken = getToken();
  const setName = localStorage.getItem("setName");
  const [oldPassword, setOldPassword] = useState("");

  const handleCheck = async () => {
    console.log(oldPassword);
    try {
      const response = await axios.post(
        "http://drawingdiary.kro.kr/api/password",
        {
          oldPassword: oldPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("response: ", response);
      alert("인증되었습니다!");
      onClose();
      onPopup();
    } catch (error) {
      alert("비밀번호가 일치하지 않습니다!");
    }
  };

  return (
    <>
      <BackgroundOverlay />
      <PopupBox>
        <PopupTop>
          <PopupTopText></PopupTopText>
          <PopupTopCloseBtn onClick={onClose}>X</PopupTopCloseBtn>
        </PopupTop>
        <PopupBody>
          <PopupTitle>비밀번호 확인</PopupTitle>
          <PopupText>{setName}님의 회원정보를 안전하게 보호하기 위해</PopupText>
          <PopupText>비밀번호를 한 번 더 확인해주세요.</PopupText>
          <PopupInput
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="비밀번호 확인"
          />
        </PopupBody>
        <PopupBottom>
          <PopupBottomCheckBtn onClick={handleCheck}>확인</PopupBottomCheckBtn>
        </PopupBottom>
      </PopupBox>
    </>
  );
}

export default PopupPassword;
