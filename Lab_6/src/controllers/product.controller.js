const ProductModel = require('../models/product.model');
const { uploadToS3, deleteFromS3 } = require('../config/s3');

class ProductController {
    // ─── helpers ──────────────────────────────────────────────────────────────

    /** Validate shared create/edit fields. Returns an error string or null. */
    static _validate({ name, price, quantity }) {
        if (!name || !name.trim()) return 'Tên sản phẩm không được để trống!';
        const p = parseFloat(price);
        if (isNaN(p) || p <= 0) return 'Giá sản phẩm phải lớn hơn 0!';
        const q = parseInt(quantity, 10);
        if (isNaN(q) || q < 0) return 'Số lượng phải lớn hơn hoặc bằng 0!';
        return null;
    }

    // ─── GET /products ─────────────────────────────────────────────────────────

    static async index(req, res) {
        try {
            const { search, page: pageStr } = req.query;
            const limit = 5;
            const allProducts = search && search.trim() ?
                await ProductModel.searchByName(search.trim()) :
                await ProductModel.getAll();

            const totalProducts = allProducts.length;
            const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
            const page = Math.min(Math.max(1, parseInt(pageStr) || 1), totalPages);
            const products = allProducts.slice((page - 1) * limit, page * limit);

            res.render('index', { products, search: search || '', page, totalPages, totalProducts, limit });
        } catch (err) {
            console.error('index error:', err);
            res.status(500).render('error', {
                message: 'Không thể lấy danh sách sản phẩm: ' + err.message,
            });
        }
    }

    // ─── GET /products/add ─────────────────────────────────────────────────────

    static showAddForm(req, res) {
        res.render('add', { error: req.query.error || null });
    }

    // ─── POST /products/add ────────────────────────────────────────────────────

    static async create(req, res) {
        const redirect = (msg) =>
            res.redirect('/products/add?error=' + encodeURIComponent(msg));

        if (req.uploadError) return redirect(req.uploadError);

        const { name, price, quantity } = req.body;
        const id = 'SP-' + Date.now();

        const fieldErr = ProductController._validate({ name, price, quantity });
        if (fieldErr) return redirect(fieldErr);

        try {
            // 1. Upload image to S3 (optional)
            let imageUrl = '';
            if (req.file) {
                try {
                    imageUrl = await uploadToS3(req.file);
                } catch (s3Err) {
                    return redirect('Upload ảnh thất bại: ' + s3Err.message);
                }
            }

            // 2. Persist to DynamoDB
            await ProductModel.create({
                id: id.trim(),
                name: name.trim(),
                image: imageUrl,
                price,
                quantity,
            });

            res.redirect('/products');
        } catch (err) {
            console.error('create error:', err);
            const msg =
                err.name === 'ConditionalCheckFailedException' ?
                `Mã sản phẩm "${id.trim()}" đã tồn tại!` :
                'Thêm sản phẩm thất bại: ' + err.message;
            redirect(msg);
        }
    }

    // ─── GET /products/edit/:id ────────────────────────────────────────────────

    static async showEditForm(req, res) {
        try {
            const product = await ProductModel.getById(req.params.id);
            if (!product) {
                return res.status(404).render('404', {
                    message: `Không tìm thấy sản phẩm với ID: ${req.params.id}`,
                });
            }
            res.render('edit', { product, error: req.query.error || null });
        } catch (err) {
            console.error('showEditForm error:', err);
            res.status(500).render('error', {
                message: 'Không thể lấy thông tin sản phẩm: ' + err.message,
            });
        }
    }

    // ─── POST /products/edit/:id ───────────────────────────────────────────────

    static async update(req, res) {
        const { id } = req.params;
        const redirect = (msg) =>
            res.redirect(`/products/edit/${id}?error=` + encodeURIComponent(msg));

        if (req.uploadError) return redirect(req.uploadError);

        const { name, price, quantity } = req.body;
        const fieldErr = ProductController._validate({ name, price, quantity });
        if (fieldErr) return redirect(fieldErr);

        try {
            const current = await ProductModel.getById(id);
            if (!current) {
                return res.status(404).render('404', {
                    message: `Không tìm thấy sản phẩm với ID: ${id}`,
                });
            }

            let imageUrl = current.image;

            if (req.file) {
                // Upload new image first
                try {
                    imageUrl = await uploadToS3(req.file);
                } catch (s3Err) {
                    return redirect('Upload ảnh thất bại: ' + s3Err.message);
                }
                // Delete old image (non-fatal)
                await deleteFromS3(current.image);
            }

            await ProductModel.update(id, {
                name: name.trim(),
                price,
                quantity,
                image: imageUrl,
            });

            res.redirect('/products');
        } catch (err) {
            console.error('update error:', err);
            const msg =
                err.name === 'ConditionalCheckFailedException' ?
                'Sản phẩm không còn tồn tại!' :
                'Cập nhật sản phẩm thất bại: ' + err.message;
            redirect(msg);
        }
    }

    // ─── POST /products/delete/:id ─────────────────────────────────────────────

    static async delete(req, res) {
        const { id } = req.params;
        try {
            const product = await ProductModel.getById(id);
            if (!product) {
                return res.status(404).render('404', {
                    message: `Không tìm thấy sản phẩm với ID: ${id}`,
                });
            }

            await deleteFromS3(product.image); // non-fatal
            await ProductModel.delete(id);
            res.redirect('/products');
        } catch (err) {
            console.error('delete error:', err);
            const msg =
                err.name === 'ConditionalCheckFailedException' ?
                'Sản phẩm không còn tồn tại!' :
                'Xóa sản phẩm thất bại: ' + err.message;
            res.status(500).render('error', { message: msg });
        }
    }
}

module.exports = ProductController;