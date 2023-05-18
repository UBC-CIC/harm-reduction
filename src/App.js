import React from 'react';
import logo from './ubclogo.png';

function App() {
  return (
    <>
      <div>
        {/* First div at the top */}
        <h2>This is the top div</h2>
        <img src={logo} alt="Logo" style={{ width: '200px' }} />
        {/* Add content for the first div */}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {/* Second div below the first div */}
        <h2>This is the bottom div</h2>
        <button style={{ margin: '10px' }}>Button 1</button>
        <button style={{ margin: '10px' }}>Button 2</button>
        <button style={{ margin: '10px' }}>Button 3</button>
      </div>
      <h1>Welcome to My React Homepage!</h1>
      {/* Add your components and content here */}
    </>
  );
}

export default App;
