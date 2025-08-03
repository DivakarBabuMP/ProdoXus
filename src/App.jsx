import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Home from './Home';
import About from './About';
import Access from './Access';
import Inbox from './Inbox';
import Header from './Header';
import Security from './Security'; 

function App() {
  const location = useLocation();
  const hideHeader = location.pathname === '/inbox';

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/access" element={<Access />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/security" element={<Security />} /> 
      </Routes>
    </>
  );
}

export default App;

