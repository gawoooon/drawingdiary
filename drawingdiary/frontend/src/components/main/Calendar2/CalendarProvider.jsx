import { format } from 'date-fns';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [year, setYear] = useState(currentMonth.getFullYear());
  const [month, setMonth] = useState(currentMonth.getMonth() + 1);

  useEffect(() => {
    // currentMonth 상태가 변경될 때마다 year와 month 업데이트
    
    setYear(format(currentMonth, "yyyy"));
    setMonth(format(currentMonth, "MM"));

  }, [currentMonth]);

  const value = { year, setYear, month, setMonth, currentMonth, setCurrentMonth };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};
