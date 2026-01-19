const ProductModel = require('../models/product.model');

class ProductController {
  /**
   * Hiển thị danh sách sản phẩm
   */
  static async index(req, res) {
    try {
      const products = await ProductModel.getAll();
      res.render('products', { 
        products, 
        user: req.session.user 
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      res.status(500).send('Lỗi server');
    }
  }

  /**
   * Hiển thị form thêm sản phẩm
   */
  static showAddForm(req, res) {
    res.render('add-product');
  }

  /**
   * Xử lý thêm sản phẩm mới
   */
  static async create(req, res) {
    try {
      const { name, price, quantity } = req.body;

      // Validate input
      if (!name || !price || !quantity) {
        return res.status(400).send('Vui lòng nhập đầy đủ thông tin!');
      }

      await ProductModel.create({ name, price, quantity });
      res.redirect('/');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      res.status(500).send('Lỗi khi thêm sản phẩm');
    }
  }

  /**
   * Hiển thị form chỉnh sửa sản phẩm
   */
  static async showEditForm(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById(id);

      if (!product) {
        return res.status(404).send('Không tìm thấy sản phẩm');
      }

      res.render('edit-product', { product });
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      res.status(500).send('Lỗi server');
    }
  }

  /**
   * Xử lý cập nhật sản phẩm
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, quantity } = req.body;

      // Validate input
      if (!name || !price || !quantity) {
        return res.status(400).send('Vui lòng nhập đầy đủ thông tin!');
      }

      const success = await ProductModel.update(id, { name, price, quantity });

      if (!success) {
        return res.status(404).send('Không tìm thấy sản phẩm');
      }

      res.redirect('/');
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      res.status(500).send('Lỗi khi cập nhật sản phẩm');
    }
  }

  /**
   * Xử lý xóa sản phẩm
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await ProductModel.delete(id);

      if (!success) {
        return res.status(404).send('Không tìm thấy sản phẩm');
      }

      res.redirect('/');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      res.status(500).send('Lỗi khi xóa sản phẩm');
    }
  }
}

module.exports = ProductController;
