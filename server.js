require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const apiLeads = require('./routes/leads');
const apiUsers = require('./routes/users');

const PORT = process.env.PORT;
const mongoURLString = process.env.DATABASE_URL;

mongoose.connect(mongoURLString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/leads', apiLeads)
app.use('/api/users', apiUsers)


app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})

