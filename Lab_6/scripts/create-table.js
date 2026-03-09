/**
 * scripts/create-table.js
 * Run with:  npm run setup
 * Creates the DynamoDB "Products" table if it does not already exist.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const {
    DynamoDBClient,
    CreateTableCommand,
    DescribeTableCommand,
} = require('@aws-sdk/client-dynamodb');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Products_Sang_gk';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function run() {
    // ── Check if table already exists ─────────────────────────────────────────
    try {
        const desc = await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
        console.log(`✅  Bảng "${TABLE_NAME}" đã tồn tại (trạng thái: ${desc.Table.TableStatus}). Không cần tạo lại.`);
        return;
    } catch (err) {
        if (err.name !== 'ResourceNotFoundException') throw err;
    }

    // ── Create table ──────────────────────────────────────────────────────────
    console.log(`🔧  Đang tạo bảng "${TABLE_NAME}"...`);

    await client.send(
        new CreateTableCommand({
            TableName: TABLE_NAME,
            KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
            AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
            BillingMode: 'PAY_PER_REQUEST',
        })
    );

    // ── Wait for ACTIVE ────────────────────────────────────────────────────────
    console.log('⏳  Đang chờ bảng khởi động...');
    let status = 'CREATING';
    while (status !== 'ACTIVE') {
        await new Promise((r) => setTimeout(r, 2000));
        const r = await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
        status = r.Table.TableStatus;
        process.stdout.write(`   Trạng thái: ${status}\r`);
    }

    console.log(`\n✅  Bảng "${TABLE_NAME}" đã sẵn sàng!`);
    console.log('   Khóa chính : id (String)');
    console.log('   Thuộc tính : name, image, price (Number), quantity (Number)');
}

run().catch((err) => {
    console.error('❌  Lỗi:', err.message);
    process.exit(1);
});