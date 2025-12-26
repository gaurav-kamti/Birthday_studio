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
const dbURI = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/birthday-app';

console.log("⏳ Attempting to connect to MongoDB..."); // Log start attempt

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s so we fail fast
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => {
    console.error('❌ MongoDB Connection Error Details:', err.name, err.message);
    // Continue running app but log the fatal error for Railway logs
});

// Schema definition (unchanged)
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
app.post('/api/create', async (req, res) => {
    // Check DB state
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ 
            error: 'Database not connected', 
            details: `State: ${mongoose.connection.readyState} (0=disconnected, 1=connected, 2=connecting)` 
        });
    }

    try {
        console.log("📝 Received create request");
        const newBirthday = new Birthday(req.body);
        const saved = await newBirthday.save();
        console.log("✅ Saved ID:", saved._id);
        res.json({ success: true, id: saved._id });
    } catch (err) {
        console.error("❌ Save Error:", err);
        res.status(500).json({ error: 'Failed to create birthday', details: err.message });
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
// If checking a specific ID, serve birthday-countdown.html (The actual surprise page)
app.get('/view/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'birthday-countdown.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
