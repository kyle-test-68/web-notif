const express  = require('express');
const router   = express.Router();
const webpush    = require('web-push');

// Subscribe Route
router.post('/', (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;

    // Send 201 - resource created
    res.status(201).json({});
    // Create payload
    const payload = JSON.stringify({ title: "Push Message" , message: subscription.message});
  
    // Pass object into sendNotification
    webpush
      .sendNotification(subscription, payload)
      .catch(err => console.error(err));
  });

  module.exports = router;