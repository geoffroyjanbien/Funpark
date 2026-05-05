const bcrypt = require('bcryptjs');

async function generateHashes() {
  const password = 'admin123'; // Change this!
  
  const hash1 = await bcrypt.hash(password, 10);
  const hash2 = await bcrypt.hash('viewer123', 10);
  
  console.log('\n=== Password Hashes Generated ===\n');
  console.log('Admin user (username: admin, password: admin123):');
  console.log(hash1);
  console.log('\nViewer user (username: viewer, password: viewer123):');
  console.log(hash2);
  console.log('\n=== Copy these hashes to the SQL INSERT statements ===\n');
}

generateHashes();
