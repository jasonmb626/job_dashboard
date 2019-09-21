import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  clearPossibleCompanies,
  addPossibleCompanies
} from '../actions/company';
import { getTemplates, addJob } from '../actions/job';

class AddJob extends Component {
  componentDidMount = () => {
    setTimeout(() => this.props.getTemplates(), 1000);
  };

  state = {
    id: '',
    title: '',
    company_name: '',
    company_id: 0,
    where_listed: '',
    follow_up: '',
    history: [],
    toggle_show_cover_letter: false,
    cover_letter_template_select: 0,
    cover_letter: ''
  };

  onBlur = e => {
    this.props.clearPossibleCompanies();
    this.props.addPossibleCompanies(this.state.company_name);
  };

  onChange = e => {
    if (e.target.name === 'toggle_show_cover_letter') {
      this.setState({ toggle_show_cover_letter: e.target.checked });
    } else {
      this.setState({ [e.target.name]: e.target.value });
      if (e.target.name === 'company_id') {
        this.setState({
          company_name: this.props.company.possible_matches.find(
            possible => possible._id === e.target.value
          ).name
        });
      }
    }
    if (e.target.name === 'cover_letter_template_select') {
      let cover_letter_template = this.props.job.cover_letters.find(
        cover_letter => cover_letter._id === e.target.value
      ).content;
      let cover_letter = cover_letter_template
        .replace('%JOB_TITLE%', this.state.title)
        .replace('%COMPANY%', this.state.company_name)
        .replace('%WHERE_LISTED%', this.state.where_listed);
      this.setState({
        cover_letter: cover_letter,
        toggle_show_cover_letter: true
      });
    }
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.addJob(this.state);
  };

  render() {
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
                  value={this.title}
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
                  value={this.state.company_name}
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
                  value={this.where_listed}
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
                  value={this.state.company_id}
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
              checked={this.state.toggle_show_cover_letter}
            />
            <span>Cover Letter Area</span>
            <div className='job-details-row mt-1'>
              <span>Followup Date</span>
              <input
                type='date'
                id='follow_up'
                name='follow_up'
                onChange={this.onChange}
                value={this.state.follow_up}
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
                  {this.props.job.cover_letters.map(cover_letter => (
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
            <div className='cover-letter-container'>
              <textarea
                name='cover-letter'
                onChange={this.onChange}
                value={this.state.cover_letter}
              />
            </div>
            <div className='job-details-row mt-1'>
              <input type='submit' value='Save' className='btn' />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

AddJob.propTypes = {
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
  { clearPossibleCompanies, addPossibleCompanies, getTemplates, addJob }
)(AddJob);
