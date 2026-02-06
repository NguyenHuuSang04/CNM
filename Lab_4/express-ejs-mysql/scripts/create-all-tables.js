const { execSync } = require('child_process');

console.log('🚀 Creating all DynamoDB tables...\n');

const scripts = [
  'create-users-table.js',
  'create-categories-table.js',
  'create-products-table.js',
  'create-productlogs-table.js'
];

for (const script of scripts) {
  console.log(`Running ${script}...`);
  try {
    execSync(`node scripts/${script}`, { stdio: 'inherit' });
    console.log('');
  } catch (error) {
    console.error(`Failed to run ${script}`);
  }
}

console.log('✅ All tables creation scripts completed!');
console.log('⏳ Wait a few seconds for tables to become ACTIVE before running seed-data.js');
