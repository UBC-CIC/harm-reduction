import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css'; 

import NavBar from './components/navbar.js'
import PublicTable from './pages/publictable.js';
import TrackSample from './pages/tracksample.js';
import Home from './pages/home.js';
import Admin from './pages/admin.js';
import DisplayContact from './pages/displaycontact.js';
import EditContact from './pages/editcontact.js'
import VerifyContact from './pages/verifycontact.js';
import Sample from './pages/sample.js';
import AdminSample from './pages/adminsample.js';
import AdminTable from './pages/admintable.js';


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
          <Route path="/Contact/Display" element={<DisplayContact />}/>
          <Route path="/Contact/Edit" element={<EditContact />}/>
          <Route path="/Contact/Verify" element={<VerifyContact />}/>
          <Route path="/Track/Sample" element={<Sample />}/>
          <Route path="/Admin/Sample" element={<AdminSample />}/>
          <Route path="/Admin/Table" element={<AdminTable />}/>
        </Switch>
      </Router>
    </div>
  );
}


export default App;
