const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  PutCommand, 
  DeleteCommand 
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

// Khởi tạo DynamoDB Client
const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "ProductTable";

// Lấy tất cả sản phẩm
const getAllProducts = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME
  });
  
  try {
    const response = await docClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Thêm sản phẩm mới
const createProduct = async (name, price, description) => {
  const product = {
    id: uuidv4(),
    name,
    price: parseFloat(price),
    description
  };
  
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: product
  });
  
  try {
    await docClient.send(command);
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Xóa sản phẩm theo ID
const deleteProduct = async (id) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  });
  
  try {
    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct
};
