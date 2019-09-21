import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

class Navbar extends Component {
  render() {
    return (
      <div className='navbar'>
        <div className='container'>
          <Link to='/' className='navbar-brand'>
            Job Dashboard
          </Link>
          {this.props.auth.isAuthenticated && (
            <button className='link-btn' onClick={this.props.logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
