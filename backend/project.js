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
app.get('/api/listings',[    
    // TODO: Implement SQL LIKE search and category/condition filtering using req.query
    //q is for query
    check('q').optional().trim().escape(),
    check('minprice').optional().trim().escape(),
    check('maxprice').optional().isFloat({min:0}),
    check('coffee').optional().trim().escape(),
    check('machines').optional().trim().escape(),
    check('syrups').optional().trim().escape(),
    check('accessories').optional().trim().escape(),


],inputChecker, async(req,res) => {
     const listingID = req.params.id;
    const {title,minprice,maxprice,coffee,machines,syrups,accessories} = req.query;
     try {

        var sql = "SELECT * FROM listings";

        fields = []
        // Mandatory
            
        sql += " WHERE title = ?"
        fields.push("title")

        if(minprice != null)  {
            sql += "AND minprice = ?"
            fields.push = "minprice"
        }

        if(maxprice != null) {
            sql += "AND maxprice = ?"
            fields.push = "maxprice"
        }

         if(coffee != null) {
            sql += "AND category = coffee?"
        }

        if(machines != null) {
            sql += "AND category = machines"
        }

        if(syrups != null) {
            sql += "AND category = syrups"
        }

        if(accessories != null) {
            sql += "AND category = accessories"
        }
        


        const [result] = await db.query(
            sql, fields
        );

        if (result.affectedRows == 0) {
            return res.status(404).json({message: "Listing not found"});
        }
    } catch(err) {
        console.error("SQL Edit Listing Error:", err);
    }   


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