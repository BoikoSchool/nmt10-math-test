import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { MathJaxContext } from "better-react-mathjax";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";

const testScoreToNmtScore = {
  5: 100,
  6: 108,
  7: 115,
  8: 123,
  9: 131,
  10: 134,
  11: 137,
  12: 140,
  13: 143,
  14: 145,
  15: 147,
  16: 148,
  17: 149,
  18: 150,
  19: 151,
  20: 152,
  21: 155,
  22: 159,
  23: 163,
  24: 167,
  25: 170,
  26: 173,
  27: 176,
  28: 180,
  29: 184,
  30: 189,
  31: 194,
  32: 200,
};

const ResultsPage = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === "admin@boiko.com.ua") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        navigate("/test");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!authorized) return;

    const fetchResults = async () => {
      try {
        const snapshot = await getDocs(collection(db, "userAnswers"));
        const dataByEmail = {};

        snapshot.docs.forEach((doc) => {
          const { userEmail: email, score, results = [] } = doc.data();
          if (!dataByEmail[email]) {
            dataByEmail[email] = { score, results: [] };
          }
          dataByEmail[email].results.push(...results);
        });

        setGrouped(dataByEmail);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [authorized]);

  const toggleExpand = (email) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const formatAnswer = (answer) => {
    if (typeof answer === "object") {
      return Object.values(answer).join(", ");
    }
    return answer;
  };

  const getNmtScore = (score) => {
    return testScoreToNmtScore[score] || "н/д"; // якщо тестового балу нема в таблиці
  };

  if (authorized === null) return <p>Перевірка доступу...</p>;
  if (!authorized) return null;
  if (loading) return <p>Завантаження результатів...</p>;

  return (
    <MathJaxContext>
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => navigate("/admin")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Адміністрування
        </button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Результати тестів користувачів</h1>
          <button
            onClick={() => navigate("/test")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Пройти тест
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([email, { score, results }]) => (
            <div key={email} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Email: {email}</p>
                  <p>Загальний рахунок: {score} / 32</p>
                  <p>Загальний бал НМТ: {getNmtScore(score)} / 200</p>
                </div>
                <button
                  onClick={() => toggleExpand(email)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {expandedUsers[email] ? (
                    <Minus size={24} />
                  ) : (
                    <Plus size={24} />
                  )}
                </button>
              </div>

              {expandedUsers[email] && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full bg-gray-50 rounded-lg">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 bg-gray-200">Номер питання</th>
                        <th className="py-2 px-4 bg-gray-200">
                          Ваша відповідь
                        </th>
                        <th className="py-2 px-4 bg-gray-200">
                          Правильна відповідь
                        </th>
                        <th className="py-2 px-4 bg-gray-200">
                          Отримано балів
                        </th>
                        <th className="py-2 px-4 bg-gray-200">Правильно?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((item, idx) => {
                        const userAnswer = formatAnswer(item.userAnswer);
                        const correctAnswer = formatAnswer(item.correctAnswer);

                        return (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                            }
                          >
                            <td className="border px-4 py-2 text-center">
                              {item.questionId}
                            </td>
                            <td className="border px-4 py-2">{userAnswer}</td>
                            <td className="border px-4 py-2">
                              {correctAnswer}
                            </td>
                            <td className="border px-4 py-2 text-center">
                              {item.earnedPoints}
                            </td>
                            <td className="border px-4 py-2 text-center">
                              {item.isCorrect ? "Так" : "Ні"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MathJaxContext>
  );
};

export default ResultsPage;
