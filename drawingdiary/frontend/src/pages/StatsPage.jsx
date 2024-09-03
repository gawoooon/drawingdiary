import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavBar from "../components/sidebar/NavBar";
import GrassGraph from "../components/grid/DaySquare";
import { format } from 'date-fns';
import { LineChart, Line, Tooltip } from "recharts";
import { useAuth } from "../auth/AuthContext";

const Body = styled.body`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
`;

const SidebarContainer = styled.div`
    width: 260px;
    height: 100%;
    position: fixed;
`;

const RightSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% - 260px); 
  height: inherit;
  padding-left: 520px;
  box-sizing: border-box;
`;

const MainContent = styled.section`
  width: 100%;
  height: 870px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
`;

const Text = styled.span`
  margin: 10px;
  font-size: 16px;
  font-weight: 500;
`;

const BigText = styled.span`
  margin: 10px;
  font-size: 20px;
  font-weight: 800;
`;

const HistoryContainer = styled.section`
  width: 100%;
  height: 202px;
  margin: 20px 10px;
`;

const StatsContainer = styled.section`
  width: 100%;
  height: 28%;
  margin: 20px 10px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StatsContent = styled.div`
  width: 200px;
  height: 80px;
  margin: 20px 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SentimentContainer = styled.section`
  width: 95%;
  height: 20%;
  margin: 20px;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Value = styled.div`
  display: flex;
  flex-direction: row;
  margin: 3px 0;
`;

const Circle = styled.div`
  width: 20px;
  height: 20px;
  margin: 10px 0 10px 10px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const TextValue = styled.div`
  margin: 10px 20px;
`;

function StatsPage() {
  const { getToken } = useAuth();
  const accessToken = getToken();

  const [totalDairy, setTotalDiary] = useState(0);
  const [sentiData, setSentiData] = useState([]);

  const date = new Date();
  const year = format(date, "yyyy");
  const month = format(date, "M");
  const startDay = format(date, "d");
  const endDay = parseInt(startDay) + 7;

  const [average, setAverage] = useState(0);
  const [monthData, setMonthData] = useState(0);
  const [style, setStyle] = useState("");

  const RenderLineChat = () => {
    return (
      <LineChart width={800} height={180} data={sentiData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="positive"
          stroke="#FF76CE"
          activeDot={{ r: 2 }}
          isAnimationActive={false}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="neutral"
          stroke="#b87ffa"
          activeDot={{ r: 2 }}
          isAnimationActive={false}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="negative"
          stroke="#A3D8FF"
          activeDot={{ r: 2 }}
          isAnimationActive={false}
          strokeWidth={2}
        />
      </LineChart>
    );
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/statistic", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTotalDiary(response.data.lawn.total);

      let index = 0;
      const dayOfWeek = ["월", "화", "수", "목", "금", "토", "일"];
      const sentimentData = response.data.emotions.map((item) => {
        if (item === null || item === "undefined") {
          return {
            name: dayOfWeek[index++],
            positive: 0,
            neutral: 0,
            negative: 0,
          };
        } else {
          return {
            name: dayOfWeek[index++],
            positive: item.positive,
            neutral: item.neutral,
            negative: item.negative,
          };
        }
      });
      setSentiData(sentimentData);

      setAverage(response.data.value.average);
      setMonthData(response.data.value.month);
      setStyle(response.data.value.style);
    } catch (error) {
      console.log(error);
    }
  };

  const GraphValue = () => {
    const getColor = (emotion) => {
      switch (emotion) {
        case "positive":
          return "#FF76CE";
        case "neutral":
          return "#b87ffa";
        case "negative":
          return "#A3D8FF";
        default:
          return "#ffffff";
      }
    };

    const emotions = ["positive", "neutral", "negative"];

    return (
      <ValueContainer>
        {emotions.map((emotion, index) => (
          <Value key={index}>
            <Circle color={getColor(emotion)} />
            <TextValue>{emotion}</TextValue>
          </Value>
        ))}
      </ValueContainer>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Body>
      <SidebarContainer>
        <NavBar />
      </SidebarContainer>
      <RightSection>
        <MainContent>
          <Text>{year}년에는 일기를 {totalDairy}편 썼어요!</Text>
          <HistoryContainer>
            <GrassGraph/>
          </HistoryContainer>
          <StatsContainer>
            <StatsContent>
              <Text>{month}월 총 작성</Text>
              <BigText>{monthData} 편</BigText>
            </StatsContent>
            <StatsContent>
              <Text>월 평균 작성</Text>
              <BigText>{average} 편</BigText>
            </StatsContent>
            <StatsContent>
              <Text>선호 스타일</Text>
              <BigText>{style}</BigText>
            </StatsContent>
          </StatsContainer>
          <Text>{month}월 {startDay} ~ {endDay}일 감정분석 기록</Text>
          <SentimentContainer>
            <RenderLineChat />
            <GraphValue />
          </SentimentContainer>
        </MainContent>
      </RightSection>
    </Body>
  );
}

export default StatsPage;
