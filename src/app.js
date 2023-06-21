import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Box } from '@mui/material';
import './app.css'; 

import logo from './ubclogo.png'
import { NavBar, MobileNavBar } from './components/navbar.js'
import PublicTable from './pages/publictable.js';
import TrackSample from './pages/tracksample.js';
import Home from './pages/home.js';
import Admin from './pages/admin.js';
import About from './pages/about.js';

// import { isMobile } from 'react-device-detect'

function App() {
  const isMobile = true;
  return (
    <Box>
      {!isMobile && (<div className="logoBackground">
        <img src={logo} alt="Logo" style={{ height: '160px' }} />
      </div>)}
      <Router>
        {isMobile ? <MobileNavBar /> : <NavBar />}
        <Switch>
          <Route path="/Table"><PublicTable /></Route>
          <Route path="/Track"><TrackSample /></Route>
          <Route path="/Admin"><Admin /></Route>
          <Route path="/About"><About /></Route>
          <Route path="/"><Home /></Route>
        </Switch>
      </Router>
    </Box>
  );
}

export default App;
