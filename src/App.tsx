import React from 'react';
import DepthMenuTree from './components/DepthMenuTree.tsx';
import './App.css';

function App() {
  return (
    <div>
      <header className="header">
        <h1>이폼사인 샘플 양식</h1>
      </header>
      <div className="menu-container">
        <DepthMenuTree />
      </div>
    </div>
  );
}

export default App;