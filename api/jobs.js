const express = require('express');
const { check, validationResult } = require('express-validator');
const Job = require('../models/Job');
const Company = require('../models/Company');
const uuid = require('uuid');
const generatePDF = require('../generatePDF');

const auth = require('../middleware/auth');

const router = express.Router();

router.use(express.json());

// @route    GET api/jobs
// @desc     Get all jobs (not just job titles but all job details) in database
// @access   Private
router.get('/', auth, (req, res) => {
  Job.find()
    //need jobs that require following up (ascending order) and by application date second
    .sort({ follow_up: 1, date: 1 })
    //to avoid duplication of company names feild is linked by id
    .populate('company', 'name -_id')
    .then(jobs => {
      revisedJobs = jobs.map(job => {
        return {
          //when spreading or maping the database object the information is stored in _doc instead of top level
          ...job._doc,
          //add company name on top level before sending back to front end.
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

// @route    GET api/jobs/<id>/cover_letter
// @desc     Get the cover letter associated with job <id>
// @access   Private
router.get('/:id/cover_letter', auth, async (req, res) => {
  const job = await Job.findById(req.params.id)
    .exec()
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
    generatePDF(job.cover_letter, req.params.id, res);
});

// @route    GET api/jobs/<id>
// @desc     Get job (not just job title but all job details) with <id>
// @access   Private
router.get('/:id', auth, (req, res) => {
  Job.findById(req.params.id)
    //to avoid duplication of company names feild is linked by id
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


async function addEditJob(req, res, newJob) {
  const {
    finished_applying,
    title,
    company_name,
    where_listed,
    cover_letter,
    follow_up,
    actions,
    still_open,
    hiring_managers,
    hiring_manager_name,
    hiring_manager_title,
    hiring_manager_contact_linkedin,
    hiring_manager_contact_email,
    hiring_manager_contact_phone,
    action_name,
    action_description,
    action_date
  } = req.body;
  let { company_id } = req.body;
  //find out if company already exists.
  let company = await Company.findOne({ name: company_name });
  //create company if it doesn't
  if (!company) {
    const newCompany = new Company({
      name: company_name
    });
    company = await newCompany.save().catch(err => {
      console.error(err);
      return res.status(500).json({ msg: err });
    });
  }
  //assign found or new company id to company_id property
  company_id = company._id;
  const jobDetails = {
    finished_applying,
    title,
    company: company_id,
    where_listed,
    cover_letter,
    follow_up,
    actions,
    still_open,
    hiring_managers
  };
  if (newJob) {
    job = new Job({
      title,
      finished_applying,
      company: company_id,
      where_listed,
      actions,
      cover_letter,
      follow_up,
    });
  } else {
    job = await Job.findByIdAndUpdate(req.params.id, jobDetails)
    .exec()
    .catch(err => {
      console.error(err);
      return res.status(500).json({ msg: err });
    });
  }
  if (hiring_manager_name) {
    const hiring_manager = {
      _id: uuid.v4(),
      name: hiring_manager_name,
      title: hiring_manager_title,
      contact_linkedin: hiring_manager_contact_linkedin,
      contact_email: hiring_manager_contact_email,
      contact_phone: hiring_manager_contact_phone
    }
    job.hiring_managers.unshift(hiring_manager);
  }
  //To trigger that a job should no longer be listed, the "Job Closed" action comes through
  if (action_name === 'Job Closed') {
    job.still_open = false;
  }
  if (
    finished_applying &&
    //The Applied action is added automatically the first time this comes through, but don't re-add
    !job.actions.some(action => action.action === 'Applied') 
    ) {
      job.finished_applying = true;
      job.actions.unshift({
        _id: uuid.v4(),
        action: 'Applied',
        description: 'Applied to job',
        date: Date.now()
      });
  }
  if (action_name) {
    const action = {
      _id: uuid.v4(),
      action: action_name,
      description: action_description,
      date: action_date
    }
    job.actions.unshift(action);
  }
  job
    .save()
    .then(job => res.status(201).json(job))
    .catch(err => {
      console.log(err);
      return res.status(500).json({ msg: err });
    });
}

// @route    POST api/jobs
// @desc     Add a new job (not just job title but all job details) to database
// @access   Private
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
    return addEditJob(req, res, true);
  }
);

// @route    POST api/jobs/<id>
// @desc     Update job details to database (for job <id>)
// @access   Private
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
    return addEditJob(req, res, false);
  }    
);

module.exports = router;
