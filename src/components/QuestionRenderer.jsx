import SingleChoiceQuestion from "./SingleChoiceQuestion";
import InputQuestion from "./InputQuestion";
import MatchingQuestion from "./MatchingQuestion";

const QuestionRenderer = ({ question, onAnswer, selectedAnswer }) => {
  switch (question.type) {
    case "single":
      return (
        <SingleChoiceQuestion
          question={question}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
        />
      );
    case "input":
      return (
        <InputQuestion
          question={question}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
        />
      );
    case "matching":
      return (
        <MatchingQuestion
          question={question}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
        />
      );
    default:
      return <p>Невідомий тип питання: {question.type}</p>;
  }
};

export default QuestionRenderer;
