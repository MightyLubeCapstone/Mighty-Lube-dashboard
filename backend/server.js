/*
    This is the main file for orchestrating our routing and backend information
    It takes in the endpoints defined in the routes/modules folder and basically hosts them on an actual port
    This setup allows us to just run node server.js and have everything work without having an obnoxiously lengthy file for the backend server
    Setup with login as example
*/

require('dotenv').config();
const express = require('express')
const cors = require('cors')
var app = express()
app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const PORT = process.env.PORT

//Important functions
const { connectDB } = require('./db/connection')

// Take in endpoint logic from a file
const login = require('./routes/login')
const order = require('./routes/order')
const mappings = require('./routes/mappings')

// set up callable endpoint to use
app.use('/api/login', login)
app.use('/api/order', order)
app.use('/api/mappings', mappings)


// The naked domain
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' })
})

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    })
    .catch(error => {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    })