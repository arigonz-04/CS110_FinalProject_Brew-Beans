const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const app = express();
const fs = require('node:fs');

app.use(cors());
app.use(express.json());
const port = 3000;


const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'brew_beans_db',
    waitForConnections: true,
    connectionLimit: 5
});

db.getConnection()
.then(conn => {
    console.log("SQL connected");
    conn.release();
})
.catch(err => {
    console.error("SQL Connection Error", err.message);
});

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

/*
app.get('/api', (req,res) =>{

    fs.readFile('index.mhtml', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  //res.setHeader('Content-Type', 'multipart/related');
  res.send(data);
});


   
})

*/



// ==========================================
// ARIANA'S TASKS
// ==========================================

// User Authentication: Registering
app.post('/api/auth/register', [
    check('name').notEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 6 }).trim().escape()  
], inputChecker, async(req, res) => {
    const {name, email, password} = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({message: "Email exists already"});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email,hashPassword]
        );

        res.status(201).json({
            message: "User registered"
        });
    } catch(err) {
        console.error("SQL Register Error", err);
        res.status(500).json({message: "Server error"});
    }
});

//User Authentication: Login
app.post('/api/auth/login', [
    check('email').isEmail().normalizeEmail(),
    check('password').notEmpty()
], inputChecker, async (req,res) => {
    const {email, password} = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({message: "Invalid email or password"});
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid email or password"});
        }
        
        res.json({
            message: "Login successful!",
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({message: "Server error"});
    }
});

// User Profiling
app.get('/api/profile/:id', async(req, res) => {
   const userID = req.params.id;
   try {
    const[users] = await db.query(
        'SELECT id, name, email, bio, profile_picture_url, created_at FROM users WHERE id= ?', [userID]
    );

    if (users.length === 0) {
        return res.status(404).json({message: "User not found"});
    }

    const [listings] = await db.query(
        'SELECT * FROM listings WHERE seller_id = ? ORDER BY created_at DESC', [userID]
    );

    res.json({user: users[0], listings: listings});
   } catch(err) {
    console.error("SQL Profile Error:", err);
    res.status(500).json({message: "Server error"});
   }
});

//Update profiles
app.put('/api/profile/:id', [
    check('name').optional().trim().escape(),
    check('bio').optional().trim().escape()
], inputChecker, async(req, res) => {
   const userID = req.params.id;
   const {name, bio} = req.body;
   try {
    const [result] = await db.query(
        'UPDATE users SET name = COALESCE(?, name), bio = COALESCE(?, bio) WHERE id = ?',[name, bio, userID]
    );
    
    if (result.affectedRows === 0) {
        return res.status(404).json({message: "User not found"});
    }
    res.json({message: "Profile Updated!"});
   } catch (err) {
    console.error("SQL Profile Update Error", err);
    res.status(500).json({message: "Server error"});
   }
});

//Profile Delete
app.delete('/api/profile/:id', async(req, res) => {
    const userID = req.params.id;
    try {
        const[result] = await db.query('DELETE FROM users WHERE id = ?', [userID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "User not found"});
        }
        res.json({message: "Account deleted!"});
    } catch (err) {
        console.error("SQL Delete Profile Error:", err);
        res.status(500).json({message: "Server error"});
    }
});

// Market Create Listings
app.post('/api/listings', [
    check('seller_id').notEmpty().isInt(),
    check('title').notEmpty().trim().escape(),
    check('price').isFloat({min:0}),
    check('category').isIn(['Coffee Beans', 'Espresso Machines', 'Syrups', 'Accessories']),
    check('item_condition').isIn(['New', 'Like New', 'Good', 'Fair']),
    check('description').optional().trim().escape()
], inputChecker, async (req,res) => {
    const { seller_id, title, price, category, item_condition, description, image_url } = req.body;
    try {
        const [result] = await db.query(
        `INSERT INTO listings (seller_id, title, price, category, item_condition, description, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [seller_id, title, price, category, item_condition, description || '', image_url || '']
        );
        res.status(201).json({message:"Listing published!", listingId: result.insertId});
    } catch(err) {
        console.error("SQL Create Listing Error:", err);
        res.status(500).json({message: "Error"});
    }
});

//Allows for users to edit their listings
app.put('/api/listings/:id', [
    check('title').optional().trim().escape(),
    check('price').optional().isFloat({min:0}),
    check('description').optional().trim().escape()
], inputChecker, async(req, res) => {
    const listingID = req.params.id;
    const {title, price, description} = req.body;
    try {
        const [result] = await db.query(
            `UPDATE listings
            SET title = COALESCE(?, title),
                price = COALESCE(?, price),
                description = COALESCE(?, description)
            WHERE id = ?`, [title, price, description, listingID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Listing not found"});
        }
        res.json({message: "Listing updated!"});
    } catch(err) {
        console.error("SQL Edit Listing Error:", err);
        res.status(500).json({message: "Server error"});
    }
});

//allows for a single product to be viewed
app.get('/api/listings/:id', async(req, res) => {
    try {
        const [rows] = await db.query (
            `SELECT l.*, u.name AS seller_name, u.email AS seller_email 
             FROM listings l 
             JOIN users u ON l.seller_id = u.id 
             WHERE l.id = ?`,
             [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({message: "Listing not found"});
        }
        res.json(rows[0]);
    } catch(err) {
        console.error("SQL error:", err);
        res.status(500).json({message: "server error"});
    }
});

//buy listing
app.post ('/api/listings/:id/buy', async (req, res) => {
    const listingId = req.params.id;
    const {buyer_id} = req.body;

    if (!buyer_id) {
        return res.status(400).json({message: "Buyer ID is required"});
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [listings] = await connection.query (
            "SELECT * FROM listings WHERE id = ? FOR UPDATE", 
            [listingId]
        );

        if (listings.length === 0) {
            await connection.rollback();
            return res.status(404).json({message: "listing not found"});
        }

        const listing = listings[0];

        if (listing.status === 'sold') {
            await connection.rollback();
            return res.status(400).json({ message: "Item is already sold" });
        }

        if (listing.seller_id === buyer_id) {
            await connection.rollback();
            return res.status(400).json({ message: "You cannot buy your own listing" });
        }

        // Mark listing as sold
        await connection.query(
            "UPDATE listings SET status = 'sold' WHERE id = ?",
            [listingId]
        );

        //purchases table
        await connection.query(
            "INSERT INTO purchases (listing_id, buyer_id, purchase_price) VALUES (?, ?, ?)",
            [listingId, buyer_id, listing.price]
        );
        await connection.commit();
        res.json({message: "Purchase completed"});
    } catch(err) {
        await connection.rollback();
        console.error("SQL Buy Error:", err);
        res.status(500).json({ message: "Server error during purchase" });
    } finally { //check to avoid update errors
        connection.release();
    }
})

//Delete listings
app.delete('/api/listings/:id', async(req, res) => {
    const listingID = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM listings WHERE id = ?', [listingID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Listing not found"});
        }
        res.json({message: "Listing deleted!"});
    } catch(err) {
        console.error("SQL Delete Listing Error:", err);
        res.status(500).json({message:"Server error"});
    }
});

// ==========================================
// BARSHA'S TASKS
// ==========================================

// Main Home Screen & Search Filters
app.get('/api/listings', async(req, res) => {
    const {q, minprice, maxprice, categories} = req.query;
    try {
    let sql = "SELECT * FROM listings WHERE 1=1";
    const queryParams = [];

    if (q) {
      sql += " AND title LIKE ?";
      queryParams.push(`%${q}%`);
    }

    if (minprice) {
      sql += " AND price >= ?";
      queryParams.push(parseFloat(minprice));
    }
    if (maxprice) {
      sql += " AND price <= ?";
      queryParams.push(parseFloat(maxprice));
    }

    if (categories) {
      const categoryList = categories.split(','); // ['coffee', 'machines']
      const placeholders = categoryList.map(() => '?').join(',');
      
      sql += ` AND category IN (${placeholders})`;
      queryParams.push(...categoryList);
    }

    const [rows] = await db.query(sql, queryParams);
    res.json(rows);

  } catch (err) {
    console.error("SQL Search Filter Error:", err);
    res.status(500).json({ error: "Failed to fetch filtered listings" });
  }
});

// Reputation System
app.get('/api/reviews/:sellerId', async (req, res) => {
    const { sellerId } = req.params;
    try {
        const [results] = await db.query(
            "SELECT AVG(rating) as average, COUNT(*) as count FROM reviews WHERE target_seller_id = ?",
            [sellerId]
        );
        res.json({ average: results[0].average || 0, count: results[0].count || 0 });
    } catch (err) {
        console.error("SQL Reviews Error:", err);
        res.status(500).json({ message: "Error fetching reviews" });
    }
});

app.post('/api/reviews/:sellerId', async (req, res) => {
    const { sellerId } = req.params;
    const { reviewerId, listingId, rating, comment } = req.body;
    try {
        await db.query(
            "INSERT INTO reviews (listing_id, reviewer_id, target_seller_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
            [listingId, reviewerId, sellerId, rating, comment]
        );
        res.json({ message: "Review submitted!" });
    } catch (err) {
        console.error("SQL Review Insert Error:", err);
        res.status(500).json({ message: "Error saving review" });
    }
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