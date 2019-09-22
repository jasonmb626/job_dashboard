import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  clearPossibleCompanies,
  addPossibleCompanies
} from '../actions/company';
import {
  getTemplates,
  addJob,
  addAction,
  editJob,
  getJob,
  setField,
  getCoverLetter
} from '../actions/job';
import Spinner from './Spinner';
import moment from 'moment';

class AddEditJob extends Component {
  state = {
    action: '',
    description: '',
    date: Date.now()
  };
  componentDidMount = () => {
    setTimeout(() => this.props.getTemplates(), 1000);
    console.log(this.props.match.params.id);
    if (this.props.match.params.id) {
      this.props.getJob(this.props.match.params.id);
    }
  };

  onBlur = e => {
    this.props.clearPossibleCompanies();
    this.props.addPossibleCompanies(this.props.job.job.company_name);
  };

  internalChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  externalChange = e => {
    if (e.target.name === 'toggle_show_cover_letter') {
      this.props.setField('toggle_show_cover_letter', e.target.checked);
    } else if (e.target.name === 'company_id') {
      this.props.setField(
        'company_name',
        this.props.company.possible_matches.find(
          possible => possible._id === e.target.value
        ).name
      );
    } else if (e.target.name === 'cover_letter_template_select') {
      let cover_letter_template = this.props.job.cover_letters.find(
        cover_letter => cover_letter._id === e.target.value
      ).content;
      let cover_letter = cover_letter_template
        .replace('%JOB_TITLE%', this.props.job.job.title)
        .replace('%COMPANY%', this.props.job.job.company_name)
        .replace('%WHERE_LISTED%', this.props.job.job.where_listed);
      this.props.setField('cover_letter', cover_letter);
      this.props.setField('toggle_show_cover_letter', true);
    } else {
      this.props.setField(e.target.name, e.target.value);
    }
  };

  getCoverLetter = e => {
    e.preventDefault();
    if (this.props.job.job._id === '') {
      alert('Please save first');
    } else {
      getCoverLetter(this.props.job.job._id);
    }
  };

  saveJob = e => {
    e.preventDefault();
    if (!this.props.job.job._id) this.props.addJob(this.props.job.job);
    else {
      this.props.addAction(this.props.match.params.id, this.state);
      this.props.editJob(this.props.job.job);
    }
  };
  onSubmit = e => {
    e.preventDefault();
    this.saveJob(e);
    this.props.history.push('/');
  };

  render() {
    if (this.props.match.params.id && this.props.job.jobLoading)
      return <Spinner />;
    return (
      <div className='add-job-container'>
        <form onSubmit={this.onSubmit}>
          <div className='job-details'>
            <div className='job-details-row'>
              <div className='form-group'>
                <label htmlFor='title' className='form-control'>
                  Title
                </label>
                <input
                  list='common-job-titles'
                  name='title'
                  id='title'
                  className='form-control'
                  onChange={this.externalChange}
                  value={this.props.job.job.title}
                />
                <datalist id='common-job-titles'>
                  <option value='Web Developer' />
                  <option value='Software Engineer' />
                </datalist>
              </div>
              <div className='form-group'>
                <label htmlFor='company' className='form-control'>
                  Company
                </label>
                <input
                  type='text'
                  name='company_name'
                  id='company'
                  className='form-control'
                  onBlur={this.onBlur}
                  onChange={this.externalChange}
                  value={this.props.job.job.company_name}
                />
              </div>
            </div>
            <div className='job-details-row'>
              <div className='form-group'>
                <label htmlFor='where-listed' className='form-control'>
                  Where Listed
                </label>
                <input
                  list='where-listings'
                  name='where_listed'
                  className='form-control'
                  onChange={this.externalChange}
                  value={this.props.job.job.where_listed}
                />
                <datalist id='where-listings'>
                  <option value='LinkedIn' />
                  <option value='Indeed' />
                  <option value='their company site' />
                </datalist>
              </div>
              <div className='form-group'>
                <label htmlFor='company-matches' className='form-control'>
                  Possible Company Matches
                </label>
                <select
                  name='company_id'
                  id='company_id'
                  className='form-control'
                  onChange={this.externalChange}
                  value={this.props.job.job.company_id}
                >
                  {this.props.company.possible_matches.length > 0 && (
                    <option key={0} value={0}>
                      &lt;Possible Options&gt;
                    </option>
                  )}
                  {[...this.props.company.possible_matches].map(
                    (company, i) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            <input
              type='checkbox'
              name='toggle_show_cover_letter'
              id='toggle_show_cover_letter'
              onChange={this.externalChange}
              checked={this.props.job.job.toggle_show_cover_letter}
            />
            <span>Cover Letter Area</span>
            <button className='btn' onClick={this.getCoverLetter}>
              Download Coverletter
            </button>
            <div className='job-details-row mt-1'>
              <span>Followup Date</span>
              <input
                type='date'
                id='follow_up'
                name='follow_up'
                onChange={this.externalChange}
                value={this.props.job.job.follow_up}
              />
              <div className='form-group'>
                <label
                  htmlFor='cover-letter-templates'
                  className='form-control'
                >
                  Cover Letter Templates
                </label>
                <select
                  name='cover_letter_template_select'
                  id='cover_letter_template_select'
                  className='form-control'
                  onChange={this.externalChange}
                >
                  <option value='0'>&lt;Choose&gt;</option>
                  {this.props.job.cover_letters.map(cover_letter => (
                    <option
                      key={cover_letter._id}
                      onChange={this.externalChange}
                      value={cover_letter._id}
                    >
                      {cover_letter.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='cover-letter-container'>
              <textarea
                name='cover-letter'
                onChange={this.externalChange}
                value={this.props.job.job.cover_letter}
              />
            </div>
            <div className='job-details-row mt-1'>
              <table id='history'>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th className='action-description'>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        list='actions'
                        onChange={this.internalChange}
                        value={this.state.action}
                        name='action'
                        id='action'
                      />
                      <datalist id='actions'>
                        <option>Emailed</option>
                        <option>Called</option>
                        <option>Job Closed</option>
                      </datalist>
                    </td>
                    <td className='action-description'>
                      <input
                        type='text'
                        onChange={this.internalChange}
                        value={this.state.description}
                        name='description'
                        id='description'
                      />
                    </td>
                    <td>
                      <input
                        type='date'
                        onChange={this.internalChange}
                        value={moment(this.state.date).format('YYYY-MM-DD')}
                        name='date'
                        id='date'
                      />
                    </td>
                  </tr>
                  {this.props.job.job.history.map(action => (
                    <tr key={action._id}>
                      <td>{action.action}</td>
                      <td className='action-description'>
                        {action.description}
                      </td>
                      <td>{moment(action.date).format('ddd, MMM DD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='job-details-row mt-1'>
              <input type='submit' value='Submit' className='btn' />
              <button className='btn' onClick={this.saveJob}>
                Save
              </button>
              <button
                className='btn'
                onClick={() => this.props.history.push('/')}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

AddEditJob.propTypes = {
  company: PropTypes.object.isRequired,
  job: PropTypes.object.isRequired,
  clearPossibleCompanies: PropTypes.func.isRequired,
  addPossibleCompanies: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  company: state.company,
  job: state.job
});

export default connect(
  mapStateToProps,
  {
    clearPossibleCompanies,
    addPossibleCompanies,
    getTemplates,
    addJob,
    editJob,
    getJob,
    setField,
    addAction
  }
)(AddEditJob);
