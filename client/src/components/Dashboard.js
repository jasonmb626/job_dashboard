import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Dashboard extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className='dashboard-container'>
        <button
          onClick={() => {
            this.props.history.push('/addJob');
          }}
          className='btn'
        >
          Add Job
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Dashboard);
