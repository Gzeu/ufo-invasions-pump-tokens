const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

/**
 * Test MongoDB Connection
 * Verifică conectivitatea la MongoDB Atlas
 */

async function testConnection() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('🛠️ Run: vercel env pull .env.local');
    console.log('🛠️ Or configure MongoDB Atlas integration in Vercel dashboard');
    process.exit(1);
  }
  
  console.log('🔄 Testing MongoDB Atlas connection...');
  console.log(`📍 Database: ufo_invasions_db`);
  
  const client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  
  try {
    // Connect
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Test database operations
    const db = client.db('ufo_invasions_db');
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections:`);
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`  - ${collection.name}: ${count} documents`);
    }
    
    // Test ping
    const pingResult = await client.db('admin').command({ ping: 1 });
    console.log('🏓 Ping successful!', pingResult.ok === 1 ? '✅' : '❌');
    
    // Connection info
    const serverStatus = await client.db('admin').command({ serverStatus: 1 });
    console.log(`🗺️ Server: ${serverStatus.host}`);
    console.log(`🕰️ Uptime: ${Math.floor(serverStatus.uptime / 3600)}h`);
    
    console.log('\n🎆 MongoDB connection test completed successfully!');
    console.log('🚀 Ready for Vercel deployment!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🛠️ Troubleshooting:');
      console.log('1. Check if MONGODB_URI is correct');
      console.log('2. Verify network connectivity');
      console.log('3. Ensure MongoDB Atlas cluster is running');
    } else if (error.message.includes('Authentication')) {
      console.log('\n🛠️ Authentication issue:');
      console.log('1. Check username/password in connection string');
      console.log('2. Verify database user permissions');
      console.log('3. Check IP whitelist in MongoDB Atlas');
    }
    
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔐 Connection closed');
  }
}

testConnection();