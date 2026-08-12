import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Starts a real MongoDB engine in-memory on the standard port 27017.
 * This runs the actual MongoDB binary locally, enabling Mongoose schemas,
 * database indexes, queries, and seeding scripts to validate correctly.
 */
async function startDB() {
  console.log('Initializing in-memory MongoDB server download and startup...');
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'cwf_corporation',
      },
    });

    console.log('\n=== IN-MEMORY MONGODB IS ACTIVE ===');
    console.log(`URI:      ${mongod.getUri()}`);
    console.log('Address:  mongodb://127.0.0.1:27017/cwf_corporation');
    console.log('Status:   Active and listening for connections on port 27017.');
    console.log('====================================\n');
    console.log('Keep this terminal process open to maintain the database connection.');
  } catch (error) {
    console.error('Failed to start in-memory MongoDB engine:', error.message);
    process.exit(1);
  }
}

startDB();
