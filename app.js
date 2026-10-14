// Task1: initiate app and run server at 3000

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 

// Replace the placeholder (or set MONGODB_URI in a .env file) with your Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/employeeDB?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err.message));

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema, 'employeelist');

// Also serve the build folder using the exact folder casing on disk (needed on case-sensitive systems like Linux)
app.use(express.static(path.join(__dirname, 'dist', 'Frontend')));

// Helper: send a suitable error response
const handleError = (res, err) => {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid employee id' });
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
};



//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        handleError(res, err);
    }
});





//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        handleError(res, err);
    }
});






//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        const employee = await new Employee({ name, location, position, salary }).save();
        res.status(201).json(employee);
    } catch (err) {
        handleError(res, err);
    }
});







//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted successfully', employee: deleted });
    } catch (err) {
        handleError(res, err);
    }
});






//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, name, location, position, salary } = req.body;
        if (!_id) return res.status(400).json({ message: '_id is required to update an employee' });
        const updated = await Employee.findByIdAndUpdate(
            _id,
            { name, location, position, salary },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(updated);
    } catch (err) {
        handleError(res, err);
    }
});



//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



