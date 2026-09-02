import mongoose from 'mongoose';
import dns from 'dns';
import { autoSeedIfEmpty } from '../utils/autoSeed.js';

// Force DNS servers to Google DNS only on Windows hosts to bypass local router SRV resolution limitations
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cwf_corporation'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically populate missing divisions, services, projects, and blogs in production database
    await autoSeedIfEmpty();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
