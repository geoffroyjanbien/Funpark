require('dotenv').config();
const supabase = require('./config/supabase');

async function testConnection() {
  console.log('Testing Supabase connection...\n');
  console.log('URL:', process.env.SUPABASE_URL);
  console.log('Key:', process.env.SUPABASE_ANON_KEY ? 'Set ✓' : 'Not set ✗');
  
  try {
    // Test connection by querying categories table
    const { data, error } = await supabase
      .from('categories')
      .select('count');
    
    if (error) {
      console.error('\n❌ Connection failed:', error.message);
      console.log('\nMake sure you have:');
      console.log('1. Created the database schema in Supabase SQL Editor');
      console.log('2. Run the SQL from supabase-schema.sql');
    } else {
      console.log('\n✅ Connection successful!');
      console.log('Ready to migrate data.');
    }
  } catch (err) {
    console.error('\n❌ Error:', err.message);
  }
}

testConnection();
