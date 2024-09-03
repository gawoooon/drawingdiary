import React from "react";
import Lottie from "react-lottie";
import styled from "styled-components";
import imageLodding from "../../animation/imageLodding.json";

const Container = styled.div`
  width: 100%;
  height: 100%;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 1.5;
  overflow: hidden;
`;

const Comment = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: 10px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 4px;
  }
`;

const AIComment = ({ text, isLoading }) => {
  const LoadingOptions = {
    loop: true,
    autoplay: true,
    animationData: imageLodding,
  };

  return (
    <Container>
      {isLoading ? (
        <Lottie
          isClickToPauseDisabled
          options={LoadingOptions}
          height={100}
          width={100}
        />
      ) : text ? (
        <Comment>{text}</Comment>
      ) : (
        <Comment></Comment>
      )}
    </Container>
  );
};

export default AIComment;
