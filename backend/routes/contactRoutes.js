const express = require('express');
const router = express.Router();
const conModel = require('../models/ContModel'); // Import the Mongoose model

router.post('/contact', async (req, res) => {
  try {
    const { name, dname, mail, mob, msg } = req.body;
    const newContact = new conModel({ name, dname, mail, mob, msg });
    await newContact.save();
    res.status(201).send({ message: 'Contact saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error saving contact' });
  }
});

module.exports = router;