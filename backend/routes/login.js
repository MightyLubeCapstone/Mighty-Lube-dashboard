/*
    This file will be repsonsible for setting up the endpoints for login stuff
*/

const express = require('express')
const cors = require('cors')
const db = require('../db/database')

const router = express.Router()
const app = router()

app.use(cors());
app.use(express.json());

// Post Endpoint
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

});

// Get Endpoint
app.get('/loginInfo', (req, res) => {
    try {
        const query = 'SELECT * FROM users';
    } catch (error) {
        res.status(500).send({ message: 'Failed to get data' });
    }
});

module.exports = router