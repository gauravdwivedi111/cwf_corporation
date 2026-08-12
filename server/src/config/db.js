import mongoose from 'mongoose';
import dns from 'dns';

// Force DNS servers to Google DNS only on Windows hosts to bypass local router SRV resolution limitations
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/cwf_corporation'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
