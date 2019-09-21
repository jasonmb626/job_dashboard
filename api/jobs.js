const express = require('express');
const Job = require('../models/Job');
const Company = require('../models/Company');

const auth = require('../middleware/auth');

const router = express.Router();

router.use(express.json());

router.get('/', auth, (req, res) => {
  Job.find()
    .then(jobs => res.json(jobs))
    .catch(err => res.status(500).json({ msg: err }));
});

router.get('/:id', auth, (req, res) => {
  Job.findById(req.params.id)
    .then(job => res.json(job))
    .catch(err => res.status(500).json({ msg: err }));
});

router.post('/', auth, async (req, res) => {
  const {
    title,
    company_name,
    where_listed,
    cover_letter,
    follow_up
  } = req.body;
  let { company_id } = req.body;
  if (company_id === 0) {
    const company = new Company({
      name: company_name
    });
    const newCompany = await company
      .save()
      .catch(err => res.status(500).json({ msg: 'Server Error' }));
    company_id = newCompany._id;
  }
  const job = new Job({
    title,
    company_id,
    where_listed,
    cover_letter,
    follow_up
  });
  console.log(job);
  job
    .save()
    .then(newJob => res.status(201).json(newJob))
    .catch(err => res.status(500).json({ msg: 'Server Error' }));
});

module.exports = router;
