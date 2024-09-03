import React from "react";
import styled from "styled-components";
import { MdOutlineThunderstorm } from "react-icons/md";
import { BsCloudDrizzle, BsClouds } from "react-icons/bs";
import { IoRainyOutline, IoSunnyOutline } from "react-icons/io5";
import { FaSnowman } from "react-icons/fa";
import { RiMistLine } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";

const WeatherContainer = styled.div`
  width: 200px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WeatherContent = styled.div`
  display: flex;
  align-items: center;
`;

const DateText = styled.text`
  font-size: 20px;
  font-weight: bold;
`;

const ShowWeather = ({ date, weatherState }) => {
  const formatDate = (date) => {
    const newDate = new Date(date.currentYear, date.month - 1, date.day);
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const months = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    const dayOfWeek = days[newDate.getDay()];
    return `${months[newDate.getMonth()]} ${newDate.getDate()}일 ${dayOfWeek}`;
  };

  return (
    <WeatherContainer>
      <WeatherContent>
        <>
          {weatherState === "thunderstorm" && (
            <MdOutlineThunderstorm
              size={24}
              color="3d3d3d"
              style={{ margin: "0 3px 3px 0" }}
            />
          )}
          {weatherState === "drizzle" && (
            <BsCloudDrizzle
              size={24}
              color="3d3d3d"
              style={{ margin: "0 3px 3px 0" }}
            />
          )}
          {weatherState === "showerrain" && (
            <IoRainyOutline
              size={24}
              color="3d3d3d"
              style={{ margin: "0 3px 3px 0" }}
            />
          )}
          {weatherState === "snow" && (
            <FaSnowman
              size={24}
              color="3d3d3d"
              style={{ margin: "0 3px 3px 0" }}
            />
          )}
          {weatherState === "mist" && (
            <RiMistLine
              size={24}
              color="3d3d3d"
              style={{ margin: "0 3px 3px 0" }}
            />
          )}
          {weatherState === "clearsky" && (
            <IoSunnyOutline
              size={24}
              color="3d3d3d"
              style={{ margin: "0 3px 3px 0" }}
            />
          )}
          {weatherState === "fewclouds" && (
            <TiWeatherPartlySunny
              size={24}
              color="3d3d3d"
              style={{ margin: "0 3px 3px 0" }}
            />
          )}
          {(weatherState === "clouds" ||
            weatherState === "scatteredclouds") && (
            <BsClouds
              size={24}
              color="3d3d3d"
              style={{ margin: "0 3px 3px 0" }}
            />
          )}
        </>
      </WeatherContent>
      <DateText>{date ? formatDate(date) : "날짜 정보 없음"}</DateText>
    </WeatherContainer>
  );
};

export default ShowWeather;
