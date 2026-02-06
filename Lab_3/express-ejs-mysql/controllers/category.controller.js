const categoryService = require('../services/category.service');

class CategoryController {
  static async index(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.render('categories/index', { 
        categories,
        user: req.session.user 
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
      res.status(500).send('Lỗi server');
    }
  }

  static showAddForm(req, res) {
    res.render('categories/add', { user: req.session.user });
  }

  static async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).send('Vui lòng nhập tên danh mục!');
      }

      await categoryService.createCategory({ name, description });
      res.redirect('/categories');
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      res.status(500).send('Lỗi khi thêm danh mục');
    }
  }

  static async showEditForm(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);

      res.render('categories/edit', { 
        category,
        user: req.session.user 
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      res.status(500).send('Lỗi server');
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).send('Vui lòng nhập tên danh mục!');
      }

      await categoryService.updateCategory(id, { name, description });
      res.redirect('/categories');
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      res.status(500).send('Lỗi khi cập nhật danh mục');
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.redirect('/categories');
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      res.status(500).send('Lỗi khi xóa danh mục');
    }
  }
}

module.exports = CategoryController;
