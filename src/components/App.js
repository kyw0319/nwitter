import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Routing from 'components/Routing';
import { authService } from 'fbase'; //fbase는 내가 만든 파일이름.

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <Routing isLoggedIn={isLoggedIn} />;
}

export default App;
