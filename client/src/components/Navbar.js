import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import moment from 'moment';

class Navbar extends Component {
  componentDidMount() {
    console.log(this);
  }
  render() {
    return (
      <div className='navbar'>
        <div className='container'>
          <Link to='/' className='navbar-brand'>
            Job Dashboard
          </Link>
          {this.props.auth.isAuthenticated && (
            <>
              <span>
                <Link to='/jobs/new' className='btn mr-1'>
                  Add Job
                </Link>
                Applied Today
                <span className='badge'>
                  {
                    this.props.job.jobs.filter(
                      job =>
                        moment(job.date).format('YYYY-MM-DD') ===
                          moment(Date.now()).format('YYYY-MM-DD') &&
                        job.finished_applying
                    ).length
                  }
                </span>
              </span>
              <button className='link-btn' onClick={this.props.logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  job: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  job: state.job
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
