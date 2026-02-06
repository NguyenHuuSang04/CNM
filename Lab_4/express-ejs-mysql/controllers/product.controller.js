const productService = require('../services/product.service');
const categoryService = require('../services/category.service');

class ProductController {
  /**
   * Hiển thị danh sách sản phẩm
   */
  static async index(req, res) {
    try {
      const { search, categoryId, minPrice, maxPrice } = req.query;

      let products;
      if (search || categoryId || minPrice || maxPrice) {
        products = await productService.filterProducts({
          search,
          categoryId,
          minPrice,
          maxPrice,
        });
      } else {
        products = await productService.getAllProducts();
      }

      // Add inventory status
      products = products.map(product => ({
        ...product,
        inventoryStatus: productService.getInventoryStatus(product.quantity),
      }));

      const categories = await categoryService.getAllCategories();

      res.render('products/index', {
        products,
        categories,
        filters: { search, categoryId, minPrice, maxPrice },
        user: req.session.user,
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      res.status(500).send('Lỗi server');
    }
  }

  /**
   * Hiển thị form thêm sản phẩm
   */
  static async showAddForm(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.render('products/add', { 
        categories,
        user: req.session.user 
      });
    } catch (error) {
      console.error('Lỗi:', error);
      res.status(500).send('Lỗi server');
    }
  }

  /**
   * Xử lý thêm sản phẩm mới
   */
  static async create(req, res) {
    try {
      const { name, price, quantity, categoryId } = req.body;

      if (!name || !price || !quantity) {
        return res.status(400).send('Vui lòng nhập đầy đủ thông tin!');
      }

      const url_image = req.file ? req.file.location : '';

      await productService.createProduct(
        { name, price, quantity, categoryId, url_image },
        req.session.user.userId
      );

      res.redirect('/products');
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
      const product = await productService.getProductById(id);
      const categories = await categoryService.getAllCategories();

      res.render('products/edit', {
        product,
        categories,
        user: req.session.user,
      });
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
      const { name, price, quantity, categoryId } = req.body;

      if (!name || !price || !quantity) {
        return res.status(400).send('Vui lòng nhập đầy đủ thông tin!');
      }

      const currentProduct = await productService.getProductById(id);

      let url_image = currentProduct.url_image;
      if (req.file) {
        url_image = req.file.location;
        if (currentProduct.url_image) {
          await productService.deleteImageFromS3(currentProduct.url_image);
        }
      }

      await productService.updateProduct(
        id,
        { name, price, quantity, categoryId, url_image },
        req.session.user.userId
      );

      res.redirect('/products');
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      res.status(500).send('Lỗi khi cập nhật sản phẩm');
    }
  }

  /**
   * Xử lý xóa sản phẩm (soft delete)
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id, req.session.user.userId);
      res.redirect('/products');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      res.status(500).send('Lỗi khi xóa sản phẩm');
    }
  }

  /**
   * Xem lịch sử thao tác của sản phẩm
   */
  static async showLogs(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      const logs = await productService.getProductLogs(id);

      res.render('products/logs', {
        product,
        logs,
        user: req.session.user,
      });
    } catch (error) {
      console.error('Lỗi khi lấy logs:', error);
      res.status(500).send('Lỗi server');
    }
  }
}

module.exports = ProductController;