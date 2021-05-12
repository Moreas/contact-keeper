const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator/check')

const User = require('../models/User')
const Contact = require('../models/Contact')

// @route     GET api/contacts
// @desc      Get all user's contacts
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 })
    res.json(contacts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private
router.post('/', [auth, [check('name', 'Name is required').not().isEmpty()]], async (req, res) => {
  console.log('PROCESSING')
  console.log(req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { name, email, phone, type } = req.body
  try {
    console.log('try')
    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user.id
    })
    const contact = await newContact.save()
    res.json(contact)
    console.log(contact)
  } catch (err) {
    console.log('catch')
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route     PUT api/contacts
// @desc      Update contact
// @access    Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body
  // Build Contact Object
  const ContactFields = {}
  if (name) ContactFields.name = name
  if (email) ContactFields.email = email
  if (phone) ContactFields.phone = phone
  if (type) ContactFields.type = type
  try {
    let contact = await Contact.findById(req.params.id)
    if (!contact) return res.status(404).json({ msg: 'Contact not found' })
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized' })
    }
    contact = await Contact.findByIdAndUpdate(req.params.id, { $set: ContactFields }, { new: true })
    res.json(contact)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route     DELETE api/contacts
// @desc      Delete contact
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id)
    if (!contact) return res.status(404).json({ msg: 'Contact not found' })
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized' })
    }
    contact = await Contact.findByIdAndRemove(req.params.id)
    res.json({ msg: 'Contact Removed' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
