const express = require('express');
const Job = require('../models/Job');
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

router.post('/', auth, (req, res) => {
  const { title, company_id, where_listed, cover_letter } = req.body;
  const job = new Job({
    title,
    company_id,
    where_listed,
    cover_letter
  });
  job
    .save()
    .then(newJob => res.status(201).json(newJob))
    .catch(err => res.status(500).json({ msg: 'Server Error' }));
});

module.exports = router;
