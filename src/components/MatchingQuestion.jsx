import { useState, useEffect } from "react";
import { MathJax } from "better-react-mathjax";

const MatchingQuestion = ({ question, onAnswer, selectedAnswer }) => {
  const { left, right } = question.pairs;
  const [matches, setMatches] = useState({});

  useEffect(() => {
    if (selectedAnswer) {
      setMatches(selectedAnswer);
    }
  }, [selectedAnswer]);

  const handleSelect = (rowIdx, colIdx) => {
    // Отримуємо букву зі стовпця (наприклад, якщо "Б. натуральних чисел", беремо "Б")
    const rightItem = right[colIdx];
    const selectedLetter = rightItem.trim().charAt(0);

    const newMatches = { ...matches };

    // Видаляємо попередні вибори в цьому рядку
    Object.keys(newMatches).forEach((key) => {
      if (Number(key) === rowIdx) {
        delete newMatches[key];
      }
    });

    // Видаляємо попередні вибори в цій колонці
    Object.keys(newMatches).forEach((key) => {
      if (newMatches[key] === selectedLetter) {
        delete newMatches[key];
      }
    });

    // Додаємо нову пару
    newMatches[rowIdx] = selectedLetter;
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const isSelected = (rowIdx, colIdx) => {
    const rightItem = right[colIdx];
    const letter = rightItem.trim().charAt(0);
    return matches[rowIdx] === letter;
  };

  return (
    <div className="space-y-6">
      <MathJax className="text-xl font-bold text-gray-800">
        {question.question}
      </MathJax>

      {question.image && (
        <img
          src={question.image}
          alt="Зображення до питання"
          className="max-w-full h-50 rounded-md"
        />
      )}

      <div className="">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="border px-4 py-2 bg-gray-100"></th>
              {right.map((rightItem, idx) => (
                <th
                  key={idx}
                  className="border px-4 py-2 bg-gray-100 text-center"
                >
                  <MathJax>{rightItem}</MathJax>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {left.map((leftItem, rowIdx) => (
              <tr key={rowIdx}>
                <td className="border px-4 py-2 bg-gray-100">
                  <MathJax>{leftItem}</MathJax>
                </td>
                {right.map((_, colIdx) => (
                  <td
                    key={colIdx}
                    className="border px-4 py-2 text-center cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSelect(rowIdx, colIdx)}
                  >
                    <div
                      className={`w-5 h-5 rounded-full mx-auto ${
                        isSelected(rowIdx, colIdx)
                          ? "bg-blue-500"
                          : "border border-gray-400"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchingQuestion;
