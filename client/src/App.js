import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className='bg-black'>
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
