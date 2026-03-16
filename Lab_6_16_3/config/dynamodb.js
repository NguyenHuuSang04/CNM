const { DynamoDBClient, DescribeTableCommand, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const region = process.env.AWS_REGION || "ap-southeast-1";
const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
const tableName = process.env.PRODUCTS_TABLE || "Products";

const dynamoClient = new DynamoDBClient({
  region,
  endpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "fakeMyKeyId",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "fakeSecretAccessKey",
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

async function ensureProductsTable() {
  try {
    await dynamoClient.send(new DescribeTableCommand({ TableName: tableName }));
    console.log(`Table ${tableName} already exists.`);
  } catch (error) {
    if (error.name !== "ResourceNotFoundException") {
      throw error;
    }

    await dynamoClient.send(
      new CreateTableCommand({
        TableName: tableName,
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        BillingMode: "PAY_PER_REQUEST",
      })
    );

    console.log(`Created table ${tableName}.`);
  }
}

module.exports = {
  dynamoClient,
  docClient,
  tableName,
  ensureProductsTable,
};
