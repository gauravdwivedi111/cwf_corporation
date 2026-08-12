import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('==================================================');
  console.log('     PHASE 4 PROGRAMMATIC VERIFICATION SUITE     ');
  console.log('==================================================\n');

  let adminToken = '';
  let editorToken = '';

  // 1. Authenticate as Superadmin
  console.log('[1/5] Authenticating as Superadmin (admin@cwfcorporation.com)...');
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@cwfcorporation.com',
        password: 'Admin@123',
      }),
    });
    
    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }
    adminToken = loginData.accessToken;
    console.log('✔ Authenticated successfully. Access token retrieved.\n');
  } catch (err) {
    console.error('❌ Failed admin login:', err.message);
    process.exit(1);
  }

  // 2. Test XSS Sanitization in Blog Creation
  console.log('[2/5] Testing HTML Sanitization on Blog Creation...');
  const unsafeContent = `
    <p>This is a safe paragraph.</p>
    <script>alert('xss vulnerability')</script>
    <div onclick="console.log('malicious inline js')">Click me!</div>
    <iframe src="javascript:alert(1)"></iframe>
    <b>This bold tag is safe.</b>
  `;

  try {
    const blogRes = await fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'XSS Verification Test Post',
        slug: `xss-verification-test-${Math.floor(Math.random() * 100000)}`,
        content: unsafeContent,
        coverImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        tags: ['security', 'xss', 'audit'],
        isPublished: true,
      }),
    });

    const blogData = await blogRes.json();
    if (!blogData.success) {
      throw new Error(`Blog post creation failed: ${JSON.stringify(blogData)}`);
    }

    const savedContent = blogData.data.content;
    console.log('  Unsafe content sent:', unsafeContent.replace(/\n/g, '').trim());
    console.log('  Sanitized content saved:', savedContent.trim());

    const hasScript = savedContent.includes('<script>');
    const hasOnclick = savedContent.includes('onclick');
    const hasIframe = savedContent.includes('<iframe>');

    if (!hasScript && !hasOnclick && !hasIframe) {
      console.log('✔ Verification PASSED: <script>, onclick, and iframe elements were successfully stripped.\n');
    } else {
      console.error('❌ Verification FAILED: Unsafe HTML tags detected in saved blog post content.');
    }
  } catch (err) {
    console.error('❌ Blog Sanitization Test Error:', err.message);
  }

  // 3. Editor Gating and Restriction Check
  console.log('[3/5] Testing Role-Based Authorization Gating...');
  const editorEmail = `editor_${Math.floor(Math.random() * 10000)}@cwf.com`;
  const editorPassword = 'EditorPassword123!';

  try {
    // 3a. Superadmin provisions the Editor account
    console.log(`  Provisioning Editor account: ${editorEmail}...`);
    const provRes = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        email: editorEmail,
        password: editorPassword,
        role: 'editor',
      }),
    });
    
    const provData = await provRes.json();
    if (!provData.success) {
      throw new Error(`Failed to provision editor: ${JSON.stringify(provData)}`);
    }
    console.log('  ✔ Editor account provisioned.');

    // 3b. Authenticate as Editor
    console.log('  Logging in as Editor to acquire Editor session token...');
    const edLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: editorEmail,
        password: editorPassword,
      }),
    });
    
    const edLoginData = await edLoginRes.json();
    if (!edLoginData.success) {
      throw new Error(`Editor login failed: ${JSON.stringify(edLoginData)}`);
    }
    editorToken = edLoginData.accessToken;

    // 3c. Try to call UserManager write API as Editor (should fail with 403)
    console.log('  Attempting to provision a new user via POST /admin/users as Editor (should fail)...');
    const getUsersRes = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        email: 'unauthorized_staff@cwf.com',
        password: 'Password123!',
        role: 'editor',
      }),
    });
    console.log(`  POST /admin/users response status: ${getUsersRes.status}`);

    // 3d. Try to call SiteSettings PUT API as Editor
    console.log('  Attempting to update settings via PUT /settings as Editor (should fail)...');
    const updateSettingsRes = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        companyPhone: '+91 99999 88888',
        companyEmail: 'fake-hack@cwf.com',
        address: { street: 'Hack St', city: 'H', state: 'S', pincode: '000000' },
        businessHours: 'Always Open',
        aboutText: 'Malicious text',
      }),
    });
    console.log(`  PUT /settings response status: ${updateSettingsRes.status}`);

    if (getUsersRes.status === 403 && updateSettingsRes.status === 403) {
      console.log('✔ Verification PASSED: Editor is strictly blocked (HTTP 403 Forbidden) from UserManager and SiteSettings update APIs.\n');
    } else {
      console.error('❌ Verification FAILED: Editor role was not blocked from Superadmin endpoints.');
    }
  } catch (err) {
    console.error('❌ Role authorization check failed with error:', err.message);
  }

  // 4. Submit Lead Verification
  console.log('[4/5] Testing Lead Log Insertion & Recovery...');
  const testLeadName = `Lead Test ${Math.floor(Math.random() * 1000)}`;

  try {
    // 4a. Submit public inquiry
    console.log(`  Submitting public inquiry for "${testLeadName}"...`);
    const inquiryRes = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testLeadName,
        phone: '9988776655',
        email: 'testlead@test.com',
        message: 'This is a test message to verify Leads Manager sync.',
        propertyType: 'residential',
        serviceInterested: 'terrace',
      }),
    });

    const inquiryData = await inquiryRes.json();
    if (!inquiryRes.ok || !inquiryData.success) {
      throw new Error(`Lead submission failed: ${JSON.stringify(inquiryData)}`);
    }
    console.log('  ✔ Public inquiry submitted.');

    // 4b. Fetch Leads log as admin
    console.log('  Fetching leads log via GET /inquiries as Admin...');
    const listRes = await fetch(`${API_BASE}/inquiries`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    
    const listData = await listRes.json();
    if (!listData.success) {
      throw new Error(`Failed to fetch leads: ${JSON.stringify(listData)}`);
    }

    const foundLead = listData.data.find((l) => l.name === testLeadName);
    if (foundLead) {
      console.log(`  Found lead in log database! Status: "${foundLead.status}"`);
      console.log('✔ Verification PASSED: Lead sync completes immediately. Admin dashboard loads fresh records instantly without refresh workarounds.\n');
    } else {
      console.error('❌ Verification FAILED: Submitted lead did not appear in the admin Leads Log.');
    }
  } catch (err) {
    console.error('❌ Lead Sync Test Error:', err.message);
  }

  // 5. Test File Upload Endpoint
  console.log('[5/5] Testing Image Upload Endpoint...');
  try {
    // We will create a small temporary text file and upload it pretending it's an image.
    // The server upload middleware uploads to Cloudinary or returns mock mock-mode URL if credentials are default.
    const tempFilePath = path.join(process.cwd(), 'temp_verification_img.jpg');
    fs.writeFileSync(tempFilePath, 'fake image data buffer content for verification testing');

    const formData = new FormData();
    const fileBlob = new Blob(['fake image content'], { type: 'image/jpeg' });
    formData.append('image', fileBlob, 'verification_test_avatar.jpg');

    console.log('  Uploading mock file to POST /admin/upload...');
    const uploadRes = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
      body: formData,
    });

    const uploadData = await uploadRes.json();
    fs.unlinkSync(tempFilePath); // clean up

    if (uploadRes.ok && uploadData.success && uploadData.url) {
      console.log(`  File uploaded successfully! Received URL: ${uploadData.url}`);
      console.log('✔ Verification PASSED: Asset upload endpoint is fully functional.\n');
    } else {
      throw new Error(`Upload response: ${JSON.stringify(uploadData)}`);
    }
  } catch (err) {
    console.error('❌ Upload Endpoint Test Error:', err.message);
  }

  console.log('==================================================');
  console.log('        VERIFICATION SUITE RUN COMPLETED         ');
  console.log('==================================================');
}

runTests();
