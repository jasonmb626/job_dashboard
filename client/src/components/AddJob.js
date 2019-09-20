import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AddJob extends Component {
  state = {
    id: '',
    title: '',
    company_name: '',
    company_id: null,
    where_listed: '',
    history: []
  };

  static propTypes = {
    prop: PropTypes
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
                  name='company'
                  id='company'
                  className='form-control'
                  onChange={this.onChange}
                  value={this.company_name}
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
                  <option value='Company Site' />
                </datalist>
              </div>
              <div className='form-group'>
                <label htmlFor='company-matches' className='form-control'>
                  Possible Company Matches
                </label>
                <select
                  name='company_matches'
                  className='form-control'
                ></select>
              </div>
            </div>
            <div className='cover-letter-container'>
              <textarea name='cover-letter' />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
