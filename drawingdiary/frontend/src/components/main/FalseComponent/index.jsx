import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { format } from "date-fns";

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(224, 224, 224, 0.5);
  border-radius: 20px;
`;

const TopBox = styled.div`
  font-size: 20px;
  font-weight: 400;
  display: flex;
`;

const MiddleBox = styled.div`
  font-size: 20px;
  font-weight: 400;
  padding: 10px 0px;
  box-sizing: border-box;
`;

const AddBtn = styled.button`
  width: 120px;
  height: 50px;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  border-radius: 10px;
  margin-top: 20px;
  background-color: rgba(106, 156, 253, 0.5);
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
  }
`;

function FalseComponent({ currentYear, month, day, selectedDate }) {
  const navigate = useNavigate();
  const { memberID } = useAuth();

  const handleAdd = () => {
    const formattedDate = format(selectedDate, "yyyyMMdd");
    navigate(`/diary/${memberID}/${formattedDate}`, {
      state: { date: { currentYear, month, day } },
    });
  };

  return (
    <ResultBox>
      <TopBox>
        {month}월 {day}일
      </TopBox>
      <MiddleBox>일기를 작성하세요.</MiddleBox>
      <AddBtn onClick={handleAdd}>추가하기</AddBtn>
    </ResultBox>
  );
}

export default FalseComponent;
