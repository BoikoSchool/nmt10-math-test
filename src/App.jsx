// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import AdminPanel from "./pages/AdminPanel";
import { useEffect } from "react";
import { uploadQuestions } from "./uploadQuestions";
// import { uploadQuestionsUkr } from "./uploadUkrQuestions2";

export default function App() {
  useEffect(() => {
    // Викликаємо завантаження питань при першому завантаженні
    // uploadQuestions();
    // uploadQuestionsUkr();
  }, []); // Порожній масив залежностей, щоб викликати лише один раз
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}
