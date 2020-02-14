const express = require('express');
const router = express.Router();
const db = require('../list');
const bodyParser = require('body-parser');

const webpush = require('web-push');

router.post('/add', (req, res) => {

    db.push(req.body);
    res.status(201).json({});

})

router.post('/view', (req, res) => {

    res.status(200).json({});

    const payload = JSON.stringify({ title: "Push Message" , message: "Master Push"});
    db.forEach(element => {
        webpush
        .sendNotification(element, payload)
        .catch(err => console.error(err));
        
    });

})

module.exports = router;