const express = require('express');
const router = express.Router();
const ChatbotController = require('../controllers/ChatbotController');
const { authenticateAnyUserOptional } = require('../middlewares/auth');

// Allow public access to chatbot queries, but check optional token if present
router.post('/', authenticateAnyUserOptional, ChatbotController.askAI);

module.exports = router;
