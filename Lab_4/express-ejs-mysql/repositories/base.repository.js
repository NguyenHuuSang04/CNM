const { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async create(item) {
    const params = {
      TableName: this.tableName,
      Item: item,
    };
    await docClient.send(new PutCommand(params));
    return item;
  }

  async findById(key) {
    const params = {
      TableName: this.tableName,
      Key: key,
    };
    const data = await docClient.send(new GetCommand(params));
    return data.Item || null;
  }

  async findAll(filterExpression = null, expressionValues = null) {
    const params = {
      TableName: this.tableName,
    };

    if (filterExpression) {
      params.FilterExpression = filterExpression;
      params.ExpressionAttributeValues = expressionValues;
    }

    const data = await docClient.send(new ScanCommand(params));
    return data.Items || [];
  }

  async update(key, updateExpression, expressionNames, expressionValues) {
    const params = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: 'ALL_NEW',
    };
    
    // Only add ExpressionAttributeNames if it's not empty
    if (expressionNames && Object.keys(expressionNames).length > 0) {
      params.ExpressionAttributeNames = expressionNames;
    }
    
    const data = await docClient.send(new UpdateCommand(params));
    return data.Attributes;
  }

  async delete(key) {
    const params = {
      TableName: this.tableName,
      Key: key,
    };
    await docClient.send(new DeleteCommand(params));
    return true;
  }

  async scan(params = {}) {
    const scanParams = {
      TableName: this.tableName,
      ...params,
    };
    const data = await docClient.send(new ScanCommand(scanParams));
    return data.Items || [];
  }

  async query(params) {
    const queryParams = {
      TableName: this.tableName,
      ...params,
    };
    const data = await docClient.send(new QueryCommand(queryParams));
    return data.Items || [];
  }
}

module.exports = BaseRepository;
