// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
// import { useEffect } from "react";
// import { uploadQuestions } from "./uploadQuestions";

export default function App() {
  // useEffect(() => {
  //   // Викликаємо завантаження питань при першому завантаженні
  //   uploadQuestions();
  // }, []); // Порожній масив залежностей, щоб викликати лише один раз
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
}
