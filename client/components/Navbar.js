import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = props => {
  return (
    <div className='navbar'>
      <Link to='/' className='navbar-brand' />
      <button className='navbar-toggler' data-target='nav-collapse'></button>
    </div>
  );
};

Navbar.propTypes = {};

export default Navbar;
