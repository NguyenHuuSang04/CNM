const { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dynamoDb = require('../config/dynamodb');
const { s3Client } = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

class ProductModel {
  /**
   * Lấy tất cả sản phẩm
   */
  static async getAll() {
    try {
      const params = {
        TableName: TABLE_NAME,
      };
      const data = await dynamoDb.send(new ScanCommand(params));
      return data.Items || [];
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách sản phẩm: ' + error.message);
    }
  }

  /**
   * Lấy sản phẩm theo ID
   */
  static async getById(productId) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { productId },
      };
      const data = await dynamoDb.send(new GetCommand(params));
      return data.Item || null;
    } catch (error) {
      throw new Error('Lỗi khi lấy sản phẩm: ' + error.message);
    }
  }

  /**
   * Tạo sản phẩm mới
   */
  static async create(productData) {
    try {
      const productId = uuidv4(); // Tạo UUID cho sản phẩm
      const item = {
        productId,
        name: productData.name,
        price: Number(productData.price),
        quantity: Number(productData.quantity),
        url_image: productData.url_image || '',
        createdAt: new Date().toISOString(),
      };

      const params = {
        TableName: TABLE_NAME,
        Item: item,
      };

      await dynamoDb.send(new PutCommand(params));
      return productId;
    } catch (error) {
      throw new Error('Lỗi khi tạo sản phẩm: ' + error.message);
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  static async update(productId, productData) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { productId },
        UpdateExpression: 'set #name = :name, price = :price, quantity = :quantity, url_image = :url_image',
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':name': productData.name,
          ':price': Number(productData.price),
          ':quantity': Number(productData.quantity),
          ':url_image': productData.url_image || '',
        },
        ReturnValues: 'ALL_NEW',
      };

      const data = await dynamoDb.send(new UpdateCommand(params));
      return data.Attributes ? true : false;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật sản phẩm: ' + error.message);
    }
  }

  /**
   * Xóa s���n phẩm
   */
  static async delete(productId) {
    try {
      // Lấy thông tin sản phẩm trước khi xóa (để xóa ảnh trên S3)
      const product = await this.getById(productId);

      // Xóa sản phẩm trong DynamoDB
      const params = {
        TableName: TABLE_NAME,
        Key: { productId },
      };
      await dynamoDb.send(new DeleteCommand(params));

      // Xóa ảnh trên S3 (nếu có)
      if (product && product.url_image) {
        await this.deleteImageFromS3(product.url_image);
      }

      return true;
    } catch (error) {
      throw new Error('Lỗi khi xóa sản phẩm: ' + error.message);
    }
  }

  /**
   * Xóa ảnh trên S3
   */
  static async deleteImageFromS3(imageUrl) {
    try {
      // Trích xuất key từ URL S3
      // URL dạng: https://bucket-name.s3.region.amazonaws.com/products/filename.jpg
      const urlParts = imageUrl.split('/');
      const key = urlParts.slice(-2).join('/'); // products/filename.jpg

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      };

      await s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.error('Lỗi khi xóa ảnh trên S3:', error);
      // Không throw error để không ảnh hưởng đến việc xóa sản phẩm
    }
  }
}

module.exports = ProductModel;