const express = require('express');
const Job = require('../models/Job');
const Company = require('../models/Company');
const uuid = require('uuid');
const generatePDF = require('../generatePDF');

const auth = require('../middleware/auth');

const router = express.Router();

router.use(express.json());

router.get('/', auth, (req, res) => {
  Job.find()
    .populate('company', 'name -_id')
    .then(jobs => res.json(jobs))
    .catch(err => res.status(500).json({ msg: err }));
});

router.get('/:id/cover_letter', async (req, res) => {
  const job = await Job.findById(req.params.id).catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
  console.log(`Getting cover letter ${req.params.id}`);
  generatePDF(job.cover_letter, req.params.id, res);
});

router.get('/:id', auth, (req, res) => {
  Job.findById(req.params.id)
    .populate('company', 'name -_id')
    .then(job => {
      res.json(job);
    })
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
  let company = await Company.findOne({ name: company_name });
  if (!company) {
    const newCompany = new Company({
      name: company_name
    });
    company = await newCompany
      .save()
      .catch(err => res.status(500).json({ msg: 'Server Error' }));
  }
  company_id = company._id;
  console.log(company_id);
  const job = new Job({
    title,
    company: company_id,
    where_listed,
    cover_letter,
    follow_up
  });
  job.history.unshift({
    _id: uuid.v4(),
    action: 'Applied',
    description: 'Applied to job',
    date: Date.now()
  });
  console.log(job);
  job
    .save()
    .then(newJob => res.status(201).json(newJob))
    .catch(err => {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    });
});

router.post('/:id', auth, async (req, res) => {
  const {
    title,
    company_name,
    where_listed,
    cover_letter,
    follow_up,
    history
  } = req.body;
  let { company_id } = req.body;
  let company = await Company.findOne({ name: company_name });
  if (!company) {
    const newCompany = new Company({
      name: company_name
    });
    company = await newCompany
      .save()
      .catch(err => res.status(500).json({ msg: 'Server Error' }));
  }
  company_id = company._id;
  const jobDetails = {
    title,
    company: company_id,
    where_listed,
    cover_letter,
    follow_up,
    history
  };
  Job.findByIdAndUpdate(req.params.id, jobDetails)
    .then(updatedJob => res.status(201).json(updatedJob))
    .catch(err => {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    });
});

router.post('/:id/addAction', auth, async (req, res) => {
  job = await Job.findById(req.params.id)
    .catch(err => {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  job.history.unshift(req.body);
  if (req.body.action === 'Job Closed') job.still_open = false;
  job.save().then(revisedJob => res.status(201).json(revisedJob));
});

module.exports = router;
