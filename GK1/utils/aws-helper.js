require("dotenv").config();
const AWS = require("aws-sdk");
//Load eviroment giá trị từ file .env để config cho AWS SDK

AWS.config.update({
    region: process.env.REGION, 
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3(); // khởi tạo s3 service object
const dynamodb = new AWS.DynamoDB.DocumentClient(); // khởi tạo dynamo service object

module.exports = {s3, dynamodb}; 