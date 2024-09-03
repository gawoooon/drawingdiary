import React from "react";
import { RiImageAddLine } from "react-icons/ri";
import Lottie from "react-lottie";
import styled from "styled-components";
import imageLodding from "../../animation/imageLodding.json";

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: none;
`;

const ImageBox = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const ShowGeneratedImage = ({ isLoading, newImageUrl }) => {
  const LoddingOptions = {
    loop: true, // 애니메이션 반복
    autoplay: true, // 페이지 로딩 후 바로 재생
    animationData: imageLodding,
  };

  return (
    <ImageContainer>
      {isLoading ? (
        // 로딩 중일 때는 Lottie 애니메이션
        <Lottie
          isClickToPauseDisabled
          options={LoddingOptions}
          height={500}
          width={500}
        />
      ) : newImageUrl ? (
        // 로딩이 완료되고 이미지가 존재할 때 이미지 표시
        // 수정을 위해 200자 넘으면 base64로 미리보기
        newImageUrl.length > 200 ? (
          <ImageBox
            src={`data:image/png;base64,${newImageUrl}`}
            alt="Generated Image"
          />
        ) : (
          <ImageBox src={newImageUrl} alt="Generated Image" />
        )
      ) : (
        // 이미지가 존재하지 않을 때 다른 컴포넌트 표시
        <RiImageAddLine size="100" color="#a5bdff" />
      )}
    </ImageContainer>
  );
};

export default ShowGeneratedImage;
