import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { generateQuiz, getErrorMessage } from "../services/api.js";

const QuizGenerator = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "",
    topic: "",
    difficulty: "Medium",
    numQuestions: 5,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.topic.trim()) {
      toast.error("Please enter a subject and topic.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateQuiz(form);
      toast.success("Quiz generated!");
      navigate("/take-quiz", { state: { quiz: res.data } });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quiz Generator</h1>
        <p className="text-gray-500">Let AI create a quiz to test your knowledge</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <input
          type="text"
          placeholder="Subject (e.g. Operating System)"
          className="input"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        <input
          type="text"
          placeholder="Topic (e.g. Process Scheduling)"
          className="input"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            className="input"
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <input
            type="number"
            min={1}
            max={25}
            className="input"
            value={form.numQuestions}
            onChange={(e) => setForm({ ...form, numQuestions: Number(e.target.value) })}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Generating quiz..." : "Generate Quiz"}
        </button>
      </form>
    </div>
  );
};

export default QuizGenerator;
