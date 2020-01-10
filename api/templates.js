const express = require('express');
const Template = require('../models/Template');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(express.json());

// @route    GET api/templates
// @desc     Get all cover letter templates
// @access   Private
router.get('/', auth, (req, res) => {
  Template.find()
    .exec()
    .then(templates => res.json(templates))
    .catch(err => res.status(500).json({ msg: err }));
});

// @route    GET api/templates/<type>
// @desc     Get cover letter template of <type>
// @access   Private
router.get('/:type', auth, (req, res) => {
  Template.find({ type: req.params.type })
    .exec()
    .then(templates => res.json(templates))
    .catch(err => res.status(500).json({ msg: err }));
});

// @route    GET api/templates/<id>
// @desc     Get all cover letter templates
// @access   Private
// This is here for historic reason alone. Really the route will never be reached because of
// /:type above
router.get('/:id', auth, (req, res) => {
  Template.findOne({ name: req.params.name })
    .exec()
    .then(template => res.json(template))
    .catch(err => res.status(500).json({ msg: err }));
});

// @route    POST api/templates/
// @desc     Add a new cover letter template
// @access   Private
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

// @route    POST api/templates/<id>
// @desc     Update a cover letter template
// @access   Private
router.post('/:id', auth, (req, res) => {
  Template.findByIdAndUpdate(req.params.id, { content: req.body.content })
    .exec()
    .then(template => res.json(template))
    .catch(err => res.status(500).json({ msg: err }));
});

module.exports = router;