const categoryRepository = require('../repositories/category.repository');

class CategoryService {
  async createCategory(categoryData) {
    if (!categoryData.name) {
      throw new Error('Tên danh mục là bắt buộc');
    }
    return await categoryRepository.createCategory(categoryData);
  }

  async getCategoryById(categoryId) {
    const category = await categoryRepository.findByCategoryId(categoryId);
    if (!category) {
      throw new Error('Không tìm thấy danh mục');
    }
    return category;
  }

  async getAllCategories() {
    return await categoryRepository.getAllCategories();
  }

  async updateCategory(categoryId, categoryData) {
    if (!categoryData.name) {
      throw new Error('Tên danh mục là bắt buộc');
    }
    const category = await categoryRepository.findByCategoryId(categoryId);
    if (!category) {
      throw new Error('Không tìm thấy danh mục');
    }
    return await categoryRepository.updateCategory(categoryId, categoryData);
  }

  async deleteCategory(categoryId) {
    const category = await categoryRepository.findByCategoryId(categoryId);
    if (!category) {
      throw new Error('Không tìm thấy danh mục');
    }
    return await categoryRepository.deleteCategory(categoryId);
  }
}

module.exports = new CategoryService();
