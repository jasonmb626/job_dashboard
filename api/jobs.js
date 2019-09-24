const express = require('express');
const { check, validationResult } = require('express-validator');
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
    .then(jobs => {
      revisedJobs = jobs.map(job => {
        return {
          ...job._doc,
          company_name: job._doc.company.name
        };
      });
      res.json(revisedJobs);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ msg: err });
    });
});

router.get('/:id/cover_letter', async (req, res) => {
  const job = await Job.findById(req.params.id)
    .exec()
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  console.log(`Getting cover letter ${req.params.id}`);
  generatePDF(job.cover_letter, req.params.id, res);
});

router.get('/:id', auth, (req, res) => {
  Job.findById(req.params.id)
    .populate('company', 'name -_id')
    .exec()
    .then(job => {
      res.json({
        ...job._doc,
        company_name: job._doc.company.name
      });
    })
    .catch(err => res.status(500).json({ msg: err }));
});

router.post(
  '/',
  [
    auth,
    [
      check('title', 'Please provide a job title.')
        .not()
        .isEmpty(),
      check('company_name', 'Please include a full company name.')
        .not()
        .isEmpty(),
      check('where_listed', 'Please include where you found this job.')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ msg: errors.array() });
    const {
      finished_applying,
      title,
      company_name,
      where_listed,
      actions,
      cover_letter,
      follow_up,
      hiring_managers
    } = req.body;
    let { company_id } = req.body;
    let company = await Company.findOne({ name: company_name }).exec();
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
      finished_applying,
      company: company_id,
      where_listed,
      actions,
      cover_letter,
      follow_up,
      hiring_managers
    });
    if (finished_applying)
      job.actions.unshift({
        _id: uuid.v4(),
        action: 'Applied',
        description: 'Applied to job',
        date: Date.now()
      });
    job
      .save()
      .then(newJob => {
        revisedJob = { ...newJob._doc, company_name };
        console.log(revisedJob);
        return res.status(201).json(revisedJob);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
      });
  }
);

router.post(
  '/:id',
  [
    auth,
    [
      check('title', 'Please provide a job title.')
        .not()
        .isEmpty(),
      check('company_name', 'Please include a full company name.')
        .not()
        .isEmpty(),
      check('where_listed', 'Please include where you found this job.')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    console.log('In post:id');
    const {
      finished_applying,
      title,
      company_name,
      where_listed,
      cover_letter,
      follow_up,
      actions,
      hiring_managers
    } = req.body;
    let { company_id } = req.body;
    let company = await Company.findOne({ name: company_name }).catch(err =>
      console.log(`${company_name} doesn't yet exist. will create`)
    );
    if (!company) {
      const newCompany = new Company({
        name: company_name
      });
      company = await newCompany.save().catch(err => {
        console.error(err);
        return res.status(500).json({ msg: err });
      });
    }
    company_id = company._id;
    const jobDetails = {
      finished_applying,
      title,
      company: company_id,
      where_listed,
      cover_letter,
      follow_up,
      actions,
      hiring_managers
    };
    updatedJob = await Job.findByIdAndUpdate(req.params.id, jobDetails)
      .exec()
      .catch(err => {
        console.error(err);
        return res.status(500).json({ msg: err });
      });
    if (
      finished_applying &&
      !updatedJob.actions.some(action => action.action === 'Applied')
    ) {
      updatedJob.finished_applying = true;
      updatedJob.actions.unshift({
        _id: uuid.v4(),
        action: 'Applied',
        description: 'Applied to job',
        date: Date.now()
      });
    }
    updatedJob
      .save()
      .then(job => res.status(201).json(job))
      .catch(err => {
        console.log(err);
        return res.status(500).json({ msg: err });
      });
  }
);

router.post('/:id/addAction', auth, async (req, res) => {
  job = await Job.findById(req.params.id)
    .exec()
    .catch(err => {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  job.action.unshift(req.body);
  if (req.body.action === 'Job Closed') job.still_open = false;
  job.save().then(revisedJob => res.status(201).json(revisedJob));
});

router.post('/:id/addHiringManager', auth, async (req, res) => {
  job = await Job.findById(req.params.id)
    .exec()
    .catch(err => {
      console.error(err);
      return res.status(500).json({ msg: 'Server Error' });
    });
  job.hiring_managers.unshift(req.body);
  job.save().then(revisedJob => res.status(201).json(revisedJob));
});

module.exports = router;
