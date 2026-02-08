const { docClient } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'Products';

class Product {
  // Get all products
  static async getAll() {
    const params = {
      TableName: TABLE_NAME
    };

    try {
      const data = await docClient.scan(params).promise();
      return data.Items;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  // Get product by ID
  static async getById(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };

    try {
      const data = await docClient.get(params).promise();
      return data.Item;
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  // Create new product
  static async create(productData) {
    const product = {
      id: uuidv4(),
      name: productData.name,
      price: productData.price,
      url_image: productData.url_image || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: TABLE_NAME,
      Item: product
    };

    try {
      await docClient.put(params).promise();
      return product;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  // Update product
  static async update(id, productData) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set #name = :name, price = :price, url_image = :url_image, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': productData.name,
        ':price': productData.price,
        ':url_image': productData.url_image || '',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    try {
      const data = await docClient.update(params).promise();
      return data.Attributes;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  // Delete product
  static async delete(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };

    try {
      await docClient.delete(params).promise();
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

module.exports = Product;
