require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

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

const apiLeads = require('./routes/leads');
app.use('/api/leads', apiLeads)


app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})

