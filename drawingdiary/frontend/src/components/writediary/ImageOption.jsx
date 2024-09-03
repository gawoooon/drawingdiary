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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  .slick-slider {
    width: 450px;
    box-sizing: border-box;
  }
  .slick-prev,
  .slick-next {
    display: ${(props) => (props.show ? "block" : "none")};
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
  height: 80px;
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

const ImageOption = ({ onOptionSelect, isRecommenderLoading }) => {
  const LoadingOptions = {
    loop: true,
    autoplay: true,
    animationData: imageLoading,
  };
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedButtonStyle, setSelectedButtonStyle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAge, setUserAge] = useState(0);
  const [userGender, setUserGender] = useState("");
  const [recommendedStyles, setRecommendedStyles] = useState([]);
  const [otherStyles, setOtherStyles] = useState([]);
  const [description, setDescription] = useState("스타일을 눌러 설정해보세요!"); 

  const { getToken } = useAuth();
  const accessToken = getToken();

  const handleButtonStyleSelect = (option) => {
    setSelectedButtonStyle(option);
    onOptionSelect(true, option);
    setSelectedIndex(option.styleName);
    setDescription(option.description);
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
      console.error("Error fetching user info: ", error);
    }
  };

  const fetchOptionStyle = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/style",
        { age: userAge, gender: userGender },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setIsLoading(!isRecommenderLoading);

      const updateRecommendedStyles = response.data.predicted_styles.map(
        (styleName) => {
          return ImageStyleLists.find(
            (style) => style.styleName.trim() === styleName.trim()
          );
        }
      );

      setRecommendedStyles(updateRecommendedStyles);
    } catch (error) {
      console.error("Error fetching style options: ", error);
    }
  };

  useEffect(() => {
    if (userAge !== 0 || userGender !== "") {
      fetchOptionStyle();
    } else {
      fetchUserInfo();
    }
  }, [userAge, userGender]);

  useEffect(() => {
    onOptionSelect(selectedButtonStyle !== null);

    const filterNonDuplicateStyles = ImageStyleLists.filter(
      (style) =>
        !recommendedStyles.map((rStyle) => rStyle.styleName).includes(
          style.styleName
        )
    );
    setOtherStyles(filterNonDuplicateStyles);
  }, [selectedButtonStyle, onOptionSelect, recommendedStyles]);

  const items = [...recommendedStyles, ...otherStyles];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <MdNavigateNext />,
    prevArrow: <MdNavigateBefore />,
  };

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
            {items.map((item) => (
              <div key={item.styleName}>
                <SlideItem
                  isSelected={selectedIndex === item.styleName}
                  onClick={() => handleButtonStyleSelect(item)}
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

export default ImageOption;
