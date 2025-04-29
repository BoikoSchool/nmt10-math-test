// ResultsPage.jsx

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { MathJaxContext } from "better-react-mathjax";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";

// Шкала НМТ для математики
const nmtMapMath = {
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

// Шкала НМТ для української мови
const nmtMapUkr = {
  7: 100,
  8: 105,
  9: 110,
  10: 115,
  11: 120,
  12: 125,
  13: 131,
  14: 134,
  15: 136,
  16: 138,
  17: 140,
  18: 142,
  19: 143,
  20: 144,
  21: 145,
  22: 146,
  23: 148,
  24: 149,
  25: 150,
  26: 152,
  27: 154,
  28: 156,
  29: 157,
  30: 159,
  31: 160,
  32: 162,
  33: 163,
  34: 165,
  35: 167,
  36: 170,
  37: 172,
  38: 175,
  39: 177,
  40: 180,
  41: 183,
  42: 186,
  43: 191,
  44: 195,
  45: 200,
};

// Повертає НМТ-бал для даного предмета й тестового балу
const getNmtScore = (subject, testScore) => {
  if (subject === "math") return nmtMapMath[testScore] ?? "н/д";
  if (subject === "ukr") return nmtMapUkr[testScore] ?? "н/д";
  return "н/д";
};

const ResultsPage = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const navigate = useNavigate();

  // Перевірка прав адміна
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email === "admin@boiko.com.ua") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        navigate("/test");
      }
    });
    return () => unsub();
  }, [navigate]);

  // Завантажуємо всі відповіді
  useEffect(() => {
    if (!authorized) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, "userAnswers"));
        const dataByEmail = {};
        snap.docs.forEach((doc) => {
          const { userEmail: email, score = {}, results = [] } = doc.data();
          if (!dataByEmail[email]) {
            dataByEmail[email] = { score, results: [] };
          }
          dataByEmail[email].results.push(...results);
        });
        setGrouped(dataByEmail);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [authorized]);

  const toggleExpand = (email) =>
    setExpandedUsers((prev) => ({ ...prev, [email]: !prev[email] }));

  const formatAnswer = (ans) =>
    typeof ans === "object" ? Object.values(ans).join(", ") : ans;

  if (authorized === null) return <p>Перевірка доступу...</p>;
  if (!authorized) return null;
  if (loading) return <p>Завантаження результатів...</p>;

  return (
    <MathJaxContext>
      <div className="max-w-5xl mx-auto p-6">
        {/* Навігація */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Адміністрування
          </button>
          <h1 className="text-2xl font-bold">Результати тестів</h1>
          <button
            onClick={() => navigate("/test")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Пройти тест
          </button>
        </div>

        {/* Список користувачів */}
        <div className="space-y-4">
          {Object.entries(grouped).map(
            ([email, { score = {}, results = [] }]) => {
              const mathScore = score.math ?? 0;
              const ukrScore = score.ukr ?? 0;

              return (
                <div key={email} className="bg-white shadow rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Email: {email}</p>
                      {/* ОКРЕМО ВИВОДИМО ПОЛЯ math та ukr */}
                      <p>
                        Математика: {mathScore} / 32 — шкала НМТ:{" "}
                        {getNmtScore("math", mathScore)}
                      </p>
                      <p>
                        Укр. мова: {ukrScore} / 45 — шкала НМТ:{" "}
                        {getNmtScore("ukr", ukrScore)}
                      </p>
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
                            <th className="py-2 px-4 bg-gray-200">Предмет</th>
                            <th className="py-2 px-4 bg-gray-200">№ Питання</th>
                            <th className="py-2 px-4 bg-gray-200">
                              Ваша відповідь
                            </th>
                            <th className="py-2 px-4 bg-gray-200">
                              Правильна відповідь
                            </th>
                            <th className="py-2 px-4 bg-gray-200">Бали</th>
                            <th className="py-2 px-4 bg-gray-200">
                              Правильно?
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((item, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                              }
                            >
                              <td className="border px-4 py-2 text-center">
                                {item.subject === "math"
                                  ? "Математика"
                                  : "Укр. мова"}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {item.questionId}
                              </td>
                              <td className="border px-4 py-2">
                                {formatAnswer(item.userAnswer)}
                              </td>
                              <td className="border px-4 py-2">
                                {formatAnswer(item.correctAnswer)}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {item.earnedPoints}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {item.isCorrect ? "Так" : "Ні"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </MathJaxContext>
  );
};

export default ResultsPage;
