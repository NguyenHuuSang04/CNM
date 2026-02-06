const BaseRepository = require('./base.repository');
const { v4: uuidv4 } = require('uuid');

class ProductLogRepository extends BaseRepository {
  constructor() {
    super('ProductLogs');
  }

  async createLog(logData) {
    const log = {
      logId: uuidv4(),
      productId: logData.productId,
      action: logData.action, // CREATE, UPDATE, DELETE
      userId: logData.userId,
      changes: logData.changes || {},
      timestamp: new Date().toISOString(),
    };
    return await this.create(log);
  }

  async getLogsByProduct(productId) {
    return await this.findAll(
      'productId = :productId',
      { ':productId': productId }
    );
  }

  async getLogsByUser(userId) {
    return await this.findAll(
      'userId = :userId',
      { ':userId': userId }
    );
  }

  async getAllLogs() {
    return await this.findAll();
  }
}

module.exports = new ProductLogRepository();
