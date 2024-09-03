import React from "react";
import styled from "styled-components";

const TrueComponentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: inherit;
  height: inherit;
  padding: 10px;
  box-sizing: border-box;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: inherit;
  height: 5%;
`;

const DateBox = styled.div`
  font-size: 18px;
  font-weight: 400;
`;

const Button = styled.button`
  width: 54px;
  height: 38px;
  outline: none;
  border: none;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
    border: none;
  }
`;

const TrueComponentMidBox = styled.div`
  width: 100%;
  height: 85%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageBox = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 20px;
`;

const BottomBox = styled.div`
  width: 95%;
  height: 15%;
  border: none;
  padding: 8px;
  margin-top: 20px;
`;

function TrueComponent({ month, day, imageUrl, text, handleEdit, handleRemove }) {
  return (
    <TrueComponentBox>
      <TopBox>
        <Button onClick={handleRemove}>삭제</Button>
        <DateBox>
          {month}월 {day}일
        </DateBox>
        <Button onClick={handleEdit}>수정</Button>
      </TopBox>
      <TrueComponentMidBox>
        <ImageBox src={imageUrl} />
      </TrueComponentMidBox>
      <BottomBox>{text}</BottomBox>
    </TrueComponentBox>
  );
}

export default TrueComponent;
