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
      const errorText = await regRes.text();
      throw new Error(`Register failed: ${errorText}`);
    }

    const regData = await regRes.json();
    const token = regData.token;
    console.log('Token received:', token);

    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('2. Fetching plan (should be no active plan)...');
    const getRes1 = await fetch(`${BASE_URL}/plan`, { headers });
    const getData1 = await getRes1.json();
    console.log('Response 1:', getData1);

    console.log('3. Starting plan...');
    const startRes = await fetch(`${BASE_URL}/plan`, {
      method: 'POST',
      headers
    });
    const startData = await startRes.json();
    console.log('Response start:', startData);

    console.log('4. Fetching plan again...');
    const getRes2 = await fetch(`${BASE_URL}/plan`, { headers });
    const getData2 = await getRes2.json();
    console.log('Response 2:', getData2);
  } catch (err) {
    console.error('Test failed with error:', err.message);
  }
}

runTest();
