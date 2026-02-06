const productRepository = require('../repositories/product.repository');
const productLogRepository = require('../repositories/productLog.repository');
const { s3Client } = require('../config/s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

class ProductService {
  async createProduct(productData, userId) {
    if (!productData.name || !productData.price || productData.quantity === undefined) {
      throw new Error('Thông tin sản phẩm không đầy đủ');
    }

    const product = await productRepository.createProduct(productData);

    // Log action
    await productLogRepository.createLog({
      productId: product.productId,
      action: 'CREATE',
      userId: userId,
      changes: product,
    });

    return product;
  }

  async getProductById(productId) {
    const product = await productRepository.findByProductId(productId);
    if (!product || product.isDeleted) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    return product;
  }

  async getAllProducts() {
    return await productRepository.getAllProducts();
  }

  async getProductsByCategory(categoryId) {
    return await productRepository.getProductsByCategory(categoryId);
  }

  async updateProduct(productId, productData, userId) {
    const existingProduct = await productRepository.findByProductId(productId);
    if (!existingProduct || existingProduct.isDeleted) {
      throw new Error('Không tìm thấy sản phẩm');
    }

    const updated = await productRepository.updateProduct(productId, productData);

    // Log action
    await productLogRepository.createLog({
      productId: productId,
      action: 'UPDATE',
      userId: userId,
      changes: productData,
    });

    return updated;
  }

  async deleteProduct(productId, userId) {
    const product = await productRepository.findByProductId(productId);
    if (!product || product.isDeleted) {
      throw new Error('Không tìm thấy sản phẩm');
    }

    // Soft delete
    await productRepository.softDeleteProduct(productId);

    // Delete image from S3
    if (product.url_image) {
      await this.deleteImageFromS3(product.url_image);
    }

    // Log action
    await productLogRepository.createLog({
      productId: productId,
      action: 'DELETE',
      userId: userId,
      changes: { isDeleted: true },
    });

    return true;
  }

  async searchProducts(searchTerm) {
    return await productRepository.searchProducts(searchTerm);
  }

  async filterProducts(filters) {
    let products = await productRepository.getAllProducts();

    // Search by name (case-insensitive)
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (filters.categoryId && filters.categoryId.trim()) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }

    // Filter by minimum price
    if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
      const minPrice = Number(filters.minPrice);
      if (!isNaN(minPrice)) {
        products = products.filter(p => p.price >= minPrice);
      }
    }

    // Filter by maximum price
    if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
      const maxPrice = Number(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        products = products.filter(p => p.price <= maxPrice);
      }
    }

    return products;
  }

  getInventoryStatus(quantity) {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 5) return 'low-stock';
    return 'in-stock';
  }

  async deleteImageFromS3(imageUrl) {
    try {
      const urlParts = imageUrl.split('/');
      const key = urlParts.slice(-2).join('/');

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      };

      await s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.error('Lỗi khi xóa ảnh trên S3:', error);
    }
  }

  async getProductLogs(productId) {
    return await productLogRepository.getLogsByProduct(productId);
  }
}

module.exports = new ProductService();
