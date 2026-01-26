require('dotenv').config();
const ProductModel = require('../models/product.model');

// Dữ liệu mẫu
const sampleProducts = [
  {
    name: 'iPhone 15 Pro Max 256GB',
    price: 29990000,
    quantity: 50,
    url_image: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/iphone-15-pro-max-blue-1.png'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 25990000,
    quantity: 30,
    url_image: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2024/01/17/samsung-galaxy-s24-ultra-black-1.png'
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    price: 45000000,
    quantity: 10,
    url_image: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/10/31/macbook-pro-14-m3-pro-space-black-1.png'
  },
  {
    name: 'AirPods Pro 2 USB-C',
    price: 5990000,
    quantity: 100,
    url_image: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/airpods-pro-2-usb-c-1.png'
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    price: 10990000,
    quantity: 25,
    url_image: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/apple-watch-series-9-gps-45mm-pink-1.png'
  },
  {
    name: 'iPad Pro 11" M2 WiFi 128GB',
    price: 19990000,
    quantity: 15,
    url_image: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2022/10/18/ipad-pro-11-m2-wifi-128gb-silver-1.png'
  }
];

async function seedData() {
  console.log('🌱 Bắt đầu seed dữ liệu mẫu...\n');

  try {
    // Kiểm tra xem đã có dữ liệu chưa
    const existingProducts = await ProductModel.getAll();
    
    if (existingProducts.length > 0) {
      console.log(`⚠️  Đã có ${existingProducts.length} sản phẩm trong database.`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('Bạn có muốn thêm dữ liệu mẫu nữa không? (y/n): ', async (answer) => {
        readline.close();
        
        if (answer.toLowerCase() !== 'y') {
          console.log('❌ Đã hủy seed dữ liệu.');
          process.exit(0);
        }
        
        await insertProducts();
      });
    } else {
      await insertProducts();
    }
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error.message);
    process.exit(1);
  }
}

async function insertProducts() {
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < sampleProducts.length; i++) {
    try {
      const product = sampleProducts[i];
      console.log(`[${i + 1}/${sampleProducts.length}] Thêm: ${product.name}...`);
      
      const productId = await ProductModel.create(product);
      console.log(`   ✅ Đã thêm với ID: ${productId}`);
      successCount++;
      
      // Delay 200ms giữa các lần insert
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`   ❌ Lỗi: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 KẾT QUẢ SEED DỮ LIỆU:');
  console.log(`   ✅ Thành công: ${successCount} sản phẩm`);
  console.log(`   ❌ Thất bại: ${failCount} sản phẩm`);
  console.log('='.repeat(60));
  console.log('\n🎉 Hoàn tất! Truy cập http://localhost:3000 để xem kết quả.\n');
  
  process.exit(0);
}

// Chạy seed
seedData();
