import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppHeader from './components/app-header';
import LaunchOverview from './components/launch-overview';

function App() {
  return (
    <div className="App">
      <AppHeader title='Space Launch Schedule'></AppHeader>
      <LaunchOverview></LaunchOverview>
    </div>
  );
}

export default App;
