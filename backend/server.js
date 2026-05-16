const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const candidateRoutes = require('./routes/candidateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', candidateRoutes);

app.get('/', (req, res) => {
    res.send('TalentMatch AI Backend is running!');
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
