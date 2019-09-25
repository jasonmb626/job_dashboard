const express = require('express');
const Template = require('../models/Template');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(express.json());

router.get('/', auth, (req, res) => {
  Template.find()
    .exec()
    .then(templates => res.json(templates))
    .catch(err => res.status(500).json({ msg: err }));
});

router.get('/:type', auth, (req, res) => {
  Template.find({ type: req.params.type })
    .exec()
    .then(templates => res.json(templates))
    .catch(err => res.status(500).json({ msg: err }));
});

router.get('/:id', auth, (req, res) => {
  Template.findOne({ name: req.params.name })
    .exec()
    .then(template => res.json(template))
    .catch(err => res.status(500).json({ msg: err }));
});

router.post('/:id', auth, (req, res) => {
  console.log(req.body.content);
  Template.findByIdAndUpdate(req.params.id, { content: req.body.content })
    .exec()
    .then(template => res.json(template))
    .catch(err => res.status(500).json({ msg: err }));
});

router.post('/', auth, (req, res) => {
  const { name, type, content } = req.body;
  const template = new Template({
    name,
    type,
    content
  });
  template
    .save()
    .then(newTemplate => res.status(201).json(newTemplate))
    .catch(err => res.status(500).json({ msg: 'Server Error' }));
});

module.exports = router;
