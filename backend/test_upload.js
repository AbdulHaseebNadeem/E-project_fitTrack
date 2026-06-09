const BASE_URL = 'http://localhost:5000/api';

async function runTest() {
  try {
    console.log('1. Registering test user...');
    const email = `testuser_${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: 'password123',
        phone: `0300${Math.floor(1000000 + Math.random() * 9000000)}`,
        country: 'Pakistan'
      })
    });
    
    if (!regRes.ok) {
      throw new Error(`Register failed: ${await regRes.text()}`);
    }

    const regData = await regRes.json();
    const token = regData.token;
    console.log('Token received:', token);

    // Create a dummy image buffer (a valid 1x1 PNG pixel or just dummy bytes)
    // We can use a simple FormData and append a Blob representing a dummy file
    const formData = new FormData();
    const blob = new Blob(['dummy content'], { type: 'image/png' });
    formData.append('profilePicture', blob, 'avatar.png');

    console.log('2. Uploading profile picture...');
    const uploadRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Note: Do NOT set Content-Type header when sending FormData with fetch!
        // Fetch will automatically set Content-Type to multipart/form-data with the correct boundary.
      },
      body: formData
    });

    console.log('Response Status:', uploadRes.status);
    const text = await uploadRes.text();
    console.log('Response Body:', text);
  } catch (err) {
    console.error('Test failed with error:', err.message);
  }
}

runTest();
