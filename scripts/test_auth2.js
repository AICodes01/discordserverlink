const https = require('https');

async function testAuth(email, password) {
  // Step 1: Get CSRF token and cookies
  const csrfData = await new Promise((resolve, reject) => {
    https.get('https://discordserverlink.com/api/auth/csrf', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          cookies: res.headers['set-cookie'],
          body: JSON.parse(body)
        });
      });
    }).on('error', reject);
  });

  const cookieHeader = (csrfData.cookies || []).map(c => c.split(';')[0]).join('; ');

  // Step 2: Post to /api/auth/callback/credentials
  const postBody = new URLSearchParams({
    csrfToken: csrfData.body.csrfToken,
    email,
    password,
    callbackUrl: 'https://discordserverlink.com/admin',
    json: 'true'
  }).toString();

  const callbackData = await new Promise((resolve, reject) => {
    const req = https.request('https://discordserverlink.com/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postBody),
        'Cookie': cookieHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Origin': 'https://discordserverlink.com',
        'Referer': 'https://discordserverlink.com/taplu'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          cookies: res.headers['set-cookie'],
          body
        });
      });
    });

    req.on('error', reject);
    req.write(postBody);
    req.end();
  });

  console.log('Result for', email, password, ':');
  console.log('Status:', callbackData.status);
  console.log('Body:', callbackData.body);
  console.log('Cookies:', (callbackData.cookies || []).map(c => c.split(';')[0]));
}

async function run() {
  await testAuth('admin@discordserverlink.com', 'admin123456');
  await testAuth('admin@discordserverlink.com', 'J6H!nnQ#8');
}

run();
