const express = require('express');
const Book = require('../controllers/book.controller.js');

const router = express.Router();

router.get('/', Book.list)
router.get('/search-book', Book.search)
router.post('/add-book', Book.add)
router.post('/update-book', Book.updateById)
router.post('/delete-book', Book.deleteById)

module.exports = router;