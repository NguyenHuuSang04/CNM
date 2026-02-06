const BaseRepository = require('./base.repository');
const { v4: uuidv4 } = require('uuid');

class CategoryRepository extends BaseRepository {
  constructor() {
    super('Categories');
  }

  async createCategory(categoryData) {
    const category = {
      categoryId: uuidv4(),
      name: categoryData.name,
      description: categoryData.description || '',
      createdAt: new Date().toISOString(),
    };
    return await this.create(category);
  }

  async findByCategoryId(categoryId) {
    return await this.findById({ categoryId });
  }

  async getAllCategories() {
    return await this.findAll();
  }

  async updateCategory(categoryId, categoryData) {
    return await this.update(
      { categoryId },
      'set #name = :name, description = :description',
      { '#name': 'name' },
      {
        ':name': categoryData.name,
        ':description': categoryData.description || '',
      }
    );
  }

  async deleteCategory(categoryId) {
    return await this.delete({ categoryId });
  }
}

module.exports = new CategoryRepository();
