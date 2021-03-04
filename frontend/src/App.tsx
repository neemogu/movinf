import React from 'react';
import logo from './logo.svg';
import './App.css';
import HelloMessage from './HelloMessage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <HelloMessage/>
        </p>
      </header>
    </div>
  );
}

export default App;
