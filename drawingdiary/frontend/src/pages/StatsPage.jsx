import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavBar from "../components/sidebar/NavBar";
import GrassGraph from "../components/grid/DaySquare";
import { format } from 'date-fns';
import { LineChart, Line, Tooltip } from "recharts";
import { useAuth } from "../auth/AuthContext";

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 20px;
  position: relative; /* 상대적인 위치 설정 */
`;

const SidebarContainer = styled.div`
  width: 260px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000; /* NavBar가 가장 앞에 오도록 설정 */
`;

const RightSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% - 260px);
  height: 100vh; 
  margin-left: 40px; 
  box-sizing: border-box;
  padding: 20px;
  position: relative; /* 부모로부터의 상대적인 위치를 설정 */
  z-index: 1; /* RightSection의 z-index를 NavBar보다 낮게 설정 */
`;

const MainContent = styled.section`
  width: 100%;
  max-width: 1000px;
  height: 100%;
  margin: 0 auto; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative; /* 상대적 위치 설정 */
  z-index: 1; /* NavBar보다 뒤에 오도록 설정 */
`;

const Text = styled.span`
  margin: 10px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const BigText = styled.span`
  margin: 10px;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
`;

const HistoryContainer = styled.section`
  width: 100%;
  max-width: 1000px;
  height: 202px;
  margin: 20px 0; /* 양쪽에 균등한 여백 추가 */
`;

const StatsContainer = styled.section`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around; /* 요소를 양 끝으로 정렬 */
  margin: 20px 0;
  padding: 10px;
  box-sizing: border-box;
`;

const StatsContent = styled.div`
  flex: 1; /* 요소가 동일한 크기로 확장되도록 설정 */
  max-width: 200px;
  height: 80px;
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SentimentContainer = styled.section`
  width: 100%;
  max-width: 1000px;
  margin: 20px 0;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Value = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 3px 0;
`;

const Circle = styled.div`
  width: 20px;
  height: 20px;
  margin: 0 10px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const TextValue = styled.div`
  margin: 0 10px;
  text-align: center;
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
      <LineChart width={1000} height={180} data={sentiData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
