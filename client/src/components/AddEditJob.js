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
  clearJob,
  addAction,
  addHiringManager,
  editJob,
  getJob,
  getJobs,
  setField,
  getCoverLetter,
  updateHiringManager
} from '../actions/job';
import Spinner from './Spinner';
import moment from 'moment';

class AddEditJob extends Component {
  componentDidMount = () => {
    this.props.getJobs();
    setTimeout(() => this.props.getTemplates(), 1000);
    if (this.props.match.params.id) {
      this.props.getJob(this.props.match.params.id);
    } else {
      this.props.clearJob(); //this should be unnecessary but to be safe.
    }
  };

  onBlur = e => {
    this.props.clearPossibleCompanies();
    this.props.addPossibleCompanies(this.props.job.job.company_name);
  };

  onChange = e => {
    if (e.target.type === 'checkbox') {
      this.props.setField(e.target.name, e.target.checked);
    } else if (e.target.name === 'company_id') {
      this.props.setField(
        'company_name',
        this.props.company.possible_matches.find(
          possible => possible._id === e.target.value
        ).name
      );
    } else if (e.target.name === 'cover_letter_template_select') {
      let cover_letter_template = this.props.job.templates.find(
        cover_letter => cover_letter._id === e.target.value
      ).content;
      let cover_letter = cover_letter_template
        .replace(/%JOB_TITLE%/g, this.props.job.job.title)
        .replace(/%COMPANY%/g, this.props.job.job.company_name)
        .replace(/%WHERE_LISTED%/g, this.props.job.job.where_listed);
      this.props.setField('cover_letter', cover_letter);
      this.props.setField('toggle_show_cover_letter', true);
    } else {
      this.props.setField(e.target.name, e.target.value);
    }
  };

  changeHiringManager = (id, e) => {
    console.log(`${e.target.name} ${id}`);
    this.props.updateHiringManager(id, e.target.name, e.target.value);
  };

  getCoverLetter = e => {
    e.preventDefault();
    if (this.props.job.job._id === '') {
      alert('Please save first');
    } else {
      getCoverLetter(this.props.job.job._id);
    }
  };

  saveJob = (e, redirecting = false) => {
    e.preventDefault();
    if (!this.props.job.job._id) return this.props.addJob(this.props.job.job);
    else {
      return this.props.editJob(this.props.job.job);
    }
  };

  onSubmit = e => {
    e.preventDefault();
    if (!this.props.job.job.finished_applying) {
      if (window.confirm('Mark job applied?')) {
        this.props.setField('finished_applying', true);
      }
    }
    this.saveJob(e, true).then(() => {
      this.props.clearJob();
      this.props.history.push('/');
    });
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
                  onChange={this.onChange}
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
                  onChange={this.onChange}
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
                  onChange={this.onChange}
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
                  onChange={this.onChange}
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
              onChange={this.onChange}
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
                onChange={this.onChange}
                value={moment(this.props.job.job.follow_up).format(
                  'YYYY-MM-DD'
                )}
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
                  onChange={this.onChange}
                >
                  <option value='0'>&lt;Choose&gt;</option>
                  {this.props.job.templates
                    .filter(template => template.type === 'cover-letter')
                    .map(cover_letter => (
                      <option
                        key={cover_letter._id}
                        onChange={this.onChange}
                        value={cover_letter._id}
                      >
                        {cover_letter.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <table id='hiring_manager'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  <th>LinkedIn</th>
                  <th>Email</th>
                  <th>Phone #</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type='text'
                      name='hiring_manager_name'
                      id='hiring_manager_name'
                      onChange={this.changeHiringManager.bind(this, null)}
                      value={this.props.job.job.hiring_manager_name}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      name='hiring_manager_title'
                      id='hiring_manager_title'
                      onChange={this.changeHiringManager.bind(this, null)}
                      value={this.props.job.job.hiring_manager_title}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      name='hiring_manager_contact_linkedin'
                      id='hiring_manager_contact_linkedin'
                      onChange={this.changeHiringManager.bind(this, null)}
                      value={this.props.job.job.hiring_manager_contact_linkedin}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      name='hiring_manager_contact_email'
                      id='hiring_manager_contact_email'
                      onChange={this.changeHiringManager.bind(this, null)}
                      value={this.props.job.job.hiring_manager_contact_email}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      name='hiring_manager_contact_phone'
                      id='hiring_manager_contact_phone'
                      onChange={this.changeHiringManager.bind(this, null)}
                      value={this.props.job.job.hiring_manager_contact_phone}
                    />
                  </td>
                </tr>
                {this.props.job.job.hiring_managers.map(manager => (
                  <tr key={manager._id}>
                    <td>
                      <input
                        type='text'
                        name='hiring_manager_name'
                        value={manager.name}
                        onChange={this.changeHiringManager.bind(
                          this,
                          manager._id
                        )}
                      />
                    </td>
                    <td>
                      <input
                        type='text'
                        name='hiring_manager_title'
                        value={manager.title}
                        onChange={this.changeHiringManager.bind(
                          this,
                          manager._id
                        )}
                      />
                    </td>
                    <td>
                      <input
                        type='text'
                        name='hiring_manager_contact_linkedin'
                        value={manager.contact_linkedin}
                        onChange={this.changeHiringManager.bind(
                          this,
                          manager._id
                        )}
                      />
                    </td>
                    <td>
                      <input
                        type='text'
                        name='hiring_manager_contact_email'
                        value={manager.contact_email}
                        onChange={this.changeHiringManager.bind(
                          this,
                          manager._id
                        )}
                      />
                    </td>
                    <td>
                      <input
                        type='text'
                        name='hiring_manager_contact_phone'
                        value={manager.contact_phone}
                        onChange={this.changeHiringManager.bind(
                          this,
                          manager._id
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='cover-letter-container'>
              <textarea
                name='cover_letter'
                onChange={this.onChange}
                value={this.props.job.job.cover_letter}
              />
            </div>
            <div className='job-details-row mt-1'>
              <table id='action'>
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
                        onChange={this.onChange}
                        value={this.props.job.job.action_name}
                        id='action_name'
                        name='action_name'
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
                        onChange={this.onChange}
                        value={this.props.job.job.action_description}
                        id='action_description'
                        name='action_description'
                      />
                    </td>
                    <td>
                      <input
                        type='date'
                        onChange={this.onChange}
                        value={moment(this.props.job.job.action_date).format(
                          'YYYY-MM-DD'
                        )}
                        id='action_date'
                        name='action_date'
                      />
                    </td>
                  </tr>
                  {this.props.job.job.actions.map(action => (
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
              <div className='form-group'>
                <label htmlFor='finished_applying' className='form-control'>
                  Finished Applying?
                </label>
                <input
                  type='checkbox'
                  name='finished_applying'
                  id='finished_applying'
                  checked={this.props.job.job.finished_applying}
                  onChange={this.onChange}
                />
              </div>
              <input type='submit' value='Save & Return' className='btn' />
              <button className='btn' onClick={this.saveJob}>
                Save
              </button>
              <button
                className='btn'
                onClick={e => {
                  e.preventDefault();
                  this.props.history.push('/');
                }}
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
    addHiringManager,
    clearJob,
    editJob,
    getJob,
    getJobs,
    setField,
    addAction,
    updateHiringManager
  }
)(AddEditJob);
