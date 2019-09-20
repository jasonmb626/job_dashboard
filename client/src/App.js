import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddJob from './components/AddJob';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import { useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute';

function App() {
  useEffect(() => store.dispatch(loadUser()), []);
  return (
    <Provider store={store}>
      <div className='App'>
        <Router>
          <Navbar />
          <Switch>
            <PrivateRoute path='/' exact component={Dashboard} />
            <PrivateRoute path='/addJob' exact component={AddJob} />
            <Route path='/login' component={Login} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
