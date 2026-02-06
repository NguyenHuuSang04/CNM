const BaseRepository = require('./base.repository');
const { v4: uuidv4 } = require('uuid');

class ProductRepository extends BaseRepository {
  constructor() {
    super(process.env.DYNAMODB_TABLE_NAME || 'Products');
  }

  async createProduct(productData) {
    const product = {
      productId: uuidv4(),
      name: productData.name,
      price: Number(productData.price),
      quantity: Number(productData.quantity),
      categoryId: productData.categoryId || '',
      url_image: productData.url_image || '',
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };
    return await this.create(product);
  }

  async findByProductId(productId) {
    return await this.findById({ productId });
  }

  async getAllProducts(includeDeleted = false) {
    if (includeDeleted) {
      return await this.findAll();
    }
    return await this.findAll(
      'isDeleted = :isDeleted',
      { ':isDeleted': false }
    );
  }

  async getProductsByCategory(categoryId) {
    return await this.findAll(
      'categoryId = :categoryId AND isDeleted = :isDeleted',
      { ':categoryId': categoryId, ':isDeleted': false }
    );
  }

  async updateProduct(productId, productData) {
    const updateExpr = 'set #name = :name, price = :price, quantity = :quantity, categoryId = :categoryId, url_image = :url_image';
    return await this.update(
      { productId },
      updateExpr,
      { '#name': 'name' },
      {
        ':name': productData.name,
        ':price': Number(productData.price),
        ':quantity': Number(productData.quantity),
        ':categoryId': productData.categoryId || '',
        ':url_image': productData.url_image || '',
      }
    );
  }

  async softDeleteProduct(productId) {
    return await this.update(
      { productId },
      'set isDeleted = :isDeleted',
      {},
      { ':isDeleted': true }
    );
  }

  async hardDeleteProduct(productId) {
    return await this.delete({ productId });
  }

  async searchProducts(searchTerm) {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async filterByPriceRange(minPrice, maxPrice) {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(
      product => product.price >= minPrice && product.price <= maxPrice
    );
  }
}

module.exports = new ProductRepository();
