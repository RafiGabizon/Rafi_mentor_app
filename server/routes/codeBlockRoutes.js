const express = require('express');
const router = express.Router();
const { getCodeBlocks, getCodeBlockById } = require('../controllers/codeBlockController');

// Get all the code blocks
router.get('/', getCodeBlocks);

// Get a code block by specific ID
router.get('/:id', getCodeBlockById);


module.exports = router;