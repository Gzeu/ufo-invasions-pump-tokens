import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  // Additional Vercel-optimized settings
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Vercel Functions optimized connection handling
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode (Vercel Functions), create new client
  // but reuse connection pool through global caching
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Database helper functions
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('ufo_invasions_db');
}

// Connection status checker with timeout
export async function checkConnection(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return false;
  }
}

// Graceful connection cleanup for Vercel Functions
export async function closeConnection(): Promise<void> {
  try {
    const client = await clientPromise;
    await client.close();
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Health check with detailed info for debugging
export async function getConnectionInfo(): Promise<{
  connected: boolean;
  database: string;
  collections?: string[];
  error?: string;
}> {
  try {
    const client = await clientPromise;
    const db = client.db('ufo_invasions_db');
    
    // Test connection
    await client.db('admin').command({ ping: 1 });
    
    // Get collections list
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    return {
      connected: true,
      database: 'ufo_invasions_db',
      collections: collectionNames
    };
  } catch (error) {
    return {
      connected: false,
      database: 'ufo_invasions_db',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}