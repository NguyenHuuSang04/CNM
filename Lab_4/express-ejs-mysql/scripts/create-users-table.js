const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamoDBClient } = require('../config/dynamodb');

const params = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

async function createUsersTable() {
  try {
    const command = new CreateTableCommand(params);
    const result = await dynamoDBClient.send(command);
    console.log('✅ Users table created successfully!');
    console.log('Table Status:', result.TableDescription.TableStatus);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Users table already exists.');
    } else {
      console.error('❌ Error creating Users table:', error.message);
    }
  }
}

createUsersTable();
