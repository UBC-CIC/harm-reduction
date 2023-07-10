import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Box } from '@mui/material';
import './app.css'; 

import logo from './ubclogo.png'
import { NavBar, MobileNavBar } from './components/navbar.js'
import PublicTable from './pages/publictable.js';
import TrackSample from './pages/tracksample.js';
import Admin from './pages/admin.js';
import About from './pages/about.js';
import Resources from './pages/resource.js'

import { isMobile } from 'react-device-detect'

// const isMobile = true;

function App() {
  return (
    <Box>
      {!isMobile && (<div className="logoBackground">
        <img src={logo} alt="Logo" style={{ height: '160px' }} />
      </div>)}
      <Router>
        {isMobile ? <MobileNavBar/> : <NavBar />}
        <Switch>
          <Route path="/Table"><PublicTable /></Route>
          <Route path="/Track"><TrackSample /></Route>
          <Route path="/Admin"><Admin /></Route>
          <Route path="/Resources"><Resources /></Route>
          <Route path="/"><About /></Route>
        </Switch>
      </Router>
    </Box>
  );
}

export default App;
