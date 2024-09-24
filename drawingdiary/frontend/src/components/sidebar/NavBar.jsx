import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSolidPhotoAlbum } from "react-icons/bi";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { LuCalendarDays } from "react-icons/lu";
import { SlGraph } from "react-icons/sl";
import { TbUserEdit } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../auth/AuthContext";
import { FaBarsStaggered } from "react-icons/fa6";

const SideBarStyle = styled.section`
  position: fixed;
  top: 0;
  left: ${(props) => (props.isOpen ? "0" : "-260px")}; /* 슬라이드 효과 */
  transition: left 0.3s ease-in-out; /* 부드러운 전환 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 260px;
  height: 100vh;
  background-color: #eeeeee;
  padding: 0 6px;
  z-index: 9999;
`;

const Overlay = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
`;

const HeaderSection = styled.div`
  margin-top: 45px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 165px;
`;

const MenuItem = styled(Link)`
  width: 248px;
  height: 55px;
  padding: 15px 0 16px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  &:hover {
    border-radius: 10px;
    background-color: rgba(227, 227, 227, 0.7);
  }
`;

const MenuItemText = styled.div`
  margin-left: 10px;
  color: #0d0d0d;
  font-size: 1rem;
`;

const RecentSection = styled.section`
  margin-top: 70px;
  width: 100%;
  height: 240px;
  display: flex;
  flex-direction: column;
`;

const RecentList = styled.div`
  display: flex;
  align-items: center;
  width: 248px;
  height: 48px;
  padding: 15px 0 16px 8px;
  font-size: 1rem;
  color: #0d0d0d;
  text-align: left;
  border: none;
  cursor: pointer;
  &:hover {
    border-radius: 10px;
    background-color: rgba(227, 227, 227, 0.7);
  }
`;

const ProfileSection = styled(Link)`
  width: 100%;
  height: 54px;
  margin: 50px 0 30px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  &:hover {
    border-radius: 10px;
    background-color: rgba(227, 227, 227, 0.7);
  }
`;

const ProfileImg = styled.img`
  width: 48px;
  height: 48px;
  margin-left: 8px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileName = styled.div`
  margin-left: 10px;
  font-size: 1rem;
  color: #0d0d0d;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 10px;
  left: 20px;
  z-index: 10000;
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Navbar = () => {
  const [loginState, setLoginState] = useState(false);
  const [currentList, setCurrentList] = useState(
    JSON.parse(localStorage.getItem("recentList")) || []
  );
  const [isOpen, setIsOpen] = useState(false); // 메뉴 열기/닫기 상태
  const navigate = useNavigate();

  const { memberID, logout, getToken } = useAuth();
  const accessToken = getToken();

  const setProfileImg = localStorage.getItem("setProfileImage");

  useEffect(() => {
    const fetchRecentData = async () => {
      const currentAccessToken = getToken();
      if (currentAccessToken) {
        setLoginState(true);
        try {
          const response = await axios.get(
            "http://drawingdiary.kro.kr/api/calender/recent-five",
            {
              headers: {
                Authorization: `Bearer ${currentAccessToken}`,
              },
            }
          );
          setCurrentList(response.data);
          localStorage.setItem("recentList", JSON.stringify(response.data));
        } catch (error) {
          console.log(error);
          setCurrentList([]);
        }
      } else {
        setLoginState(false);
      }
    };

    fetchRecentData();
  }, [accessToken, getToken]);

  const handleLogout = async () => {
    if (accessToken) {
      try {
        await axios.post("http://drawingdiary.kro.kr/api/logout", null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        logout();
        setLoginState(false);
        localStorage.removeItem("recentList");
        setCurrentList([]);
        alert("로그아웃 되었습니다!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const moveDiary = (data) => {
    const {
      text: diaryText,
      weather,
      albumName,
      imageURL: image,
      comment,
      styleName: style,
      sentiment,
      date,
    } = data;

    const dateElement = date.split("-");

    navigate(`/showDiary/${memberID}/${date}`, {
      state: {
        date: {
          currentYear: dateElement[0],
          month: dateElement[1],
          day: dateElement[2],
        },
        diaryData: {
          weather,
          albumName,
          diaryText,
          style,
          image,
          comment,
          sentiment,
        },
      },
    });

    window.location.replace(`/showDiary/${memberID}/${date}`);
  };

  return (
    <>
      {/* 메뉴를 열고 닫는 버튼 */}
      <ToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <div/> : <FaBarsStaggered />}
      </ToggleButton>

      {/* 메뉴가 열릴 때 배경을 클릭하여 메뉴를 닫을 수 있는 오버레이 */}
      <Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />

      <SideBarStyle isOpen={isOpen}>
        <HeaderSection>
          <MenuItem to="/">
            <LuCalendarDays
              size={20}
              color="#3d3d3d"
              alt="Album"
              style={{ margin: "1px 0" }}
            />
            <MenuItemText>캘린더</MenuItemText>
          </MenuItem>
          <MenuItem to="/album">
            <BiSolidPhotoAlbum
              size={20}
              color="#3d3d3d"
              alt="Album"
              style={{ margin: "1px 0" }}
            />
            <MenuItemText>앨범</MenuItemText>
          </MenuItem>
          <MenuItem to="/stats">
            <SlGraph
              size={20}
              color="#3d3d3d"
              alt="Statics"
              style={{ margin: "1px 0" }}
            />
            <MenuItemText>분석</MenuItemText>
          </MenuItem>
          {loginState ? (
            <MenuItem to="/login" onClick={handleLogout}>
              <IoMdLogOut
                size={20}
                color="#3d3d3d"
                alt="Logout"
                style={{ margin: "1px 0" }}
              />
              <MenuItemText>로그아웃</MenuItemText>
            </MenuItem>
          ) : (
            <MenuItem to="/login">
              <IoMdLogIn
                size={20}
                color="#3d3d3d"
                alt="Login"
                style={{ margin: "1px 0" }}
              />
              <MenuItemText>로그인</MenuItemText>
            </MenuItem>
          )}
        </HeaderSection>

        <RecentSection>
          {currentList.length > 0 ? (
            currentList.map((data, index) => (
              <RecentList key={index} onClick={() => moveDiary(data)}>
                {data.date}
              </RecentList>
            ))
          ) : (
            <RecentList>
              최근에 작성한 <br /> 일기가 없습니다.
            </RecentList>
          )}
        </RecentSection>

        <ProfileSection to="/my">
          {setProfileImg !== "null" && setProfileImg !== null ? (
            <ProfileImg src={setProfileImg} alt="profile" />
          ) : (
            <TbUserEdit size={30} color="#3d3d3d" alt="edit" />
          )}
          {loginState ? (
            <ProfileName style={{ fontSize: "0.9375rem" }}>
              {localStorage.getItem("setName")}
            </ProfileName>
          ) : (
            <ProfileName style={{ fontSize: "0.75rem" }}>
              {"로그인을 해주세요."}
            </ProfileName>
          )}
        </ProfileSection>
      </SideBarStyle>
    </>
  );
};

export default Navbar;
