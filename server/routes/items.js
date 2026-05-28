const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(items.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create item
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { title, description, location, category, status } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    const newItem = await pool.query(
      'INSERT INTO items (title, description, location, category, status, image, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, location, category, status, image, req.user.id]
    );
    res.json(newItem.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  const { title, description, location, category, status } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE items SET title=$1, description=$2, location=$3, category=$4, status=$5 WHERE id=$6 AND user_id=$7 RETURNING *',
      [title, description, location, category, status, req.params.id, req.user.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM items WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;