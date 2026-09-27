import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import QuizCard from "../components/QuizCard.jsx";
import { saveQuizResult, getErrorMessage } from "../services/api.js";

const TakeQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz;

  const [current, setCurrent] = useState(0);
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!quiz) {
    return (
      <div className="card max-w-xl">
        <p className="text-gray-600 mb-4">No quiz loaded. Generate one first.</p>
        <Link to="/quiz-generator" className="btn-primary">Go to Quiz Generator</Link>
      </div>
    );
  }

  const { questions, subject, topic, difficulty } = quiz;
  const question = questions[current];

  const handleSelect = (option) => {
    setSelections({ ...selections, [current]: option });
  };

  const handleSubmit = async () => {
    const answers = questions.map((q, i) => {
      const selectedAnswer = selections[i] || "";
      return {
        question: q.question,
        selectedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: selectedAnswer === q.correctAnswer,
        explanation: q.explanation,
      };
    });

    const score = answers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((score / questions.length) * 100);

    setResult({ answers, score, percentage });
    setSubmitted(true);

    setSaving(true);
    try {
      await saveQuizResult({
        subject,
        topic,
        difficulty,
        answers,
        totalQuestions: questions.length,
      });
      toast.success("Quiz result saved!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (submitted && result) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
          <p className="text-4xl font-bold text-primary-600 my-4">
            {result.score} / {questions.length}
          </p>
          <p className="text-gray-500">Percentage: {result.percentage}%</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span className="text-green-600 font-medium">Correct: {result.score}</span>
            <span className="text-red-600 font-medium">
              Incorrect: {questions.length - result.score}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {result.answers
            .map((a, i) => ({ ...a, i }))
            .filter((a) => !a.isCorrect)
            .map((a) => (
              <div key={a.i} className="card">
                <p className="font-medium text-gray-800 mb-1">{a.question}</p>
                <p className="text-sm text-red-600">Your answer: {a.selectedAnswer || "Skipped"}</p>
                <p className="text-sm text-green-600">Correct answer: {a.correctAnswer}</p>
                <p className="text-sm text-gray-500 mt-1">{a.explanation}</p>
              </div>
            ))}
        </div>

        <div className="flex gap-3">
          <Link to="/quiz-generator" className="btn-primary">Take Another Quiz</Link>
          <Link to="/progress" className="btn-secondary">View Progress</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <QuizCard
        question={question}
        index={current}
        total={questions.length}
        selected={selections[current]}
        onSelect={handleSelect}
      />

      <div className="flex justify-between">
        <button
          className="btn-secondary"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Previous
        </button>

        {current < questions.length - 1 ? (
          <button className="btn-primary" onClick={() => setCurrent(current + 1)}>
            Next
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
