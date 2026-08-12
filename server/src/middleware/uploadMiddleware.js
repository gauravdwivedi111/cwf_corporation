import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up in-memory storage for file processing
const storage = multer.memoryStorage();

// Restrict mime types to safe image formats
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP formats are allowed.'), false);
  }
};

/**
 * Multer middleware configured for server-side type and size validation.
 */
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

/**
 * Uploads a file buffer directly to Cloudinary using streams.
 * Prevents writing files to temporary disk storage.
 * 
 * @param {Buffer} fileBuffer - File raw binary buffer from Multer
 * @param {string} folder - Destination folder in Cloudinary
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
export const uploadToCloudinary = (fileBuffer, folder = 'cwf_corporation') => {
  // Offline mock mode bypass if credentials are set to fake default values
  if (
    !process.env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY === '1234567890' ||
    process.env.CLOUDINARY_CLOUD_NAME === 'demo'
  ) {
    return Promise.resolve('https://res.cloudinary.com/demo/image/upload/sample.jpg');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};
