import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavBar from "../components/sidebar/NavBar";
import GrassGraph from "../components/grid/DaySquare";
import Background2 from "../components/Background/index2";
import { format } from 'date-fns';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const Container = styled.section`
  width: 98%;
  height: 100%;
  margin: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const Text = styled.span`
  margin: 10px;
  font-size: 15px;
  font-weight: bold;
`;

const HistoryContainer = styled.section`
  width: 96%;
  height: 18%;
  margin: 10px;
`;

const StatsContainer = styled.section`
  width: 95%;
  height: 20%;
  margin: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SentimentContainer = styled.section`
  width: 90%;
  height: 20%;
  margin: 10px;
  padding: 10px 40px 10px 60px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 100px;
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
  background-color: ${props => props.color};
`;

const TextValue = styled.div`
  margin: 10px 20px;
`;

function StatsPage() {

  const accessToken = localStorage.getItem("accessToken");

  const [totalDairy, setTotalDiary] = useState("");

  const date = new Date();
  const year = format(date, "yyyy");
  const month = format(date, "M");
  const startDay = format(date, "d")
  const endDay = parseInt(startDay) + 7;

  const [sentiData, setSentiData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/statistic',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setTotalDiary(response.data.lawn.total);
      
      let index = 0;
      const sentimentData = response.data.emotions.map(item => {
        if(item === null) {
          return {
            name : ++index,
            positive : 0,
            neutral : 0,
            negative : 0,
          };
        } else {
          return {
            name : ++index,
            positive : item.positive,
            neutral : item.neutral,
            negative : item.negative,
          };
        }
      });
      setSentiData(sentimentData);
      console.log(sentiData);

    } catch(error) {
      console.log(error);
    }
  };

  const RenderLineChat = ({ data }) => {

    return (
      <LineChart width={1200} height={180} data={data}>
        <Line type="monotone" dataKey="positive" stroke="#FF76CE" strokeWidth={2} />
        <Line type="monotone" dataKey="neutral" stroke="#b87ffa" strokeWidth={2} />
        <Line type="monotone" dataKey="negative" stroke="#A3D8FF" strokeWidth={2} />
        <Tooltip />
      </LineChart>
    );
  }

  const GraphValue = () => {
    const getColor = (emotion) => {
      switch(emotion) {
        case 'positive' : return "#FF76CE";
        case 'neutral' : return "#b87ffa";
        case 'negative' : return "#A3D8FF";
        default: return '#ffffff';
      }
    };

    const emotions = ['positive', 'neutral', 'negative'];

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
    <div>
      <Background2>
        <Container>
          <NavBar />
          <div style={{marginTop: '40px'}}></div>
          <Text>{year}년에는 일기를 {totalDairy}편 썼어요!</Text>
          <HistoryContainer>
            <GrassGraph/>
          </HistoryContainer>

          <Text>수치</Text>
          <StatsContainer>

          </StatsContainer>

          <Text>{month}월 {startDay} ~ {endDay}일 감정분석 기록</Text>
          <SentimentContainer>
            <RenderLineChat data={sentiData} />
            <GraphValue />
          </SentimentContainer>
        </Container>
      </Background2>
    </div>
  );
}

export default StatsPage;
