import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import logo from './ubclogo.png';
import './App.css'; // Import the CSS file

import publicTable from './components/publicTable';
import trackSample from './components/trackSample';

function App() {
  return (
    <Router>
      <div className="logoBackground">
        <img src={logo} alt="Logo" style={{ height: '160px' }} />
      </div>
      <div className="buttonBar">
        <Link to="/" className='navbutton'>Home</Link>
        <Link to="/Public" className='navbutton'>View Samples</Link>
        <Link to="/Track" className='navbutton'>Track Specific Sample</Link>
      </div>
      <Switch> 
        <Route exact path="/"/>
        <Route path="/Public" element={<publicTable/>}/>
        <Route path="/Track" element={<trackSample/>}/>
      </Switch>
    </Router>
  );
}


export default App;
