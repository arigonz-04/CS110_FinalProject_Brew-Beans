const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

//Get endpoint welcome message
app.get('/', (req, res) => {
    res.send("Welcome To The Brew & Beans Market!");
});
// ==========================================
// ARIANA'S TASKS
// ==========================================

// User Authentication
app.post('/api/auth/register', (req, res) => {
    // TODO: Hash password and insert user into SQL DB
    res.status(201).json({ message: "Register endpoint placeholder" });
});

app.post('/api/auth/login', (req, res) => {
    // TODO: Verify credentials against SQL DB and issue session/token
    res.json({ message: "Login endpoint placeholder" });
});

// User Profiling
app.get('/api/profile/:id', (req, res) => {
    // TODO: Query user profiles & selling history from SQL
    res.json({ message: `Fetching profile for user ${req.params.id}` });
});

app.put('/api/profile/:id', (req, res) => {
    // TODO: Update user profile info in SQL
    res.json({ message: `Profile updated for user ${req.params.id}` });
});

app.delete('/api/profile/:id', (req, res) => {
    // TODO: Handle account deletion logic
    res.json({ message: `Deleted account for user ${req.params.id}` });
});

// Market Listings
app.post('/api/listings', (req, res) => {
    // TODO: Insert a new coffee item listing into SQL
    res.status(201).json({ message: "Listing created placeholder" });
});

app.put('/api/listings/:id', (req, res) => {
    // TODO: Edit existing listing details
    res.json({ message: `Updated listing ${req.params.id}` });
});

app.delete('/api/listings/:id', (req, res) => {
    // TODO: Delete an active listing
    res.json({ message: `Deleted listing ${req.params.id}` });
});

// ==========================================
// BARSHA'S TASKS
// ==========================================

// Main Home Screen & Search Filters
app.get('/api/listings', (req, res) => {
    // TODO: Implement SQL LIKE search and category/condition filtering using req.query
    res.json({ message: "Fetching and filtering listings placeholder" });
});

// Reputation System
app.post('/api/reviews', (req, res) => {
    // TODO: Insert 1-5 star review into SQL reviews table
    res.status(201).json({ message: "Review submitted placeholder" });
});

// Recommendation System
app.post('/api/history', (req, res) => {
    // TODO: Log viewed items into viewed_history table
    res.json({ message: "Viewed history logged" });
});

app.get('/api/recommendations', (req, res) => {
    // TODO: Fetch algorithm-based items based on product similarities
    res.json({ message: "Fetching user recommendations placeholder" });
});

// ==========================================
// SHARED TASKS (ARIANA & BARSHA)
// ==========================================

// Messaging System
app.get('/api/conversations', (req, res) => {
    // TODO: Fetch chat conversations for the logged-in user
    res.json({ message: "Fetching chat threads placeholder" });
});

app.post('/api/messages', (req, res) => {
    // TODO: Save message to DB
    res.status(201).json({ message: "Message sent placeholder" });
});

// Start the server
app.listen(port, () => {
    console.log(`Brew & Beans backend running on http://localhost:${port}`);
});