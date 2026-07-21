const express = require('express');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const inputChecker = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

//Get endpoint welcome message
app.get('/', (req, res) => {
    res.send("Welcome To The Brew & Beans Market!");
});
// ==========================================
// ARIANA'S TASKS
// ==========================================

// User Authentication: Registering
app.post('/api/auth/register', [
    check('name').notEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 6 }).trim().escape()  
], inputChecker, (req, res) => {
    //HASH PASSWORD with Bcrypt
    res.status(201).json({ message: "User registered successfully" });
});

//User Authentication: Login
app.post('/api/auth/login', [
    check('email').isEmail().normalizeEmail(),
    check('password').notEmpty()
], inputChecker, (req,res) => {
    res.json({message: "Login verification passed"});
});

// User Profiling
app.get('/api/profile/:id', (req, res) => {
    // TODO: Query user profiles & selling history from SQL
    res.json({ message: `Fetching profile for user ${req.params.id}` });
});

//Update profiles
app.put('/api/profile/:id', [
    check('name').optional().trim().escape(),
    check('bio').optional().trim().escape()
], inputChecker, (req, res) => {
    res.json({message: `Profile updated successfully for the user ${req.params.id}`});
});

//Profile Delete
app.delete('/api/profile/:id', (req, res) => {
    res.json({ message: `Deleted account for user ${req.params.id}` });
});

// Market Create Listings
app.post('/api/listings', [
    check('title').notEmpty().trim().escape(),
    check('price').isFloat({min:0}),
    check('category').isIn(['Coffee Beans', 'Espresso Machines', 'Syrups', 'Accessories']),
    check('item_condition').isIn(['New', 'Like New', 'Good', 'Fair']),
    check('description').optional().trim().escape()
], inputChecker, (req,res) => {
    console.log("Received Listing:");
    console.log(req.body);

    res.status(201).json({message: "Listing is correctly placed, ready to add to SQL",
        listing: req.body
    })
});

//Allows for users to edit their listings
app.put('/api/listings/:id', [
    check('title').optional().trim().escape(),
    check('price').optional().isFloat({min:0})
], inputChecker, (req, res) => {
    res.json({message: `Listing updated successfully for ${req.params.id}`});
});

//Delete listings
app.delete('/api/listings/:id', (req, res) => {
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