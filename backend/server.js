/*
    This is the main file for orchestrating our routing and backend information
    It takes in the endpoints defined in the routes/modules folder and basically hosts them on an actual port
    This setup allows us to just run node server.js and have everything work without having an obnoxiously lengthy file for the backend server
    Setup with login as example
*/

const express = require('express')
const cors = require('cors')
var app = express()

// Take in endpoint logic from a file
const login = require('./routes/login')
const order = require('./routes/order')
const PORT = process.env.PORT || 8000

app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}))
app.use(express.json())

// set up callable endpoint to use
app.use('/api/login', login)
app.use('/api/order', order)


// The naked domain
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})