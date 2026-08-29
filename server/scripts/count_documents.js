import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SegmentInfo from '../src/models/SegmentInfo.js';
import Service from '../src/models/Service.js';
import Project from '../src/models/Project.js';
import Testimonial from '../src/models/Testimonial.js';
import TeamMember from '../src/models/TeamMember.js';
import BlogPost from '../src/models/BlogPost.js';
import Inquiry from '../src/models/Inquiry.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cwf_corporation';

const printCounts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected.\n');

    console.log('=== COLLECTION COUNTS GROUPED BY SEGMENT ===\n');

    const collections = [
      { name: 'SegmentInfo', model: SegmentInfo },
      { name: 'Service', model: Service },
      { name: 'Project', model: Project },
      { name: 'Testimonial', model: Testimonial },
      { name: 'TeamMember', model: TeamMember, arrayField: 'segments' },
      { name: 'BlogPost', model: BlogPost },
      { name: 'Inquiry', model: Inquiry }
    ];

    for (const item of collections) {
      console.log(`Collection: ${item.name}`);
      
      if (item.name === 'SegmentInfo') {
        const civil = await item.model.countDocuments({ segment: 'civil' });
        const web = await item.model.countDocuments({ segment: 'web' });
        const finance = await item.model.countDocuments({ segment: 'finance' });
        console.log(`  - civil:   ${civil}`);
        console.log(`  - web:     ${web}`);
        console.log(`  - finance: ${finance}`);
      } else if (item.arrayField) {
        const civil = await item.model.countDocuments({ [item.arrayField]: 'civil' });
        const web = await item.model.countDocuments({ [item.arrayField]: 'web' });
        const finance = await item.model.countDocuments({ [item.arrayField]: 'finance' });
        console.log(`  - civil:   ${civil}`);
        console.log(`  - web:     ${web}`);
        console.log(`  - finance: ${finance}`);
      } else {
        const civil = await item.model.countDocuments({ segment: 'civil' });
        const web = await item.model.countDocuments({ segment: 'web' });
        const finance = await item.model.countDocuments({ segment: 'finance' });
        console.log(`  - civil:   ${civil}`);
        console.log(`  - web:     ${web}`);
        console.log(`  - finance: ${finance}`);
      }
      
      const total = await item.model.countDocuments({});
      console.log(`  - Total:   ${total}\n`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error counting documents:', error.message);
    process.exit(1);
  }
};

printCounts();
