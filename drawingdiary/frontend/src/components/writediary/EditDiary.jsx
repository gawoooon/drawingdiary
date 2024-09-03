import React, { useEffect, useState } from "react";
import styled from "styled-components";

const WriteAreaBox = styled.div`
  width: 100%;
  height: 80%;
`;

const WriteArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  font-size: 16px;
  font-weight: 400;
  outline: none;
  resize: none;
`;

const EditDiary = ({ onDiaryTextChange }) => {
  const [basicText, setBasicText] = useState("");
  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");
  const [weather, setWeather] = useState("");

  const updateDiaryText = () => {
    const details = [];
    if (location) details.push(`location: ${location}`);
    if (season) details.push(`season: ${season}`);
    if (weather) details.push(`weather: ${weather}`);

    const formattedText = `${basicText}${
      details.length > 0 ? ", " + details.join(", ") : ""
    }`;
    onDiaryTextChange(formattedText);
  };

  useEffect(() => {
    updateDiaryText();
  }, [location, season, weather]);

  const handleDiaryTextChange = (e) => {
    setBasicText(e.target.value);
  };


  return (
    <WriteAreaBox>
      <WriteArea
        value={basicText}
        placeholder="30자 이상 작성해주세요."
        onChange={handleDiaryTextChange}
        onBlur={updateDiaryText}
      />
    </WriteAreaBox>
  );
};

export default EditDiary;
