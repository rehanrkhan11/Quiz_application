
const LOCAL_KEY = "quiz_highscores_v2";

function App() {
  const all = questionsData || {};
  const [difficulty, setDifficulty] = useState("easy");
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [perQuestionSeconds, setPerQuestionSeconds] = useState(30);

  const questions = useMemo(() => {
    if (difficulty === "all") {
      return [...(all.easy||[]), ...(all.medium||[]), ...(all.hard||[])];
    }
    return all[difficulty] || [];
  }, [all, difficulty]);

  const total = questions.length;

  const loadHigh = () => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const [highScores, setHighScores] = useState(loadHigh());

  const saveHigh = (key, val) => {
    setHighScores(prev => {
      const next = {...prev, [key]: Math.max(prev[key]||0, val)};
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(next)); } catch{}
      return next;
    });
  };

  const start = () => {
    if (questions.length === 0) return alert("No questions for selected difficulty.");
    setAnswers([]);
    setCurrentIdx(0);
    setStarted(true);
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => [...prev, answer === undefined ? null : answer]);
    if (currentIdx < total - 1) setCurrentIdx(i => i + 1);
    else setCurrentIdx(total); // go to results
  };

  const restart = () => {
    setStarted(false);
    setAnswers([]);
    setCurrentIdx(0);
  };

  const progress = total === 0 ? 0 : (currentIdx / total) * 100;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
        <header className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Quiz App</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700 dark:text-gray-300">High: <strong>{highScores[difficulty]??0}</strong></div>
            <button onClick={()=>setDarkMode(d=>!d)} className="p-2 rounded bg-white/70 dark:bg-gray-700/60 glass">
              {darkMode ? "🌞" : "🌙"}
            </button>
          </div>
        </header>

        {!started ? (
          <main className="max-w-3xl mx-auto p-6">
            <section className="glass rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Choose difficulty</h2>
              <div className="flex gap-3 mb-4">
                <button className={`px-4 py-2 rounded ${difficulty==="easy"?"bg-green-500 text-white":"bg-white/60"}`} onClick={()=>setDifficulty("easy")}>Easy</button>
                <button className={`px-4 py-2 rounded ${difficulty==="medium"?"bg-yellow-500 text-white":"bg-white/60"}`} onClick={()=>setDifficulty("medium")}>Medium</button>
                <button className={`px-4 py-2 rounded ${difficulty==="hard"?"bg-red-600 text-white":"bg-white/60"}`} onClick={()=>setDifficulty("hard")}>Hard</button>
                <button className={`px-4 py-2 rounded ${difficulty==="all"?"bg-blue-600 text-white":"bg-white/60"}`} onClick={()=>setDifficulty("all")}>All</button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Time (sec)</span>
                  <input type="number" min="5" max="120" value={perQuestionSeconds} onChange={(e)=>setPerQuestionSeconds(Math.max(5, Number(e.target.value)))} className="mt-2 p-2 rounded" />
                </label>
                <div className="md:col-span-2 flex items-end">
                  <button onClick={start} className="ml-auto px-6 py-3 bg-blue-600 text-white rounded shadow-lg">Start Quiz ({questions.length})</button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">Tip: use keyboard arrows or Tab + Enter to select answers. Progress saved as high score locally.</p>
            </section>
          </main>
        ) : (
          <>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-600 transition-all" style={{width: `${Math.min(progress,100)}%`}} />
            </div>

            <main className="max-w-3xl mx-auto p-6 space-y-4">
              {currentIdx < total ? (
                <QuizPage key={currentIdx} question={questions[currentIdx]} questionIndex={currentIdx} totalQuestions={total} perQuestionSeconds={perQuestionSeconds} onAnswer={handleAnswer} />
              ) : (
                <Results answers={answers} questions={questions} onRestart={()=>{ 
                  const score = answers.filter((a,i)=> a!==null && a===questions[i]?.correct_answer).length;
                  saveHighScore: null;
                  saveHigh(difficulty, score);
                  restart();
                }} highScores={{}} />
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}