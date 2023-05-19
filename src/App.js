import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import Link from '@mui/material/Link';
import logo from './ubclogo.png';
import './App.css'; // Import the CSS file

import NavBar from './components/navbar'
import PublicTable from './pages/publictable';
import TrackSample from './pages/tracksample';
import Home from './pages/home';
import Admin from './pages/admin';
import DisplayContact from './pages/displaycontact';
import EditContact from './pages/editcontact'
import VerifyContact from './pages/verifycontact';
import Sample from './pages/sample';
import AdminSample from './pages/adminsample';
import AdminTable from './pages/admintable';


function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" element={<Home />}/>
          <Route path="/Table" element={<PublicTable />}/>
          <Route path="/Track" element={<TrackSample />}/>
          <Route path="/Admin" element={<Admin />}/>
          <Route path="/DisplayContact" element={<DisplayContact />}/>
          <Route path="/EditContact" element={<EditContact />}/>
          <Route path="/VerifyContact" element={<VerifyContact />}/>
          <Route path="/Sample" element={<Sample />}/>
          <Route path="/AdminSample" element={<AdminSample />}/>
          <Route path="/AdminTable" element={<AdminTable />}/>
        </Switch>
      </Router>
    </div>
  );
}


export default App;
