import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './home/Home';
import Pay from './transaction/Pay';
import Transaction from './transaction/Transaction';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
