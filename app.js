const express = require('express');
const app = express();
require('dotenv').config({ path: './config.env' })
const mongoose = require('mongoose');
const db = require('./db/config.js');
app.use(express.json());
const url = process.env.DATABASE;
const PORT = process.env.PORT;
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
app.use(require('./router/userauth'));
app.use(require('./router/adminauth'));

app.get('/', (req, res) => {
    res.send("Its working");
})
app.listen(PORT, () => {
    console.log("Server started at 9000")
})
