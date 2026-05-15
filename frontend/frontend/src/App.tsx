import React from 'react';
import './App.css';
import GymAttendance from './components/GetAttendance';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PureGym Attendance App</h1>
      </header>
      <main>
        <GymAttendance />
      </main>
    </div>
  );
};

export default App;