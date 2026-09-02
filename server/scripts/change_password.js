import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log('\nUsage: node server/scripts/change_password.js <email> <new_password>\n');
  console.log('Example: node server/scripts/change_password.js admin@cwfcorporation.com MyNewPassword123!\n');
  process.exit(1);
}

if (newPassword.length < 6) {
  console.error('Error: Password must be at least 6 characters long.');
  process.exit(1);
}

const run = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cwf_corporation';
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(mongoUri);

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.error(`Error: User with email "${email}" not found in database.`);
      process.exit(1);
    }

    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    console.log(`\n========================================`);
    console.log(` SUCCESS: Password updated successfully!`);
    console.log(`----------------------------------------`);
    console.log(` User:     ${user.email}`);
    console.log(` Role:     ${user.role}`);
    console.log(` Status:   Active`);
    console.log(`========================================\n`);
  } catch (err) {
    console.error(`Failed to update password:`, err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
