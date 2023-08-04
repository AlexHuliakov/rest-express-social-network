const express = require('express');

const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/posts', (req, res) => {
    feedController.getPosts(req, res);
});

module.exports = router;
