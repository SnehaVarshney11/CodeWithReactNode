const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../form/src/db')

const app = express();
const PORT = process.env.PORT || 5000;
//Initilize Router
const formRoute = require('./src/Router/formRoutes');

app.use(cors({ origin : 'http://localhost:3000' }));
app.use(bodyParser.json()); //store in req.body 
app.use(bodyParser.urlencoded({ extended: true }));

//Use routes 
app.use('/api/form', formRoute);

app.listen(PORT, () => {
    console.log("server is running on port ", PORT);
})