import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Lobby from './pages/Lobby';
import CodeBlockPage from './pages/CodeBlockPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Lobby />} />
          <Route path='codeblock/:id' element={<CodeBlockPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}


