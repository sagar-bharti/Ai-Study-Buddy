import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import { askTutor, getErrorMessage } from "../services/api.js";

const AITutor = () => {
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !question.trim()) {
      toast.error("Please enter a subject and a question.");
      return;
    }
    setLoading(true);
    setAnswer("");
    try {
      const res = await askTutor({ subject, level, question });
      setAnswer(res.data.answer);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">AI Tutor</h1>
        <p className="text-gray-500">Ask anything about your studies</p>
      </div>

      <form onSubmit={handleAsk} className="card space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Subject (e.g. DBMS)"
            className="input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <select className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <textarea
          placeholder="Enter your question..."
          className="input min-h-[100px]"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {loading && <Loading text="Generating your answer..." />}

      {answer && !loading && (
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-2">AI Response</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AITutor;
