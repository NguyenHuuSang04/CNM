const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { docClient } = require('../config/dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

async function seedData() {
  console.log('🌱 Starting seed data...\n');

  try {
    // 1. Tạo admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      userId: uuidv4(),
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    await docClient.send(new PutCommand({
      TableName: 'Users',
      Item: adminUser
    }));
    console.log('✅ Admin user created (username: admin, password: admin123)\n');

    // 2. Tạo staff user
    console.log('👤 Creating staff user...');
    const staffPassword = await bcrypt.hash('staff123', 10);
    const staffUser = {
      userId: uuidv4(),
      username: 'staff',
      password: staffPassword,
      role: 'staff',
      createdAt: new Date().toISOString()
    };
    await docClient.send(new PutCommand({
      TableName: 'Users',
      Item: staffUser
    }));
    console.log('✅ Staff user created (username: staff, password: staff123)\n');

    // 3. Tạo danh mục
    console.log('📁 Creating categories...');
    const categories = [
      { categoryId: uuidv4(), name: 'Điện thoại', description: 'Các loại điện thoại thông minh' },
      { categoryId: uuidv4(), name: 'Laptop', description: 'Máy tính xách tay' },
      { categoryId: uuidv4(), name: 'Phụ kiện', description: 'Phụ kiện công nghệ' },
      { categoryId: uuidv4(), name: 'Tablet', description: 'Máy tính bảng' },
      { categoryId: uuidv4(), name: 'Đồng hồ thông minh', description: 'Smartwatch và thiết bị đeo' }
    ];

    for (const cat of categories) {
      cat.createdAt = new Date().toISOString();
      await docClient.send(new PutCommand({
        TableName: 'Categories',
        Item: cat
      }));
      console.log(`  ✓ Created: ${cat.name}`);
    }
    console.log('✅ All categories created\n');

    // 4. Tạo sản phẩm mẫu
    console.log('📦 Creating sample products...');
    const products = [
      {
        productId: uuidv4(),
        name: 'iPhone 15 Pro Max',
        price: 29990000,
        quantity: 15,
        categoryId: categories[0].categoryId, // Điện thoại
        url_image: 'https://example.com/iphone15.jpg',
        isDeleted: false
      },
      {
        productId: uuidv4(),
        name: 'Samsung Galaxy S24 Ultra',
        price: 26990000,
        quantity: 8,
        categoryId: categories[0].categoryId,
        url_image: 'https://example.com/s24.jpg',
        isDeleted: false
      },
      {
        productId: uuidv4(),
        name: 'MacBook Pro 16" M3',
        price: 54990000,
        quantity: 3,
        categoryId: categories[1].categoryId, // Laptop
        url_image: 'https://example.com/macbook.jpg',
        isDeleted: false
      },
      {
        productId: uuidv4(),
        name: 'Dell XPS 15',
        price: 42990000,
        quantity: 0,
        categoryId: categories[1].categoryId,
        url_image: 'https://example.com/dell.jpg',
        isDeleted: false
      },
      {
        productId: uuidv4(),
        name: 'AirPods Pro Gen 2',
        price: 5990000,
        quantity: 25,
        categoryId: categories[2].categoryId, // Phụ kiện
        url_image: 'https://example.com/airpods.jpg',
        isDeleted: false
      },
      {
        productId: uuidv4(),
        name: 'iPad Pro 12.9"',
        price: 28990000,
        quantity: 12,
        categoryId: categories[3].categoryId, // Tablet
        url_image: 'https://example.com/ipad.jpg',
        isDeleted: false
      },
      {
        productId: uuidv4(),
        name: 'Apple Watch Ultra 2',
        price: 19990000,
        quantity: 4,
        categoryId: categories[4].categoryId, // Đồng hồ
        url_image: 'https://example.com/watch.jpg',
        isDeleted: false
      }
    ];

    for (const product of products) {
      product.createdAt = new Date().toISOString();
      await docClient.send(new PutCommand({
        TableName: 'Products',
        Item: product
      }));
      console.log(`  ✓ Created: ${product.name} (Quantity: ${product.quantity})`);
    }
    console.log('✅ All products created\n');

    console.log('🎉 Seed data completed successfully!\n');
    console.log('📋 Summary:');
    console.log('  - 2 users (admin, staff)');
    console.log('  - 5 categories');
    console.log('  - 7 products');
    console.log('\n🔐 Login credentials:');
    console.log('  Admin: username=admin, password=admin123');
    console.log('  Staff: username=staff, password=staff123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedData();

