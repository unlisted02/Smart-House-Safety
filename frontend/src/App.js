// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Devices from './components/Devices';
import ParentalControl from './components/ParentalControl';
import UserDetails from './components/UserDetails';
import UpdateUser from './components/UpdateUser';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '20px', marginLeft: '240px' }}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/devices" component={Devices} />
            <Route path="/parental-controls" component={ParentalControl} />
            <Route path="/user-details" component={UserDetails} />
            <Route path="/update-user" component={UpdateUser} />
            <Route path="/login" component={Login} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
