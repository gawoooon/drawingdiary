import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CategoryProvider } from "./components/album/CategoryList";

import LoginPage from "./pages/LoginPage.jsx";
import LoginLostPage from "./pages/LoginLostPage.jsx";
import JoinPage from "./pages/JoinPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import DiaryPage from "./pages/DiaryPage.jsx";
import AlbumPage from "./pages/AlbumPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import PasswordLostPage from "./pages/PasswordLostPage.jsx";
import EmailLostPage from "./pages/EmailLostPage.jsx";
import MyPage from "./pages/MyPage.jsx";
import FinishPage from "./pages/FinishPage";
import { CalendarProvider } from "./components/main/Calendar2/CalendarProvider.jsx";
import ShowDiaryPage from "./pages/ShowDiaryPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginlost" element={<LoginLostPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route
          path="/"
          element={
            <CalendarProvider>
              <CalendarPage />
            </CalendarProvider>
          }
        />
        <Route
          path="/diary/:memberId/:dateId"
          element={
            <CategoryProvider>
              <DiaryPage />
            </CategoryProvider>
          }
        />

        <Route
          path="/showDiary/:memberId/:dateId"
          element={
            <CategoryProvider>
              <ShowDiaryPage />
            </CategoryProvider>
          }
        />

        <Route
          path="/album"
          element={
            <CategoryProvider>
              <AlbumPage />
            </CategoryProvider>
          }
        />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/FinishPage" element={<FinishPage />} />
        <Route path="/password" element={<PasswordLostPage />} />
        <Route path="/email" element={<EmailLostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
