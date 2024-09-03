import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { isSameDay, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Calendar2 from "../components/Calendar2";
import FalseComponent from "../components/FalseComponent";
import TrueComponent from "../components/TrueComponent/TrueComponent";
import { useAuth } from "../auth/AuthContext";
import {
  CalendarProvider,
  useCalendar,
} from "../components/Calendar2/CalendarProvider";
import axios from "axios";
import Navbar from "../components/sidebar/NavBar";

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

const CalendarBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: calc(100% - 260px); 
  height: inherit;
  padding-left: 520px;
  box-sizing: border-box;
`;

const MiddleBox = styled.div`
  display: flex;
  width: 50%;
  height: 800px;
  border-radius: 30px;
  margin: 20px;
  box-sizing: border-box;
`;

const RightBox = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 800px;
  margin: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const ResultBox = styled.div`
  width: 100%;
  height: 100%;
`;

function CalendarPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateHasData, setSelectedDateHasData] = useState(false);

  const { memberID, getToken } = useAuth();
  const accessToken = getToken();

  const { year, setYear, month, setMonth } = useCalendar();
  const [data, setData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("");

  const [isSelectedYear, setIsSelectedYear] = useState("");
  const [isSelectedMonth, setIsSelectedMonth] = useState("");
  const [isSelectedDay, setIsSelectedDay] = useState("");

  const fetchUserName = useCallback(async () => {
    if (accessToken !== null) {
      try {
        const response = await axios.get("http://localhost:8080/api/get-member", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        localStorage.setItem("setName", response.data.name);
        localStorage.setItem("setEmail", response.data.email);
        localStorage.setItem("setBirth", response.data.birth);
        localStorage.setItem("setGender", response.data.gender);
        localStorage.setItem("selectedColor", response.data.theme);
        localStorage.setItem("setProfileImage", response.data.profileImage);
        
      } catch (error) {
        console.log("사용자의 이름을 불러오는 중 에러 발생: ", error);
      }
    }
  }, [accessToken]);

  useEffect(() => {
    fetchUserName();
  }, [fetchUserName]);

  const handleDateClick = async (day) => {
    setSelectedDate(day); // selectedDate 상태 업데이트
    setSelectedDateHasData(true); // selectedDate에 데이터가 존재하는지
  };

  const handleEdit = async () => {
    const currentYear = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const formattedDate = new Date(currentYear, month - 1, day);

    const pad = (number) => (number < 10 ? `0${number}` : number);
    const dateString = `${formattedDate.getFullYear()}-${pad(formattedDate.getMonth() + 1)}-${pad(formattedDate.getDate())}`;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/diary/${dateString}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const dataArray = response.data;

      const diaryText = dataArray.text;
      const weather = dataArray.weather;
      const albumName = dataArray.albumName;
      const image = dataArray.imageURL;
      const comment = dataArray.comment;
      const style = dataArray.styleName;
      const sentiment = dataArray.sentiment;

      navigate(`/showDiary/${memberID}/${dateString}`, {
        state: {
          date: { currentYear, month, day },
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
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleRemove = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/diary/${isSelectedYear}-${isSelectedMonth}-${isSelectedDay}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("일기가 정상적으로 삭제되었습니다!");
      window.location.replace('/');
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const fetchCalendar = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/calender/${year}-${month}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const fetchData = async (date) => {
    try {
      const index = data.findIndex((item) =>
        isSameDay(new Date(item.date), date)
      );

      if (index !== -1) {
        setText(data[index].text);
        setImageUrl(data[index].imageFile);
      }
      const hasData = index !== -1;
      return hasData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };

  useEffect(() => {
    if(accessToken === null) {
      localStorage.clear();
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedDate) {
      setYear(format(selectedDate, "yyyy"));
      setMonth(format(selectedDate, "MM"));
      fetchCalendar();
    } else {
      fetchCalendar();
    }

    const fetchDataAndUpdateState = async () => {
      if (selectedDate) {
        setIsSelectedYear(format(selectedDate, "yyyy"));
        setIsSelectedMonth(format(selectedDate, "MM"));
        setIsSelectedDay(format(selectedDate, "dd"));

        try {
          const hasData = await fetchData(selectedDate);
          setSelectedDateHasData(hasData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setSelectedDateHasData(false);
        }
      }
    };

    fetchDataAndUpdateState();
  }, [selectedDate]);

  return (
      <Body>
        <SidebarContainer>
          <Navbar />
        </SidebarContainer>
        <CalendarBox>
          <MiddleBox>
            <CalendarProvider>
              <Calendar2 onDateClick={handleDateClick} />
            </CalendarProvider>
          </MiddleBox>
          <RightBox>
            <ResultBox>
              {selectedDate &&
                (selectedDateHasData ? (
                  <TrueComponent
                    month={selectedDate.getMonth() + 1}
                    day={selectedDate.getDate()}
                    imageUrl={imageUrl}
                    text={text}
                    handleEdit={handleEdit}
                    handleRemove={handleRemove}
                  />
                ) : (
                  <FalseComponent
                    currentYear={selectedDate.getFullYear()}
                    month={selectedDate.getMonth() + 1}
                    day={selectedDate.getDate()}
                    selectedDate={selectedDate}
                  />
                ))}
            </ResultBox>
          </RightBox>
        </CalendarBox>
      </Body>
  );
}

export default CalendarPage;
