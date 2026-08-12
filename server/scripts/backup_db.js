import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '../backups');

/**
 * Automates database backups by exporting all collections from MongoDB as JSON.
 * Implements a retention policy of keeping the last 7 daily backup directories.
 */
async function runBackup() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cwf_corporation';
  console.log(`Starting automated backup for URI: ${mongoUri}`);

  try {
    // 1. Establish database connection
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // 2. Ensure backup folder exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // 3. Create timestamped backup folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const currentBackupDir = path.join(BACKUP_DIR, `backup-${timestamp}`);
    fs.mkdirSync(currentBackupDir);
    console.log(`Created backup folder: ${currentBackupDir}`);

    // 4. Retrieve all collections dynamically
    const db = mongoose.connection.db;
    const collections = await db.collections();
    console.log(`Found ${collections.length} collections to backup.`);

    // 5. Dump each collection to a separate JSON file
    for (const collection of collections) {
      const name = collection.collectionName;
      const data = await collection.find({}).toArray();
      const filePath = path.join(currentBackupDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  - Exported ${data.length} documents from "${name}" to JSON.`);
    }

    console.log('\nDatabase backup completed successfully!');

    // 6. Enforce Retention Policy (Keep last 7 backups, delete older ones)
    const existingBackups = fs.readdirSync(BACKUP_DIR)
      .map(name => ({
        name,
        path: path.join(BACKUP_DIR, name),
        stat: fs.statSync(path.join(BACKUP_DIR, name))
      }))
      .filter(item => item.stat.isDirectory() && item.name.startsWith('backup-'))
      .sort((a, b) => b.stat.mtime.getTime() - a.stat.mtime.getTime()); // newest first

    console.log(`Total backup history folders: ${existingBackups.length}`);
    if (existingBackups.length > 7) {
      console.log('Enforcing 7-day retention policy...');
      const toDelete = existingBackups.slice(7);
      for (const folder of toDelete) {
        fs.rmSync(folder.path, { recursive: true, force: true });
        console.log(`  - Deleted obsolete backup folder: ${folder.name}`);
      }
    }
  } catch (error) {
    console.error('Backup failed with error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

runBackup();
