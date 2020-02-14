const express = require('express');
const router  = express.Router();
const path = require('path');

router.get('/', (req, res) => 
  // Get pushSubscription object
  res.sendFile(path.join(__dirname, '../public', 'list.html'))
);

module.exports = router;