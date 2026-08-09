import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../src/models/User.js';
import SiteSettings from '../src/models/SiteSettings.js';

dotenv.config();

/**
 * Seeding script for CWF Corporation.
 * Establishes database defaults (Initial Superadmin + Singleton Settings).
 * Prints generated passwords to console to avoid hardcoded defaults.
 */
const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding operations...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cwf_corporation');
    console.log('Database connected successfully.');

    // 1. Create Initial Superadmin User
    const adminCount = await User.countDocuments({ role: 'superadmin' });
    if (adminCount === 0) {
      console.log('No superadmin account found. Generating initial superadmin credentials...');

      let password = process.env.SEED_ADMIN_PASSWORD;
      let passwordSource = 'environment variable SEED_ADMIN_PASSWORD';

      // Fallback: Dynamically generate a secure random password if env var is empty
      if (!password) {
        password = crypto.randomBytes(8).toString('hex'); // Returns 16 character hex string
        passwordSource = 'random dynamic generation (printed below)';
      }

      const email = 'admin@cwfcorporation.com';

      const superadmin = new User({
        email,
        password,
        role: 'superadmin',
        isActive: true,
      });

      await superadmin.save();

      console.log('\n==================================================');
      console.log('         INITIAL SUPERADMIN ACCOUNT SEEDED        ');
      console.log('--------------------------------------------------');
      console.log(`Email:             ${email}`);
      console.log(`Password:          ${password}`);
      console.log(`Password Source:   ${passwordSource}`);
      if (!process.env.SEED_ADMIN_PASSWORD) {
        console.log('\nIMPORTANT: Copy this password now! It won\'t be printed again.');
      }
      console.log('==================================================\n');
    } else {
      console.log('Superadmin account already exists. Skipping user seed.');
    }

    // 2. Create default singleton SiteSettings
    const settingsCount = await SiteSettings.countDocuments({});
    if (settingsCount === 0) {
      console.log('No SiteSettings document found. Seeding default configurations...');

      await SiteSettings.create({
        companyPhone: '+91 20 1234 5678',
        companyEmail: 'info@cwfcorporation.com',
        address: {
          street: '101, Apex Commercial Hub, MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          country: 'India',
        },
        socialLinks: {
          facebook: 'https://facebook.com/cwfcorporation',
          instagram: 'https://instagram.com/cwfcorporation',
          linkedin: 'https://linkedin.com/company/cwfcorporation',
          twitter: '',
          youtube: '',
        },
        businessHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
        aboutText: 'CWF Corporation Pune provides state of the art waterproofing consultation and structural inspection services.',
        certifications: ['ISO 9001:2015 Structural Safety Certified'],
      });

      console.log('Default SiteSettings seeded successfully.');
    } else {
      console.log('SiteSettings document already exists. Skipping settings seed.');
    }

    console.log('Seeding process completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
