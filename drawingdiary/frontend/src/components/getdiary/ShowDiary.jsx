import React, { useState } from "react";
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

const ShowDiary = ({ onDiaryTextChange, showText }) => {
  const [diaryText, setDiaryText] = useState(showText);

  const handleDiaryTextChange = (e) => {
    const newText = e.target.value;
    setDiaryText(newText);
    onDiaryTextChange(newText);
  };

  return (
    <WriteAreaBox>
      <WriteArea
        value={diaryText}
        placeholder="여기에 일기를 작성해주세요."
        onChange={(e) => {
          setDiaryText(e.target.value);
          handleDiaryTextChange(e);
        }}
      />
    </WriteAreaBox>
  );
};

export default ShowDiary;
