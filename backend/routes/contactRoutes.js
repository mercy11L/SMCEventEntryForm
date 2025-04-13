const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your MySQL connection (make sure it's configured)

router.post('/contact', async (req, res) => {
  const { Name, DeptName, email, mobile, message } = req.body;

  const sql = `
    INSERT INTO contact (name, dname, mail, mob, msg)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [Name, DeptName, email, mobile, message];

  try {
    await db.query(sql, values);
    res.status(201).send({ message: 'Contact saved successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).send({ message: 'Error saving contact' });
  }
});

module.exports = router;
