require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.static(__dirname)); // Serve static files from root

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/birthday-app')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema
const BirthdaySchema = new mongoose.Schema({
    recipientName: String,
    birthdayDate: String,
    creatorName: String,
    poem: String,
    letter: String,
    theme: String,
    friends: [{ name: String, message: String }],
    // Large assets stored as base64 strings
    photos: [String],
    memes: [String],
    createdAt: { type: Date, default: Date.now }
});

const Birthday = mongoose.model('Birthday', BirthdaySchema);

// Routes

// 1. Create Birthday
app.post('/api/create', async (req, res) => {
    try {
        const newBirthday = new Birthday(req.body);
        const saved = await newBirthday.save();
        res.json({ success: true, id: saved._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create birthday' });
    }
});

// 2. Get Birthday
app.get('/api/get/:id', async (req, res) => {
    try {
        const data = await Birthday.findById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. View Routing (SPA Handle)
// If checking a specific ID, serve index.html. The font-end will parse the ID from URL.
app.get('/view/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
