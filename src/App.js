import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Box } from '@mui/material';
import './app.css'; 

import logo from './ubclogo.png'
import NavBar from './components/navbar.js'
import PublicTable from './pages/publictable.js';
import TrackSample from './pages/tracksample.js';
import Home from './pages/home.js';
import Admin from './pages/admin.js';
import Sample from './pages/sample.js';
import AdminSample from './pages/adminsample.js';
import AdminTable from './pages/admintable.js';


function App() {
  return (
    <Box>
      <div className="logoBackground">
          <img src={logo} alt="Logo" style={{ height: '160px' }} />
      </div>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/Track/Sample"><Sample /></Route>
          <Route path="/Admin/Sample"><AdminSample /></Route>
          <Route path="/Admin/Table"><AdminTable /></Route>
          <Route path="/Home"><Home /></Route>
          <Route path="/Table"><PublicTable /></Route>
          <Route path="/Track"><TrackSample /></Route>
          <Route path="/Admin"><Admin /></Route>
        </Switch>
      </Router>
    </Box>
  );
}

export default App;
