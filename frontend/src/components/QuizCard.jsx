const QuizCard = ({ question, index, total, selected, onSelect }) => (
  <div className="card animate-fade-up">
    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
      <p className="text-sm text-gray-400">
        Question {index + 1} of {total}
      </p>
      <div className="flex gap-1 flex-wrap justify-end">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-gradient-brand" : i < index ? "w-1.5 bg-primary-300" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h3>
    <div className="space-y-2">
      {question.options.map((option, i) => (
        <button
          key={i}
          onClick={() => onSelect(option)}
          className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
            selected === option
              ? "border-primary-500 bg-gradient-card text-primary-700 shadow-sm scale-[1.01]"
              : "border-gray-200 hover:border-primary-300 hover:bg-primary-50/50"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export default QuizCard;
