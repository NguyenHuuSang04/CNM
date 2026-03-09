require('dotenv').config();
const express = require('express');
const path = require('path');
const productRoutes = require('./src/routes/product.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── View engine ──────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/products', productRoutes);
app.get('/', (req, res) => res.redirect('/products'));

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('404', { message: 'Trang không tìm thấy.' });
});

// ── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).render('error', {
        message: err.message || 'Đã xảy ra lỗi không mong muốn.',
    });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅  Server đang chạy tại http://localhost:${PORT}`);
});