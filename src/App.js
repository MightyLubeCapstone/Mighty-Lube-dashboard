// This is the main entry point of the application
// It sets up the routing and imports global styles. This should remain fairly simple, import functions into here so they are used when running the app
// The export App allows index.js to use our functions and styles. For sake of simplicity, keep functions in their own files, and import them here. This will allow us to keep the code clean and organized

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Assets/styles/main.css';
import Login from './Pages/Login.js';
import Dashboard from './Pages/Dashboard.js';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
