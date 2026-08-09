import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import Project from '../src/models/Project.js';
import Testimonial from '../src/models/Testimonial.js';
import BlogPost from '../src/models/BlogPost.js';
import Inquiry from '../src/models/Inquiry.js';
import TeamMember from '../src/models/TeamMember.js';
import SiteSettings from '../src/models/SiteSettings.js';

console.log('=== CWF Corporation Model Verification Dry-Run ===\n');

const modelsList = [
  { name: 'User', model: User },
  { name: 'Service', model: Service },
  { name: 'Project', model: Project },
  { name: 'Testimonial', model: Testimonial },
  { name: 'BlogPost', model: BlogPost },
  { name: 'Inquiry', model: Inquiry },
  { name: 'TeamMember', model: TeamMember },
  { name: 'SiteSettings', model: SiteSettings },
];

let failed = false;

for (const item of modelsList) {
  try {
    // Check if the model is registered on mongoose
    if (mongoose.model(item.name)) {
      console.log(`[SUCCESS] ${item.name} schema compiles and registers successfully.`);
    } else {
      throw new Error(`Model ${item.name} was imported but not registered in mongoose.models`);
    }
  } catch (error) {
    console.error(`[FAILURE] Verification failed for ${item.name}: ${error.message}`);
    failed = true;
  }
}

console.log('\n==================================================');
if (failed) {
  console.error('VERIFICATION FAILED: One or more models contain errors.');
  process.exit(1);
} else {
  console.log('VERIFICATION PASSED: All models are syntactically and structurally correct.');
  process.exit(0);
}
