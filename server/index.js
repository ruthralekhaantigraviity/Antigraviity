const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'farmer_friend_secret_key';

app.use(cors());
app.use(express.json());

// --- Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// --- Auth Routes ---

app.post('/api/register', async (req, res) => {
    const { name, email, password, role, mobile, farmer_type, category, experience, state, district, village, pincode } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (name, email, password, role, mobile, farmer_type, category, experience, state, district, village, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, email, hashedPassword, role, mobile, farmer_type, category, experience, state, district, village, pincode], function (err) {
        if (err) {
            console.error('Registration error:', err);
            return res.status(400).json({ error: 'Email already exists or invalid data' });
        }
        res.json({ id: this.lastID, name, email, role });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'User not found' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, role: user.role, coins: user.coins, verified: user.verified } });
    });
});

// --- Product Routes ---

app.get('/api/products', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    });
});

app.post('/api/products', (req, res) => {
    const { name, category, price, unit, image, farmer_id } = req.body;
    db.run(`INSERT INTO products (name, category, price, unit, image, farmer_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, category, price, unit, image, farmer_id], function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

// --- User Profile ---
app.get('/api/user/profile', authenticateToken, (req, res) => {
    db.get(`SELECT id, name, email, role, coins, verified FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    });
});

// --- Order Routes ---
app.post('/api/orders', authenticateToken, (req, res) => {
    const { items, total } = req.body;
    const buyer_id = req.user.id;
    const earnedCoins = Math.floor(total / 100);

    db.serialize(() => {
        // 1. Insert Order
        const orderQuery = `INSERT INTO orders (buyer_id, items, total) VALUES (?, ?, ?)`;
        db.run(orderQuery, [buyer_id, JSON.stringify(items), total], function (err) {
            if (err) return res.status(500).json({ error: 'Failed to place order' });

            const orderId = this.lastID;

            // 2. Update User Coins
            db.run(`UPDATE users SET coins = coins + ? WHERE id = ?`, [earnedCoins, buyer_id], (err) => {
                if (err) console.error('Error updating coins:', err);
                res.json({ success: true, orderId, earnedCoins });
            });
        });
    });
});

app.get('/api/orders', authenticateToken, (req, res) => {
    const query = req.user.role === 'seller'
        ? `SELECT * FROM orders`
        : `SELECT * FROM orders WHERE buyer_id = ? ORDER BY date DESC`;

    const params = req.user.role === 'seller' ? [] : [req.user.id];

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(row => ({ ...row, items: JSON.parse(row.items) })));
    });
});

// --- Seeds ---
db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row && row.count < 5) {
        const mockProducts = [
            // Fruits
            ['Green Apples', 'Fruits', 120, 'kg', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=400', 1],
            ['Organic Bananas', 'Fruits', 60, 'dozen', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=400', 1],
            ['Sweet Oranges', 'Fruits', 80, 'kg', 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=400', 1],

            // Vegetables
            ['Organic Tomatoes', 'Vegetables', 40, 'kg', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400', 1],
            ['Fresh Carrots', 'Vegetables', 50, 'kg', '/carrot.jpeg', 1],
            ['Fresh Potato', 'Vegetables', 40, 'kg', '/potato.jpg', 1],

            // Grains
            ['Premium Basmati Rice', 'Grains', 85, 'kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', 1],
            ['Whole Wheat', 'Grains', 50, 'kg', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400', 1],
            ['Yellow Corn', 'Grains', 35, 'kg', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400', 1],

            // Flowers
            ['Marigold Flowers', 'Flowers', 100, 'kg', '/marigold flower.webp', 1],
            ['Red Roses', 'Flowers', 200, 'bundle', '/rose.jpeg', 1],
            ['Jasmine Strands', 'Flowers', 50, 'strand', '/jasmine.jpeg', 1],

            // Dairy
            ['Fresh Cow Milk', 'Dairy', 60, 'litre', '/milk.jpeg', 1],
            ['Pure Organic Ghee', 'Dairy', 650, 'kg', '/ghee.jpg', 1],
            ['Fresh Paneer', 'Dairy', 300, 'kg', '/paneer.jpeg', 1],

            // Seeds
            ['Hybrid Tomato Seeds', 'Seeds', 25, 'packet', '/tomato seeds.jpeg', 1],
            ['Sunflower Seeds', 'Seeds', 150, 'kg', '/sunflower seeds.jpeg', 1],

            // Others/Sugarcane
            ['Fresh Sugarcane', 'Sugarcane', 45, 'kg', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400', 1],
            ['Raw Honey', 'Honey', 350, '500g', '/honey.jpeg', 1]
        ];
        const stmt = db.prepare("INSERT INTO products (name, category, price, unit, image, farmer_id) VALUES (?, ?, ?, ?, ?, ?)");
        mockProducts.forEach(p => stmt.run(p));
        stmt.finalize();
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
