import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../auth/AuthContext';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 98%; 
  height: 202px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 8px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #808080;
    border-radius: 4px;
  }
`;

const MonthContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  height: 20px;
`;

const GridContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  width: auto;
  height: 182px;
`;

const MonthText = styled.span`
  position: absolute;
  font-size: 8px;
  margin-left: ${props => props.offset}px;
`;

const GridItem = styled.div`
  width: 18px; 
  height: 18px; 
  margin: 4px;
  background-color: ${props => props.color};
  border-radius: 3px;
  position: relative;
  &:hover div {
    visibility: visible;
  }
`;

const HoverStyle = styled.div`
  visibility: hidden;
  font-size: 10px;
  color: #da0000;
  font-size: 16px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  top: -30px;
  left: -42px;
  padding: 2px 5px;
  white-space: nowrap;
  z-index: 1;
`;

const DaySquare = ({ item }) => {

  const getColor = (item) => {
    switch(item.iswritten) {
      case 0: return '#ebedf0'; 
      case 1: return '#f89de4';
      default: return '#ebedf0';
    }
  };

  return (
    <GridItem color={getColor(item)}>
      {item.iswritten === 1 && (
        <HoverStyle>
          {item.writtenDate}
        </HoverStyle>
      )}
    </GridItem>
  );
};

const GrassGraph = () => {
  const { getToken } = useAuth();
  const accessToken = getToken();
  const [grid, setGrid] = useState([]);
  const [monthPositions, setMonthPositions] = useState([]);
  

  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/statistic', 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const isWrittenData = response.data.lawn.data.map(item => ({
          writtenDate : item.date,
          iswritten : item.iswritten ? 1 : 0,
        }));
        setGrid(isWrittenData);

        const positions = isWrittenData.reduce((acc, item, index) => {
          const monthIndex = new Date(item.writtenDate).getMonth();
          if(index === 0 || monthIndex !== new Date(isWrittenData[index - 1].writtenDate).getMonth()) {
            acc.push({ month: monthNames[monthIndex], position: index, sortKey: monthIndex});
          }
          return acc;
        }, []);

        positions.sort((a, b) => a.sortKey - b.sortKey);
        setMonthPositions(positions);
      } catch(error) {
        console.log("error: ", error);
      }
    };
    fetchGrid();
    
  }, [getToken]);

  return (
    <GridContainer>
      <MonthContent>
        {monthPositions.map((m, index) => (
          <MonthText key={index} offset={m.position === 0 ? 0 : ((m.position / 7) * 26 - 8)}>{m.month}</MonthText>
        ))}
      </MonthContent>
      <GridContent>
        {grid.map((item, index) => (
          <DaySquare key={index} item={item} />
        ))}
      </GridContent>
    </GridContainer>
  );
};

export default GrassGraph;
