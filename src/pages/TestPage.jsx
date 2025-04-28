import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import QuestionRenderer from "../components/QuestionRenderer";
import { MathJaxContext } from "better-react-mathjax";
import { useNavigate } from "react-router-dom";

const mathJaxConfig = {
  loader: { load: ["[tex]/ams"] },
  tex: { packages: { "[+]": ["ams"] } },
};

// Функція для оцінки matching-питання
const calculateMatchingPoints = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return 0;
  let points = 0;
  for (const key in correctAnswer) {
    if (userAnswer[key - 1] === correctAnswer[key]) {
      points++;
    }
  }
  return points; // 0, 1, 2 або 3
};

const TestPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, "questions"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => a.id - b.id);
      setQuestions(data);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAnswers = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Будь ласка, увійдіть у систему.");
      return;
    }

    let totalPoints = 0;

    const detailedResults = questions
      .map((question, index) => {
        const userAnswer = answers[index];
        if (!userAnswer) return null;

        let earnedPoints = 0;

        if (question.type === "single") {
          earnedPoints = userAnswer === question.answer ? 1 : 0;
        } else if (question.type === "input") {
          earnedPoints = userAnswer === question.answer ? 2 : 0;
        } else if (question.type === "matching") {
          earnedPoints = calculateMatchingPoints(userAnswer, question.answer);
        }

        totalPoints += earnedPoints;

        return {
          questionId: question.id,
          questionType: question.type,
          userAnswer,
          correctAnswer: question.answer,
          earnedPoints,
          isCorrect:
            (question.type === "single" && earnedPoints === 1) ||
            (question.type === "input" && earnedPoints === 2) ||
            (question.type === "matching" && earnedPoints > 0),
        };
      })
      .filter(Boolean);

    const answerDocRef = doc(db, "userAnswers", `${user.uid}_${Date.now()}`);

    try {
      await setDoc(answerDocRef, {
        uid: user.uid,
        userEmail: user.email,
        results: detailedResults,
        submittedAt: new Date().toISOString(),
        score: totalPoints, // <-- тепер ЗБЕРІГАЄМО просто число
      });
      alert("Відповіді збережено!");
      navigate("/results");
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      alert("Сталася помилка при збереженні відповідей.");
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Питання{" "}
          <span className="text-orange-600">{currentQuestionIndex + 1}</span> з{" "}
          {questions.length}
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <QuestionRenderer
            key={currentQuestionIndex}
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={answers[currentQuestionIndex] || null}
          />
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            Назад
          </button>
          <button
            onClick={goToNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Далі
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={submitAnswers}
            className="bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Завершити тест
          </button>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default TestPage;
