import { useState } from "react";

type Question = {
  id: number;
  topic: string;
  answer: string;
};

export function LabFlags({ questions }: { questions: Question[] }) {
  const [flags, setFlags] = useState<string[]>(Array(questions.length).fill(""));
  const [status, setStatus] = useState<(boolean | null)[]>(Array(questions.length).fill(null));

  const handleChange = (index: number, value: string) => {
    const updated = [...flags];
    updated[index] = value;
    setFlags(updated);
  };

  const checkFlag = (index: number) => {
    const submitted = flags[index].trim();
    const correct = questions[index].answer;

    const updatedStatus = [...status];
    updatedStatus[index] = submitted === correct;
    setStatus(updatedStatus);
  };

  const solvedCount = status.filter((s) => s === true).length;
  const progress = Math.round((solvedCount / questions.length) * 100);

  return (
    <div className="my-12 w-full">
      {/* Header */}
      <div className="mb-8 text-left w-full">
  <h2 className="text-3xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
    Lab Flag Submission
  </h2>

  {/* Progress Bar */}
  <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
    <div
      className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>

  {/* Flags Solved Info */}
  <div className="mt-3 flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
    <span className="text-2xl">🚩</span>
    <span>{solvedCount} / {questions.length} flags solved</span>
  </div>
</div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const isCorrect = status[idx] === true;

          return (
            <div
              key={q.id}
              className={`p-6 md:px-8 md:py-6 rounded-2xl border transition-all shadow-sm w-full
              ${
                isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md"
              }`}
            >
              <div className="flex justify-between items-start mb-4 flex-col md:flex-row md:items-center gap-2">
                <div>
                  <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
                    Question {q.id}
                  </h3>
                  <span className="inline-block mt-1 text-sm bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 px-3 py-1 rounded-full font-medium shadow-sm">
                    {q.topic}
                  </span>
                </div>

                {status[idx] !== null && (
                  <span
                    className={`text-sm font-semibold px-4 py-2 rounded-2xl shadow-md mt-2 md:mt-0 transition-transform duration-200
                    ${
                      isCorrect
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white animate-shake hover:scale-105"
                    }`}
                  >
                    {isCorrect ? "✅ Correct" : "❌ Incorrect!"}
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-3 w-full">
                <input
                  type="text"
                  value={flags[idx]}
                  disabled={isCorrect}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  placeholder="Enter your flag..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 transition w-full"
                />

                <button
                  disabled={isCorrect}
                  onClick={() => checkFlag(idx)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all w-full md:w-auto
                  ${
                    isCorrect
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white hover:scale-105 transform shadow-lg"
                  }`}
                >
                  Submit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {solvedCount === questions.length && (
        <div className="mt-10 p-6 md:px-8 md:py-6 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-2xl text-center shadow-md w-full">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
            🎉 Lab Completed!
          </h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            All flags solved. Move to the next challenge.
          </p>
        </div>
      )}
    </div>
  );
}