const db = require('./server/database.js');

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
    ['Basmati Rice', 'Grains', 110, 'kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', 1],
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

db.serialize(() => {
    db.run("DELETE FROM products", () => {
        console.log('Cleared old products.');
        const stmt = db.prepare("INSERT INTO products (name, category, price, unit, image, farmer_id) VALUES (?, ?, ?, ?, ?, ?)");
        mockProducts.forEach(p => stmt.run(p));
        stmt.finalize(() => {
            console.log('Re-seeded database with clean, definitive URLs.');
            process.exit(0);
        });
    });
});
