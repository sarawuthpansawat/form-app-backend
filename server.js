const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/formsdb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// server.js

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true
});



const formSchema = new mongoose.Schema({
    name: String,
    text: String,
    dateTime: Date
});

const Form = mongoose.model('Form', formSchema);

// API endpoints

// Get all forms
app.get('/api/forms', async (req, res) => {
    try {
        const forms = await Form.find();
        res.json(forms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new form
app.post('/api/forms', async (req, res) => {
    const { name, text, dateTime } = req.body;
    const form = new Form({ name, text, dateTime });
    try {
        const newForm = await form.save();
        res.status(201).json(newForm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a form
app.put('/api/forms/:id', async (req, res) => {
    const { name, text, dateTime } = req.body;
    try {
        const updatedForm = await Form.findByIdAndUpdate(req.params.id, { name, text, dateTime }, { new: true });
        res.json(updatedForm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a form
app.delete('/api/forms/:id', async (req, res) => {
    try {
        await Form.findByIdAndDelete(req.params.id);
        res.json({ message: 'Form deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
