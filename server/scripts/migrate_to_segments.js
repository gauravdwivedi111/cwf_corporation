import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import SegmentInfo from '../src/models/SegmentInfo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cwf_corporation';

const migrate = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    
    // Drop old segmentinfos collection if it exists to clean up any obsolete indexes (e.g. key_1)
    console.log('Dropping old segmentinfos collection...');
    await mongoose.connection.db.dropCollection('segmentinfos').catch(() => {
      console.log('Collection segmentinfos does not exist or already dropped.');
    });

    // 1. Seed SegmentInfo documents
    const defaultSegments = [
      {
        segment: 'civil',
        displayName: 'Civil & Waterproofing',
        tagline: 'PROTECT • REPAIR • TRANSFORM',
        heroDescription: 'From new construction to existing structures, we provide expert waterproofing consultancy to help you select the right systems, materials, and application strategies.',
        icon: 'ShieldAlert',
        order: 1,
      },
      {
        segment: 'web',
        displayName: 'Web Development',
        tagline: 'CONNECT • DIGITALIZE • GROW',
        heroDescription: '[Placeholder] High-performance React, Node.js, and cloud application engineering tailored for modern enterprises.',
        icon: 'Code',
        order: 2,
      },
      {
        segment: 'finance',
        displayName: 'Finance',
        tagline: 'Corporate Tax Planning & Financial Advisory',
        heroDescription: '[Placeholder] Expert financial consulting, corporate audit compliance, and growth planning for SMEs.',
        icon: 'TrendingUp',
        order: 3,
      },
    ];

    console.log('Upserting SegmentInfo records...');
    for (const seg of defaultSegments) {
      await SegmentInfo.findOneAndUpdate(
        { segment: seg.segment },
        seg,
        { upsert: true, new: true }
      );
      console.log(`- Segment [${seg.segment}] seeded.`);
    }

    // 2. Migrate existing Services via raw collection updates to bypass Mongoose schema validation/stripping
    console.log('Checking existing Services (RAW)...');
    const servicesCollection = mongoose.connection.db.collection('services');
    const servicesToMigrate = await servicesCollection.find({
      $or: [{ segment: { $exists: false } }, { __t: { $exists: false } }],
    }).toArray();
    
    if (servicesToMigrate.length > 0) {
      console.log(`Migrating ${servicesToMigrate.length} services...`);
      const result = await servicesCollection.updateMany(
        { $or: [{ segment: { $exists: false } }, { __t: { $exists: false } }] },
        { $set: { segment: 'civil', __t: 'CivilService' } }
      );
      console.log(`Successfully migrated ${result.modifiedCount} services to CivilService.`);
    } else {
      console.log('No services require segment/discriminator migration.');
    }

    // 3. Migrate existing Projects via raw collection updates
    console.log('Checking existing Projects (RAW)...');
    const projectsCollection = mongoose.connection.db.collection('projects');
    const projectsToMigrate = await projectsCollection.find({
      $or: [{ segment: { $exists: false } }, { __t: { $exists: false } }],
    }).toArray();
    
    if (projectsToMigrate.length > 0) {
      console.log(`Migrating ${projectsToMigrate.length} projects...`);
      const result = await projectsCollection.updateMany(
        { $or: [{ segment: { $exists: false } }, { __t: { $exists: false } }] },
        { $set: { segment: 'civil', __t: 'CivilProject' } }
      );
      console.log(`Successfully migrated ${result.modifiedCount} projects to CivilProject.`);
    } else {
      console.log('No projects require segment/discriminator migration.');
    }

    // 4. Migrate existing Testimonials
    console.log('Checking existing Testimonials (RAW)...');
    const testimonialsCollection = mongoose.connection.db.collection('testimonials');
    const testimonialsToMigrate = await testimonialsCollection.find({ segment: { $exists: false } }).toArray();
    if (testimonialsToMigrate.length > 0) {
      console.log(`Migrating ${testimonialsToMigrate.length} testimonials...`);
      const result = await testimonialsCollection.updateMany(
        { segment: { $exists: false } },
        { $set: { segment: 'civil' } }
      );
      console.log(`Successfully migrated ${result.modifiedCount} testimonials.`);
    } else {
      console.log('No testimonials require segment migration.');
    }

    // 5. Migrate existing BlogPosts
    console.log('Checking existing BlogPosts (RAW)...');
    const blogsCollection = mongoose.connection.db.collection('blogposts');
    const blogsToMigrate = await blogsCollection.find({ segment: { $exists: false } }).toArray();
    if (blogsToMigrate.length > 0) {
      console.log(`Migrating ${blogsToMigrate.length} blog posts...`);
      const result = await blogsCollection.updateMany(
        { segment: { $exists: false } },
        { $set: { segment: 'civil' } }
      );
      console.log(`Successfully migrated ${result.modifiedCount} blog posts.`);
    } else {
      console.log('No blog posts require segment migration.');
    }

    // 6. Migrate existing TeamMembers (segments field)
    console.log('Checking existing TeamMembers (RAW)...');
    const teamCollection = mongoose.connection.db.collection('teammembers');
    const teamToMigrate = await teamCollection.find({ segments: { $exists: false } }).toArray();
    if (teamToMigrate.length > 0) {
      console.log(`Migrating ${teamToMigrate.length} team members...`);
      const result = await teamCollection.updateMany(
        { segments: { $exists: false } },
        { $set: { segments: ['civil'] } }
      );
      console.log(`Successfully migrated ${result.modifiedCount} team members.`);
    } else {
      console.log('No team members require segments array migration.');
    }

    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
