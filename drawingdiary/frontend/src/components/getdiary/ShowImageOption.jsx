import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Lottie from "react-lottie";
import imageLoading from "../../animation/imageLodding.json";
import ImageStyleLists from "../styleList/ImageStyleLists";
import { useAuth } from "../../auth/AuthContext";
import Slider from "react-slick";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Container = styled.div`
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  .slick-slider {
    width: 450px;
    box-sizing: border-box;
    height: 26px;
  }
  .slick-prev,
  .slick-next {
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    cursor: pointer;
    font-size: 24px;
  }
  .slick-slide {
    padding: 0 5px;
    box-sizing: border-box;
  }
`;

const SlideItem = styled.div`
  box-sizing: border-box;
  border: 0.5px solid #000000;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  border-radius: 20px;
  padding: 4px 0;
  background-color: ${({ isSelected }) => (isSelected ? "#eeeeee" : "#fff")};
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
  &:hover {
    background-color: #eeeeee;
  }
`;

const DescriptionBox = styled.div`
  width: 400px;
  height: 20px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
`;

const ShowImageOption = ({
  onOptionSelect,
  isRecommenderLoading,
  selectedOption,
  parentSelectedButtonStyle,
}) => {
  const LoadingOptions = {
    loop: true,
    autoplay: true,
    animationData: imageLoading,
  };

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [countDiary, setCountDiary] = useState(0);
  const [selectedButtonStyle, setSelectedButtonStyle] = useState(null);
  const [storedSelectedStyle, setStoredSelectedStyle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAge, setUserAge] = useState(0);
  const [userGender, setUserGender] = useState("");
  const [recommendedStyles, setRecommendedStyles] = useState([]);
  const [otherStyles, setOtherStyles] = useState([]);
  const [description, setDescription] = useState("스타일을 눌러 설정해보세요!"); // 설명 기본 값

  const { getToken } = useAuth();
  const accessToken = getToken();

  const handleButtonStyleSelect = (option) => {
    setSelectedButtonStyle(option);
    setStoredSelectedStyle(option);
    onOptionSelect(option);
    setSelectedIndex(option);
    const selectedStyle = ImageStyleLists.find(
      (style) => style.styleName === option
    );
    setDescription(selectedStyle ? selectedStyle.description : "설명을 찾을 수 없습니다."); // 설명 업데이트
  };

  useEffect(() => {
    if (selectedButtonStyle !== null) {
      setStoredSelectedStyle(selectedButtonStyle);
    }
  }, [selectedButtonStyle]);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 설명 설정
    if (parentSelectedButtonStyle) {
      const initialStyle = ImageStyleLists.find(
        (style) => style.styleName === parentSelectedButtonStyle
      );
      setDescription(initialStyle ? initialStyle.description : "설명을 찾을 수 없습니다.");
    }
  }, [parentSelectedButtonStyle]); // parentSelectedButtonStyle이 변경될 때마다 실행

  const CountDiary = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/statistic", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCountDiary(response.data.lawn.total);
    } catch (error) {
      console.log("error");
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/get-member", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const birthYear = parseInt(response.data.birth.split("-")[0]);
      const currentYear = new Date().getFullYear();
      setUserAge(currentYear - birthYear);
      setUserGender(response.data.gender);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const fetchOptionStyle = async () => {
    try {
      const fallbackResponse = await axios.post(
        "http://localhost:8080/api/style",
        { age: userAge, gender: userGender },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsLoading(!isRecommenderLoading);
      const updateRecommendedStyles =
        fallbackResponse.data.predicted_styles.map((styleName) => {
          const trimmedStyleName = styleName.trim();
          return ImageStyleLists.find(
            (style) => style.styleName === trimmedStyleName
          );
        }).filter((style) => style !== undefined);

      setRecommendedStyles(updateRecommendedStyles);
      setIsLoading(false);
    } catch (error) {
      const styleResponse = await axios.get(
        "http://localhost:8080/api/test/style",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsLoading(!isRecommenderLoading);
      const updateRecommendedStyles = styleResponse.data.predicted_styles.map(
        (styleName) => {
          const trimmedStyleName = styleName.trim();
          return ImageStyleLists.find(
            (style) => style.styleName === trimmedStyleName
          );
        }).filter((style) => style !== undefined);
      setRecommendedStyles(updateRecommendedStyles);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    CountDiary();
    if (userAge !== 0 || userGender !== "") {
      fetchOptionStyle();
    } else {
      fetchUserInfo();
    }
  }, [userAge, userGender, countDiary]);

  useEffect(() => {
    const filterNonDuplicateStyles = ImageStyleLists.filter(
      (style) => !recommendedStyles.map((rStyle) => rStyle.styleName).includes(style.styleName)
    );
    setOtherStyles(filterNonDuplicateStyles);
  }, [recommendedStyles]);

  const items = [...recommendedStyles, ...otherStyles];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <MdNavigateNext />,
    prevArrow: <MdNavigateBefore />,
    beforeChange: (_, next) => {
      const prevButton = document.querySelector(".slick-prev");
      const nextButton = document.querySelector(".slick-next");

      if (next === 0) {
        prevButton.style.display = "none";
      } else {
        prevButton.style.display = "flex";
      }

      if (next >= items.length - 5) {
        nextButton.style.display = "none";
      } else {
        nextButton.style.display = "flex";
      }
    },
  };

  useEffect(() => {
    const prevButton = document.querySelector(".slick-prev");
    const nextButton = document.querySelector(".slick-next");

    if (prevButton) prevButton.style.display = "none";
    if (nextButton && items.length === 5) nextButton.style.display = "none";
  }, [items.length]);

  return (
    <Container>
      {isLoading ? (
        <Lottie
          isClickToPauseDisabled={true}
          options={LoadingOptions}
          height={100}
          width={100}
        />
      ) : (
        <>
          <Slider {...settings}>
            {items.map((item, index) => (
              <div key={index}>
                <SlideItem
                  isSelected={
                    selectedIndex === null
                      ? parentSelectedButtonStyle === item.styleName
                      : selectedIndex === item.styleName
                  }
                  onClick={() => handleButtonStyleSelect(item.styleName)}
                >
                  {item.styleName}
                </SlideItem>
              </div>
            ))}
          </Slider>
          <DescriptionBox>{description}</DescriptionBox>
        </>
      )}
    </Container>
  );
};

export default ShowImageOption;
