import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddEditJob from './components/AddEditJob';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import PrivateRoute from './components/PrivateRoute';

store.dispatch(loadUser());
function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <Router>
          <Navbar />
          <Switch>
            <PrivateRoute path='/' exact component={Dashboard} />
            <PrivateRoute path='/jobs/new' exact component={AddEditJob} />
            <PrivateRoute path='/jobs/:id' exact component={AddEditJob} />
            <Route path='/login' component={Login} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
