import { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";

const containsLatex = (text) => /\$|\\\(|\\frac|\\sqrt|\\int|\\sum/.test(text);

const SingleChoiceQuestion = ({ question, onAnswer, selectedAnswer }) => {
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    if (question?.options?.length) {
      const shuffled = [...question.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    }
  }, [question]);

  return (
    <div className="space-y-4">
      {containsLatex(question.question) ? (
        <MathJax className="text-lg font-semibold whitespace-pre-line">
          {question.question}
        </MathJax>
      ) : (
        <div className="text-lg font-semibold whitespace-pre-line">
          {question.question}
        </div>
      )}

      {question.image && (
        <img
          src={question.image}
          alt="Зображення до питання"
          className="max-w-full h-50 rounded-md"
        />
      )}

      <div className="space-y-2">
        {shuffledOptions.map((opt, index) => (
          <label
            key={index}
            className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedAnswer === opt.label
                ? "bg-blue-100 border-blue-500 text-blue-900"
                : "hover:bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={opt.label}
              checked={selectedAnswer === opt.label}
              onChange={() => onAnswer(opt.label)}
              className="mr-2 accent-blue-600"
            />
            {opt.image ? (
              <img
                src={opt.image}
                alt={`Option ${opt.label}`}
                className="w-36 h-36 object-contain inline"
              />
            ) : containsLatex(opt.label) ? (
              <MathJax dynamic>{opt.label}</MathJax>
            ) : (
              <span>{opt.label}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SingleChoiceQuestion;
