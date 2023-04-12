import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';

function Router

export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <Route element={<Home />} />
        ) : (
          <Route element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};
