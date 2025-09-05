
function Results({ answers = [], questions = [], onRestart, highScores = {} }){
  const correct = answers.filter((a,i)=> a!==null && a===questions[i]?.correct_answer).length;
  const total = questions.length;

  const HIST_KEY = "quiz_history_v1";
  const history = useMemo(()=>{
    try {
      const raw = localStorage.getItem(HIST_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const next = [...arr, { date: new Date().toISOString(), score: correct, total }].slice(-20);
      localStorage.setItem(HIST_KEY, JSON.stringify(next));
      return next;
    } catch { return []; }
  }, []);

  const chartData = history.map((h, idx)=> ({ name: (idx+1).toString(), score: h.score }));

  return (
    <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Completed 🎉</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">Score: <strong>{correct}</strong> / {total}</p>

      <div className="mb-6">
        <button onClick={onRestart} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Restart</button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Performance (last {chartData.length} runs)</h3>
        <div style={{width:"100%", height:160}}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-left space-y-2">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100">Review</h4>
        {questions.map((q, idx)=>(
          <div key={idx} className={`p-3 rounded ${answers[idx]===q.correct_answer ? 'bg-green-50 dark:bg-green-800' : 'bg-red-50 dark:bg-red-800'}`}>
            <p className="font-medium">{q.question}</p>
            <p className="text-sm">Your answer: <strong>{answers[idx]??'— (timed out)'}</strong></p>
            {answers[idx] !== q.correct_answer && <p className="text-sm">Correct: <strong>{q.correct_answer}</strong></p>}
          </div>
        ))}
      </div>
    </motion.div>
  );
}