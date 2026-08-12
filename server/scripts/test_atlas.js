import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Force DNS servers to Google DNS on Windows
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

async function checkDatabase() {
  console.log(`Connecting to: ${MONGO_URI}`);
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully.');

    const db = mongoose.connection.db;
    console.log(`Connected to database name: ${mongoose.connection.name}`);

    // List all collections
    const collections = await db.collections();
    console.log(`Found ${collections.length} collections:`);

    for (const col of collections) {
      const count = await col.countDocuments({});
      console.log(`  - Collection: "${col.collectionName}" | Count: ${count}`);
    }

  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

checkDatabase();
