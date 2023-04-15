import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import { auth } from 'fbase';

function Routing() {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  return (
    <Router>
      <Routes>
        {currentUser ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route
            path="/"
            element={
              <Auth currentUser={currentUser} setCurrentUser={setCurrentUser} />
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default Routing;
