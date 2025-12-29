// import React from 'react'
import ReactDOM from 'react-dom/client'
import GradingPage from './pages/GradingPage/GradingPage.tsx'
import StudentsTablePage from './pages/StudentsTablePage/StudentsTablePage.tsx'

const params = new URLSearchParams(window.location.search);
const action = params.get('action');

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  if (action === 'grading') {
    // Route: .../view.php?id=955539&action=grading
    root.render(<StudentsTablePage />);
  } else if (action === 'grader') {
    // Route: .../view.php?id=955539&action=grader&userid=355207
    root.render(<GradingPage />);
  }
}
