import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getJobs, getCoverLetter } from '../actions/job';
import moment from 'moment';
import Spinner from './Spinner';

class Dashboard extends Component {
  state = {
    add_jobs: false
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  };

  downloadCoverLetter = id => {
    getCoverLetter(id);
  };

  componentDidMount() {
    this.props.getJobs();
  }
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  render() {
    if (this.props.job.jobsLoading) return (<Spinner />);
    return (
      <div className='dashboard-container'>
        <table id='jobs'>
          <thead>
            <tr>
              <th colSpan='5'>Follow up today</th>
            </tr>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Applied</th>
              <th>Follow Up</th>
              <th>&darr;</th>
            </tr>
          </thead>
          <tbody>
            {this.props.job.jobs
              .filter(job => new Date(job.follow_up).valueOf() <= Date.now())
              .map(
                job =>
                  job.still_open && (
                    <tr key={job._id}>
                      <td>
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </td>
                      <td>{job.company_name}</td>
                      <td>{moment(job.date).format('ddd, MMM DD')}</td>
                      <td>
                        {moment(job.follow_up).format('ddd, MMM DD')}
                      </td>
                      <td>
                        <button
                          onClick={() => this.downloadCoverLetter(job._id)}
                        >
                          &darr;
                        </button>
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>
        <table id='jobs'>
          <thead>
            <tr>
              <th colSpan='6'>Remaining Open jobs</th>
            </tr>
            <tr>
              <th>
                <span>All?</span>
                <input
                  type='checkbox'
                  name='all_jobs'
                  onChange={this.onChange}
                  value={this.state.all_jobs}
                />
                Title
              </th>
              <th>Company</th>
              <th>Applied</th>
              <th>Still Open?</th>
              <th>Follow Up</th>
              <th>&darr;</th>
            </tr>
          </thead>
          <tbody>
            {this.props.job.jobs
              .filter(
                job =>
                  new Date(job.follow_up).valueOf() > Date.now() ||
                  !job.still_open
              )
              .map(
                job =>
                  (job.still_open || this.state.all_jobs) && (
                    <tr key={job._id}>
                      <td>
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </td>
                      <td>{job.company_name}</td>
                      <td>{moment(job.date).format('ddd, MMM DD')}</td>
                      <td>{job.still_open ? 'Yes' : 'No'}</td>
                      <td>
                        {moment(job.follow_up)
                          .add(1, 'day')
                          .format('ddd, MMM DD')}
                      </td>
                      <td>
                        <button
                          onClick={() => this.downloadCoverLetter(job._id)}
                        >
                          &darr;
                        </button>
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  job: state.job
});

export default connect(
  mapStateToProps,
  { getJobs }
)(Dashboard);
