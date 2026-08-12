import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('=== Cloudinary Credentials Verification ===');
console.log(`Cloud Name: ${cloudName || '(Not set)'}`);
console.log(`API Key:    ${apiKey ? '*'.repeat(apiKey.length - 4) + apiKey.slice(-4) : '(Not set)'}`);
console.log(`API Secret: ${apiSecret ? '(Set)' : '(Not set)'}`);
console.log('===========================================\n');

if (!cloudName || !apiKey || !apiSecret || cloudName === 'demo' || apiKey === '1234567890') {
  console.log('⚠️ [MOCK MODE] Mock or default Cloudinary credentials detected in server/.env.');
  console.log('To run a real upload test, please configure real Cloudinary credentials first.');
  process.exit(0);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// A tiny 1x1 transparent GIF base64 string
const base64Image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

console.log('🚀 Attempting a real test upload to Cloudinary...');

try {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: 'cwf_handover_test',
    resource_type: 'image',
  });
  console.log('\n✅ [SUCCESS] Real image upload to Cloudinary succeeded!');
  console.log(`Uploaded URL: ${result.secure_url}`);
  console.log(`Public ID:    ${result.public_id}`);
} catch (error) {
  console.error('\n❌ [FAILURE] Cloudinary upload failed:');
  console.error(error);
  process.exit(1);
}
