import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import NavBar from "../components/sidebar/NavBar";
import AlbumCategory from "../components/album/AlbumCategory";
import Sentiment from "../components/sentiment/Sentiment";
import ShowWeather from "../components/weather/ShowWeather";
import ShowDiary from "../components/getdiary/ShowDiary";
import ShowImageOption from "../components/getdiary/ShowImageOption";
import ShowAIComment from "../components/getdiary/ShowAIComment";
import ShowGeneratedImage from "../components/getdiary/ShowGeneratedImage";
import { useAuth } from "../auth/AuthContext";
import { GrUploadOption } from "react-icons/gr";
import { IoMdRefresh } from "react-icons/io";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const DiaryContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%; /* 중앙 정렬을 위해 너비를 설정 */
  max-width: 1480px; /* 최대 너비를 설정하여 페이지 중앙에 정렬 */
  padding: 2% 10%;
  box-sizing: border-box;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const MidContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 480px; /* 높이 설정 */
  margin-bottom: 20px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LeftBox = styled.div`
  display: flex;
  width: 48%;
  height: 100%;
`;

const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 48%;
  height: 100%;
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #b4cdfe;
  border-radius: 10px;
`;

const SentimentBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 49%;
  background-color: #d2e2fe;
  border-radius: 10px;
`;

const CommentBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 49%;
  background-color: #e1ebff;
  border-radius: 10px;
  padding: 1% 3%;
  box-sizing: border-box;
`;

const StyleBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  border: 1px solid black;
  padding: 10px;
  box-sizing: border-box;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;

const BtnHover = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  cursor: pointer;
  border-radius: 50px;
  &:hover {
    background-color: #b7b7b7;
  }
`;

function ShowDiaryPage() {
  const { getToken } = useAuth();
  const accessToken = getToken();

  const navigate = useNavigate();
  const location = useLocation();
  const { diaryData, date } = location.state || {};

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(diaryData.image);
  const [diaryText, setDiaryText] = useState(diaryData.diaryText);
  const [parentSelectedButtonStyle, setParentSelectedButtonStyle] = useState(diaryData.style);
  const [weatherState, setWeatherState] = useState(diaryData.weather);
  const [selectedAlbumID, setSelectedAlbumID] = useState(null);
  const [positiveValue, setPositiveValue] = useState(diaryData.sentiment.positive);
  const [negativeValue, setNegativeValue] = useState(diaryData.sentiment.negative);
  const [neutralValue, setNeutralValue] = useState(diaryData.sentiment.neutral);
  const [commentText, setCommentText] = useState(diaryData.comment);
  const [createBtn, setCreateBtn] = useState(false);

  const handleSelectedAlbumChange = (onSelectAlbum) => {
    setSelectedAlbumID(onSelectAlbum);
  };

  const analyzeSentiment = async () => {
    try {
      const response = await axios.post("/api/sentiment", { content: diaryText });
      const { positive, negative, neutral } = response.data.document.confidence;
      setPositiveValue(Math.round(positive * 100) / 100);
      setNegativeValue(Math.round(negative * 100) / 100);
      setNeutralValue(Math.round(neutral * 100) / 100);
      return response.data.document.sentiment;
    } catch (error) {
      console.error("감정 분석 API 호출 중 오류 발생: ", error);
    }
  };

  const handleOptionSelect = (selectedButtonStyle) => {
    if (typeof selectedButtonStyle === "string") {
      setParentSelectedButtonStyle(selectedButtonStyle);
    }
  };

  const handleDiaryTextChange = (newText) => {
    setDiaryText(newText);
  };

  useEffect(() => {
    if (createBtn) {
      analyzeSentiment();
    }
  }, [createBtn]);

  const handleCreate = async () => {
    if (parentSelectedButtonStyle) {
      setCreateBtn(true);
      setIsImageLoading(true);
      setIsCommentLoading(true);
      try {
        const SentimentResult = await analyzeSentiment();
        const gender = localStorage.getItem("setGender");
        const userGender = gender === "M" ? "Male" : gender === "F" ? "Female" : "none";
        const resultDiaryText = `"${diaryText}", 이미지 스타일: ${parentSelectedButtonStyle},감정 : ${SentimentResult}, 주인공: ${userGender}`;

        if (diaryText) {
          const responseDiary = await fetch("http://127.0.0.1:5000/api/diary/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resultDiaryText }),
          });

          if (responseDiary.ok) {
            const responseDate = await responseDiary.json();
            setNewImageUrl(responseDate.image?.imageUrl);
            setIsImageLoading(false);
          } else {
            console.error("이미지 저장 실패:", responseDiary.status);
            alert("이미지 저장에 실패하였습니다.");
          }

          const responseComment = await fetch("http://127.0.0.1:5000/api/diary/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ diaryText }),
          });

          if (responseComment.ok) {
            const comment = await responseComment.json();
            setCommentText(comment.comment);
            setIsCommentLoading(false);
          } else {
            console.error("코멘트 불러오기 실패: ", responseComment);
          }
        } else {
          alert("일기를 먼저 작성해주세요!");
        }
      } catch (error) {
        console.error("Error diary:", error);
        alert("일기 중에 오류가 발생하였습니다.");
      }
    } else {
      alert("이미지 스타일 먼저 생성해주세요!");
    }
  };

  const handleSave = async () => {
    const formattedDate = new Date(date.currentYear, date.month - 1, date.day);
    const pad = (number) => (number < 10 ? `0${number}` : number);
    const dateString = `${formattedDate.getFullYear()}-${pad(formattedDate.getMonth() + 1)}-${pad(formattedDate.getDate())}`;

    if (newImageUrl) {
      try {
        const responseDiary = await axios.put(
          `http://localhost:8080/api/diary/${dateString}`,
          {
            text: diaryText,
            weather: weatherState,
            date: dateString,
            albumID: selectedAlbumID,
            styleName: parentSelectedButtonStyle,
            imageFile: newImageUrl,
            confidence: { positive: positiveValue, negative: negativeValue, neutral: neutralValue },
            comment: commentText,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (responseDiary.status === 200) {
          alert("일기가 생성되었어요!");
          navigate("/");
        } else {
          console.error("일기 전송 실패:", responseDiary.status);
        }
      } catch (error) {
        console.log("error : ", error);
      }
    } else {
      alert("이미지를 먼저 생성해주세요!");
    }
  };

  return (
    <Container>
      <NavBar />
      <DiaryContainer>
        <TopContainer>
          <ShowWeather date={date} weatherState={weatherState} />
          <AlbumCategory onSelectAlbum={handleSelectedAlbumChange} />
        </TopContainer>
        <MidContainer>
          <LeftBox>
            <ImageBox>
              <ShowGeneratedImage isLoading={isImageLoading} newImageUrl={newImageUrl} />
            </ImageBox>
          </LeftBox>
          <RightBox>
            <SentimentBox>
              <Sentiment positiveValue={positiveValue} negativeValue={negativeValue} neutralValue={neutralValue} />
            </SentimentBox>
            <CommentBox>
              <ShowAIComment text={commentText} isLoading={isCommentLoading} />
            </CommentBox>
          </RightBox>
        </MidContainer>
        <BottomContainer>
          <StyleBox>
            <ShowImageOption onOptionSelect={handleOptionSelect} selectedOption={diaryData.style} parentSelectedButtonStyle={parentSelectedButtonStyle} />
          </StyleBox>
          <TextBox>
            <ShowDiary onDiaryTextChange={handleDiaryTextChange} showText={diaryText} />
            <BtnBox>
              <BtnHover onClick={handleCreate}>
                <IoMdRefresh size={16} />
              </BtnHover>
              <BtnHover onClick={handleSave}>
                <GrUploadOption size={16} />
              </BtnHover>
            </BtnBox>
          </TextBox>
        </BottomContainer>
      </DiaryContainer>
    </Container>
  );
}

export default ShowDiaryPage;
