import { MathJax } from "better-react-mathjax";
const InputQuestion = ({ question, onAnswer, selectedAnswer }) => {
  return (
    <div className="space-y-4">
      <MathJax className="text-lg font-semibold">{question.question}</MathJax>
      <input
        type="text"
        value={selectedAnswer || ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Введіть відповідь"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default InputQuestion;
