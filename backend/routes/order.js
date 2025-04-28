/*
    This file will be repsonsible for setting up the endpoints for order stuff
    It will need to connect to the mongoDB database and get the order information from there
*/

const express = require('express')
const cors = require('cors')
const db = require('../../db/database')

const router = express.Router()
const app = router()

app.use(cors());
app.use(express.json());

app.get('/orders', (req, res) => {
    const orders = req.body.orders;

    try {
        const query = 'SELECT * FROM orders';
    } catch (error) {
    }
})

module.exports = router