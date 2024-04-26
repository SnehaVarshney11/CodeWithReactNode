const express = require('express');
const router = express.Router();
const path = require('path');
const FormModel = require('./../Models/formModel');

router.post('/', async (req, res) => {
    try{
        const formData =  req.body;
        const newForm = new FormModel(formData);
        const savedItem = await newForm.save();
        console.log('Form submitted');
        console.log(savedItem);
        res.status(200).json({ message: 'Form submitted successfully' });
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../../src/Components/form.js');
    res.sendFile(filePath);
});

module.exports = router;