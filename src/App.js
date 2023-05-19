import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
// import Link from '@mui/material/Link';
import logo from './ubclogo.png';
import './App.css'; // Import the CSS file

import navBar from './components/navbar'
import publicTable from './pages/publicTable';
import trackSample from './pages/trackSample';

function App() {
  return (
    <div>
      <Router>
        <navBar />

      </Router>
    </div>
  );
}


export default App;
