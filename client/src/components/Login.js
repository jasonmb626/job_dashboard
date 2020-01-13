import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { login, register } from '../actions/auth';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class Login extends Component {
  state = {
    name: '',
    login: '',
    password: '',
    confirmPassword: '',
    registerMode: false
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
    if (this.state.registerMode) {
      if (this.state.name.length < 1) {
        alert('Name must have at least 1 character.')
        return;
      }
      if (this.state.login.length < 1) {
        alert('Login must have at least 1 character.')
        return;
      }
      if (this.state.password.length < 8) {
        alert('Passwords must have at least 8 characters.')
        return;
      }
      if (this.state.password !== this.state.confirmPassword) {
        alert('Passwords do not match.')
        return;
      }
      this.props.register(this.state.name, this.state.login, this.state.password);
    } else {
      this.props.login(this.state.login, this.state.password);
    }
  };

  render() {
    return this.props.auth.isAuthenticated ? (
      <Redirect to='/' />
    ) : (
      <div className='login-container'>
        <form onSubmit={this.onSubmit}>
          {this.state.registerMode && (
          <div className='form-group'>
            <label htmlFor='name' className='form-control'>
              Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              className='form-control'
              onChange={this.onChange}
              value={this.state.name}
            />
          </div>)}
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
          {this.state.registerMode && (
          <div className='form-group'>
            <label htmlFor='confirmPassword' className='form-control'>
              Confirm Password
            </label>
            <input
              type='password'
              name='confirmPassword'
              id='confirmPassword'
              className='form-control'
              onChange={this.onChange}
              value={this.state.confirmPassword}
            />
          </div>)}
          <input type='submit' className='btn' name='login' value={this.state.registerMode ? 'Register' : 'Login'} />
          <button type="button" className='switch' onClick={() => this.setState({registerMode: !this.state.registerMode})}>{this.state.registerMode ? 'Switch to Login Mode' : 'Switch to Register Mode'}</button>
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
  { login, register }
)(Login);
