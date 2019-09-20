const express = require('express');
const Company = require('../models/Company');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(express.json());

router.get('/', auth, (req, res) => {
  Company.find()
    .then(companies => res.json(companies))
    .catch(err => res.status(500).json({ msg: err }));
});

router.get('/:id', auth, (req, res) => {
  Company.findById(req.params.id)
    .then(company => res.json(company))
    .catch(err => res.status(500).json({ msg: err }));
});

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
