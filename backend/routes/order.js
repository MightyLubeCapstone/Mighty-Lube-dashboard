/*
    This file will be repsonsible for setting up the endpoints for order stuff
    It will need to connect to the mongoDB database and get the order information from there
*/

const express = require('express')
const cors = require('cors')
const Order = require('../models/Order')
const router = express.Router()

router.use(cors());
router.use(express.json());

// api/order endpoint
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().lean();
        res.json({ orders });
    } catch (error) {
        res.status(500).send({ message: 'Failed to get data' });
    }
})

router.post('/import', async (req, res) => {
    try {
        const {orders} = req.body;
        if (!Array.isArray(orders)) {
            return res.status(400).send({ message: 'Invalid orders data' });
        }

        await Order.deleteMany({});
        const result = await Order.insertMany(orders);
        res.json({ inserted: result.length})
    } catch (error) {
        res.status(500).send({ message: 'Failed to import data' });
    }
})

module.exports = router