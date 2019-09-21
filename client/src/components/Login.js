import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { login } from '../actions/auth';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class Login extends Component {
  state = {
    login: '',
    password: ''
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    company: PropTypes.object.isRequired
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.login, this.state.password);
  };

  render() {
    return this.props.auth.isAuthenticated ? (
      <Redirect to='/' />
    ) : (
      <div className='login-container'>
        <form onSubmit={this.onSubmit}>
          <div className='form-group'>
            <label htmlFor='login' className='form-control'>
              Login
            </label>
            <input
              type='text'
              name='login'
              id='login'
              className='form-control'
              onChange={this.onChange}
              value={this.state.login}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password' className='form-control'>
              Password
            </label>
            <input
              type='password'
              name='password'
              id='password'
              className='form-control'
              onChange={this.onChange}
              value={this.state.password}
            />
          </div>
          <input type='submit' className='btn' value='Login' />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  company: state.company
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
