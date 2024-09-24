import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import NavBar from "../components/sidebar/NavBar";
import Information from "../components/mypage/Information";
import Profile from "../components/mypage/Profile";
import Popup from "../components/mypage/Popup";
import PopupPassword from "../components/mypage/PopupPassword";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
`;

const SidebarContainer = styled.div`
  width: 260px;
  height: 100%;
  position: fixed;
`;

const MyPageBody = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function MyPage() {
  const [isPopupVisible, setPopupVisible] = useState(false); // 팝업 창의 가시성을 관리하는 상태
  const [isPopupPassword, setPopupPassword] = useState(false);

  const { memberID, getToken } = useAuth();
  const accessToken = getToken();
  const [profileImage, setProfileImage] = useState(null);
  const [profileEmail, setProfileEmail] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [profileBirth, setProfileBirth] = useState(null);
  const [profilePhone, setProfilePhone] = useState(null);

  // 팝업 창을 토글하는 함수
  const passwordPopup = () => {
    setPopupPassword(!isPopupPassword);
    setPopupVisible(false);
  };

  const PopupToggle = () => {
    setPopupVisible(!isPopupVisible);
    setPopupPassword(false);
  };

  const fetchUserName = useCallback(async () => {
    if (memberID) {
      try {
        const response = await axios.get(
          "http://drawingdiary.kro.kr/api/get-member",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setProfileName(response.data.name);
        setProfileEmail(response.data.email);
        setProfileBirth(response.data.birth);

        localStorage.setItem("setName", response.data.name);
        localStorage.setItem("setProfileImage", response.data.profileImage);

        console.log(accessToken);
        if (response.data.phoneNumber === null) {
          setProfilePhone("전화번호를 등록해주세요");
          console.log("전화번호를 등록해주세요");
        } else {
          setProfilePhone(response.data.phoneNumber);
        }

        // 프로필 이미지가 있는 경우에만 설정
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        console.log("사용자의 이름을 불러오는 중 에러 발생: ", error);
      }
    }
  }, [memberID]);

  useEffect(() => {
    fetchUserName();
  }, [memberID, fetchUserName]);

  return (
    <Body>
      <SidebarContainer>
        <NavBar />
      </SidebarContainer>
      <MyPageBody>
        <Profile
          profileImage={profileImage}
          profileEmail={profileEmail}
          profileName={profileName}
        />
        <Information
          onPopupPassword={passwordPopup}
          profileBirth={profileBirth}
          profileEmail={profileEmail}
          profileName={profileName}
          profilePhone={profilePhone}
        />
        {isPopupPassword && (
          <PopupPassword onClose={passwordPopup} onPopup={PopupToggle} />
        )}
        {isPopupVisible && (
          <Popup
            onClose={PopupToggle}
            profileImage={profileImage}
            profileName={profileName}
          />
        )}
      </MyPageBody>
    </Body>
  );
}

export default MyPage;
