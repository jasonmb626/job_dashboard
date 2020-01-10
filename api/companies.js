const express = require('express');
const Company = require('../models/Company');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(express.json());

// @route    GET api/companies
// @desc     Retrieve a list of all companies in Database and send back
// @access   Private //though this is hardly necessary
router.get('/', auth, (req, res) => {
  Company.find()
    .then(companies => res.json(companies))
    .catch(err => res.status(500).json({ msg: err }));
});

// @route    POST api/companies/string/<word>
// @desc     Get all companies who have a partial word match with <word>
// @access   Private //though this is hardly necessary
router.get('/string/:id', auth, (req, res) => {
  Company.find({
    name: new RegExp(req.params.id, 'i')
  })
    .then(companies => res.json(companies))
    .catch(err => res.status(204));
});

// @route    GET api/companies/<id>
// @desc     Get all information about company with <id>
// @access   Private //though this is hardly necessary
router.get('/:id', auth, (req, res) => {
  Company.findById(req.params.id)
    .then(company => res.json(company))
    .catch(err => res.status(500).json({ msg: err }));
});

// @route    POST api/companies/
// @desc     Add a new company to the database
// @access   Private
router.post('/', auth, (req, res) => {
  const { name } = req.body;
  const company = new Company({
    name
  });
  company
    .save()
    .then(newCompany => res.status(201).json(newCompany))
    .catch(err => res.status(500).json({ msg: 'Server Error' }));
});

module.exports = router;