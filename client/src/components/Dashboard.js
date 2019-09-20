import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Dashboard extends Component {
  static propTypes = {
    prop: PropTypes
  };

  render() {
    return (
      <div className='dashboard-container'>
        <button
          onClick={() => {
            console.log('clicked');
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
