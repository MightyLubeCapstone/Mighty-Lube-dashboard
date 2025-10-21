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

// PUT /api/order/user_orders/allCarts - Update user preferences for all carts
router.put('/user_orders/allCarts', async (req, res) => {
    try {
        const { userID, order } = req.body;
        
        if (!userID || !order) {
            return res.status(400).json({ 
                message: 'userID and order are required' 
            });
        }

        // Find and update the order
        const updatedOrder = await Order.findOneAndUpdate(
            { orderID: order.orderID },
            { 
                ...order,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ 
            message: 'User preferences updated successfully',
            userID: userID,
            orderID: order.orderID,
            updatedAt: updatedOrder.updatedAt
        });

    } catch (error) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({ message: 'Failed to update user preferences' });
    }
});

// PUT /api/orders/editing - Update order configuration
router.put('/editing', async (req, res) => {
    try {
        const { userID, order } = req.body;
        
        if (!userID || !order || !order.orderID) {
            return res.status(400).json({ 
                message: 'userID and order with orderID are required' 
            });
        }

        // Find and update the order with new configuration
        const updatedOrder = await Order.findOneAndUpdate(
            { orderID: order.orderID },
            { 
                numRequested: order.numRequested,
                orderStatus: order.orderStatus,
                productConfigurationInfo: order.productConfigurationInfo,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ 
            message: 'Order configuration updated successfully',
            userID: userID,
            orderID: order.orderID,
            updatedOrder: updatedOrder,
            updatedAt: updatedOrder.updatedAt
        });

    } catch (error) {
        console.error('Error updating order configuration:', error);
        res.status(500).json({ message: 'Failed to update order configuration' });
    }
});

module.exports = router