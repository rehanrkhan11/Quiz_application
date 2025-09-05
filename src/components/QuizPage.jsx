
function shuffleArray(arr){ return [...arr].sort(()=>Math.random()-0.5); }

function QuizPage({ question, questionIndex, totalQuestions, perQuestionSeconds=30, onAnswer }){
  const [shuffled, setShuffled] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [timeLeft, setTimeLeft] = useState(perQuestionSeconds);
  const timerRef = useRef(null);
  const answersRef = useRef([]);

  useEffect(()=>{
    const list = shuffleArray([question.correct_answer, ...(question.incorrect_answers||[])]);
    setShuffled(list);
    setSelectedIdx(null);
    setTimeLeft(perQuestionSeconds);
    setTimeout(()=>{ if(answersRef.current[0]) answersRef.current[0].focus(); }, 50);
    return ()=> clearInterval(timerRef.current);
  }, [question, perQuestionSeconds]);

  useEffect(()=>{
    clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){
          clearInterval(timerRef.current);
          handleSelect(null, true);
          return 0;
        }
        return t-1;
      });
    },1000);
    return ()=> clearInterval(timerRef.current);
  }, [shuffled]);

  const handleSelect = useCallback((answer, isTimeout=false)=>{
    if(selectedIdx !== null) return;
    if(!isTimeout){
      const idx = shuffled.indexOf(answer);
      setSelectedIdx(idx);
    } else setSelectedIdx(-1);
    setTimeout(()=> onAnswer(answer), 700);
  }, [onAnswer, shuffled, selectedIdx]);

  const onKeyDown = (e)=>{
    const focusIndex = answersRef.current.findIndex(el=> el===document.activeElement);
    if(e.key==="ArrowDown"||e.key==="ArrowRight"){ e.preventDefault(); const next=Math.min(focusIndex+1, shuffled.length-1); answersRef.current[next]?.focus(); }
    else if(e.key==="ArrowUp"||e.key==="ArrowLeft"){ e.preventDefault(); const prev=Math.max(focusIndex-1,0); answersRef.current[prev]?.focus(); }
    else if((e.key==="Enter"||e.key===" ") && focusIndex>=0){ e.preventDefault(); handleSelect(shuffled[focusIndex]); }
  };

  const pct = Math.round((timeLeft / perQuestionSeconds) * 100);

  return (
    <motion.article initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" onKeyDown={onKeyDown}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Question {questionIndex+1} / {totalQuestions}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{question.category||""}</p>
        </div>

        <div className="flex flex-col items-center">
          <svg className="w-12 h-12" viewBox="0 0 36 36" aria-hidden>
            <circle cx="18" cy="18" r="15" className="text-gray-200" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle cx="18" cy="18" r="15" className="text-blue-500" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="100" strokeDashoffset={100-pct} />
          </svg>
          <div className="text-xs mt-1 text-gray-700 dark:text-gray-200" aria-live="polite">{timeLeft}s</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800 dark:text-gray-100">{question.question}</p>
      </div>

      <div className="grid gap-3">
        {shuffled.map((answer, idx)=>{
          const isSelected = selectedIdx === idx;
          const isCorrect = answer === question.correct_answer;
          const base = "w-full text-left p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition transform active:scale-95";
          const stateCls = selectedIdx === null ? "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600" : isSelected ? (isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white") : "opacity-70";
          return (
            <button key={idx} ref={el=>answersRef.current[idx]=el} onClick={()=>handleSelect(answer)} disabled={selectedIdx!==null} tabIndex={0} aria-pressed={isSelected} className={`${base} ${stateCls}`}>
              {answer}
            </button>
          );
        })}
      </div>
    </motion.article>
  );
}