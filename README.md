# Quiz App (React)
A responsive Quiz App built with React functional components, Hooks, Tailwind CSS and React Router. 
It supports fetching from Open Trivia DB with a local JSON fallback, per-question timer, progress, 
results page and persistent high scores in localStorage.

## Features
- One question at a time with 4 options
- Next / Previous / Submit
- Prevent progressing without selecting (Skip optional)
- Score tracking and Results summary
- Timer per question (30s) - auto-locks when time runs out
- Progress indicator and progress bar
- Persist high score in localStorage
- Basic accessibility (keyboard navigation, ARIA labels)

## Quick start
```bash
npm create vite@latest quiz-app -- --template react
cd quiz-app
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```