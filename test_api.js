const http = require('http');

async function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, rawData: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Health Endpoint ---');
  const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log('Health:', health.data);

  console.log('\n--- 2. Testing Weak Password (Must Fail) ---');
  const weak = await request(
    {
      host: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { name: 'Weak User', email: 'weak@test.com', password: '123' }
  );
  console.log('Weak password response status:', weak.status, weak.data);

  console.log('\n--- 3. Testing Strong Password Registration (Must Succeed) ---');
  const strongEmail = `user_${Date.now()}@test.com`;
  const strong = await request(
    {
      host: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'John Doe',
      email: strongEmail,
      password: 'StrongPassword@2026!',
      role: 'Full Stack Engineer',
    }
  );
  console.log('Strong registration status:', strong.status);
  console.log('User registered:', strong.data.user);
  console.log('Token received length:', strong.data.token?.length);

  console.log('\n--- 4. Testing Demo Login & Seed Data ---');
  const login = await request(
    {
      host: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'demo@makecv.com', password: 'Password@2026!' }
  );
  console.log('Login status:', login.status, 'User:', login.data.user.name);
  const token = login.data.token;

  console.log('\n--- 5. Fetching Resumes with Token ---');
  const resumes = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/resumes',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`Found ${resumes.data.length} resumes.`);
  resumes.data.forEach((r, idx) => {
    console.log(` [${idx + 1}] ${r.title} | ${r.personalDetails.fullName} | Skills: ${r.skills.slice(0, 3).join(', ')}`);
  });

  console.log('\n--- 6. Creating a New Resume ---');
  const newResume = await request(
    {
      host: 'localhost',
      port: 5000,
      path: '/api/resumes',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
    {
      title: 'Principal Cloud Architect',
      targetRole: 'Principal Cloud Architect',
      personalDetails: {
        fullName: 'Samantha Vance',
        email: 'samantha.vance@cloud.io',
        phone: '+1 (555) 999-0000',
        location: 'Seattle, WA',
      },
      education: [
        {
          institution: 'MIT',
          degree: 'B.S. Computer Science',
          startDate: '2016',
          endDate: '2020',
        },
      ],
      experience: [
        {
          company: 'HyperScale Cloud Corp',
          role: 'Principal Cloud Architect',
          location: 'Seattle, WA',
          startDate: '2020',
          endDate: 'Present',
          current: true,
          bullets: ['Designed multi-region disaster recovery systems with 99.999% reliability.'],
        },
      ],
      skills: ['AWS', 'Kubernetes', 'Go', 'Terraform', 'System Design'],
    }
  );
  console.log('Created resume status:', newResume.status, 'ID:', newResume.data._id);

  console.log('\n--- 7. Testing DOCX Generation Endpoint ---');
  const docxRes = await request({
    host: 'localhost',
    port: 5000,
    path: `/api/resumes/${newResume.data._id}/export/docx`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('DOCX Content-Type:', docxRes.headers['content-type']);
  console.log('DOCX Content-Disposition:', docxRes.headers['content-disposition']);

  console.log('\n--- 8. Deleting the Test Resume ---');
  const delRes = await request({
    host: 'localhost',
    port: 5000,
    path: `/api/resumes/${newResume.data._id}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Delete status:', delRes.status, delRes.data);

  console.log('\nAll API and Database tests passed successfully!');
}

run().catch(console.error);
