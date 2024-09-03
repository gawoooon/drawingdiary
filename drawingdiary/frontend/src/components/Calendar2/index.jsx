import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { format, addMonths, subMonths } from "date-fns";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays } from "date-fns";
import { useCalendar } from "./CalendarProvider";
import axios from "axios";
import { useAuth } from "../auth/context/AuthContext";

const CalendarBox = styled.div`
  width: 800px;
  height: 800px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
`;

const HeaderBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderStartBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 24px;
  height: 24px;
  font-size: 1.8em;
  font-weight: 900;
  cursor: pointer;
  border-radius: 50%;
  &:hover {
    background-color: #b7b7b7;
  }
`;

const HeaderMiddleBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33%;
  color: #0d0d0d;
  font-size: 1.2em;
  font-weight: 900;
`;

const HeaderMonth = styled.p`
  padding-right: 5px;
  color: #0d0d0d;
`;

const HeaderYear = styled.p`
  padding-right: 5px;
  color: #0d0d0d;
`;

const HeaderEndBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 24px;
  height: 24px;
  font-size: 1.8em;
  font-weight: 900;
  cursor: pointer;
  border-radius: 50%;
  &:hover {
    background-color: #b7b7b7;
  }
`;

const DaysBox = styled.div`
  display: flex;
  width: 100%;
  flex: 0 0 5%;
  font-weight: 400;
  font-size: 1em;
  box-sizing: border-box;
`;

const DayColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #0d0d0d;
  border: 1px solid rgba(224, 224, 224, 0.5);
  border-left: ${(props) =>
    props.isSun ? "1px solid rgba(224, 224, 224, 0.5)" : "none"};
  border-right: ${(props) =>
    props.isSat ? "1px solid rgba(224, 224, 224, 0.5)" : "none"};
  box-sizing: border-box;
`;

const BodyBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1 1 auto;
  box-sizing: border-box;
`;

const BodyDaysBox = styled.div`
  display: flex;
  width: 100%;
  flex: 1 1 0;
  box-sizing: border-box;
`;

const BodyMonth = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-weight: 500;
  font-size: 1em;
  color: #0d0d0d;

  &.not-valid {
    color: #b7b7b7;
    cursor: default;
  }

  &.today {
    background-color: rgba(106, 156, 253, 0.2);
  }
`;

const NumberBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 24px;
  height: 24px;
  background-color: ${(props) =>
    props.hasData ? "rgba(106, 156, 253, 0.2)" : "none"};
  border-radius: ${(props) => (props.hasData ? "50%" : "none")};
  font-weight: 500;
  font-size: 1em;
  color: #0d0d0d;

  &.not-valid {
    color: #b7b7b7;
    cursor: default;
  }

  &.today {
    background-color: rgba(106, 156, 253, 0.5);
    border-radius: 50%;
  }
`;

const BodyDayOneBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  border-top: 1px solid rgba(224, 224, 224, 0.5);
  border-bottom: 1px solid rgba(224, 224, 224, 0.5);
  border-left: ${(props) =>
    props.isSun || props.isEven
      ? "1px solid rgba(224, 224, 224, 0.5)"
      : "none"};
  border-right: ${(props) =>
    props.isSat || props.isEven
      ? "1px solid rgba(224, 224, 224, 0.5)"
      : "none"};
  cursor: pointer;

  &.selected {
    ${BodyMonth}:not(.today, .not-valid) {
      background-color: rgba(106, 156, 253, 0.3);
      border-radius: 50%;
    }
  }

  &:hover,
  &.selected {
    ${NumberBox} {
      background-color: #eeeeee;
      border-radius: 50%;
    }
  }
`;

const BlankBox = styled.div`
  flex: 1;
`;

const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
  return (
    <HeaderBox>
      <HeaderStartBox>
        <GrFormPrevious onClick={prevMonth} />
      </HeaderStartBox>
      <HeaderMiddleBox>
        <HeaderMonth>{format(currentMonth, "MMMM")}</HeaderMonth>
        <HeaderYear>{format(currentMonth, "yyyy")}</HeaderYear>
      </HeaderMiddleBox>
      <HeaderEndBox>
        <GrFormNext onClick={nextMonth} />
      </HeaderEndBox>
    </HeaderBox>
  );
};

const RenderDays = () => {
  const days = [];
  const date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    days.push(
      <DayColumn key={i} isSun={i === 0} isSat={i === 6}>
        {date[i]}
      </DayColumn>
    );
  }

  return <DaysBox>{days}</DaysBox>;
};

const RenderCells = ({
  currentMonth,
  selectedDate,
  onDateClick: cellOnDateClick,
  datesWithData,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  const today = new Date();

  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;

      const isToday = isSameDay(day, today);
      const isClicked = isSameDay(day, selectedDate);
      const hasData = datesWithData.includes(format(day, "yyyy-MM-dd"));

      days.push(
        <BodyDayOneBox
          className={`col cell ${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : format(currentMonth, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          }${isToday ? "today" : ""}${isClicked ? " clicked" : ""} ${
            isClicked ? " selected" : ""
          }`}
          key={day}
          onClick={() => cellOnDateClick(cloneDay)}
          isSun={i === 0}
          isSat={i === 6}
          isEven={i % 2 === 1}
          hasData={hasData}
        >
          <NumberBox
            className={
              format(currentMonth, "M") !== format(day, "M")
                ? "text not-valid"
                : isToday
                ? "today"
                : ""
            }
            hasData={hasData}
          >
            {formattedDate}
          </NumberBox>
          <BlankBox />
        </BodyDayOneBox>
      );
      day = addDays(day, 1);
    }
    rows.push(<BodyDaysBox key={day}>{days}</BodyDaysBox>);
    days = [];
  }
  return <BodyBox>{rows}</BodyBox>;
};

function Calendar2({ onDateClick: parentOnDateClick }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesWithData, setDatesWithData] = useState([]);
  const { setMonth, currentMonth, setCurrentMonth } = useCalendar();
  const { memberID, getToken } = useAuth();
  const accessToken = getToken();

  useEffect(() => {
    const fetchCalendar = async () => {
      const year = format(currentMonth, "yyyy");
      const month = format(currentMonth, "MM");

      try {
        const response = await axios.get(
          `http://localhost:8080/api/calender/${year}-${month}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const dates = response.data.map((item) => item.date);
        setDatesWithData(dates);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    fetchCalendar();
  }, [currentMonth, accessToken]);

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setMonth(format(currentMonth, "yyyy"));
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setMonth(format(currentMonth, "MM"));
  };

  const onDateClick = (day) => {
    if (isSameDay(day, selectedDate)) {
      setSelectedDate(null);
      parentOnDateClick(day);
    } else {
      setSelectedDate(day);
      parentOnDateClick(day);
    }
  };

  return (
    <CalendarBox>
      <RenderHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <RenderDays />
      <RenderCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateClick={onDateClick}
        datesWithData={datesWithData}
      />
    </CalendarBox>
  );
}

export default Calendar2;
