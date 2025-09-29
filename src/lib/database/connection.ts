import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // În dezvoltare, folosim o variabilă globală pentru a păstra conecțiunea
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // În producție, creăm o nouă conecțiune
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('ufo_invasions');
}

export async function closeConnection(): Promise<void> {
  const client = await clientPromise;
  await client.close();
}

// Utilitar pentru gestionarea tranzacțiilor
export async function withTransaction<T>(
  operation: (db: Db) => Promise<T>
): Promise<T> {
  const client = await clientPromise;
  const session = client.startSession();
  
  try {
    return await session.withTransaction(async () => {
      const db = client.db('ufo_invasions');
      return await operation(db);
    });
  } finally {
    await session.endSession();
  }
}

export default clientPromise;