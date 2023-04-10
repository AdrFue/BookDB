const express = require('express');
const Book = require('../controllers/book.controller.js');

const router = express.Router();

router.get('/list', Book.list)
router.get('/search-book', Book.search)
router.post('/add-book', Book.add)

module.exports = router;