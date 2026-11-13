const https = require('https');

async function testAuth() {
  console.log('Testing NextAuth CSRF and Callback on live https://discordserverlink.com ...');

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

  console.log('CSRF Status:', csrfData.status);
  console.log('CSRF Body:', csrfData.body);
  console.log('Set-Cookie headers:', csrfData.cookies);

  const cookieHeader = (csrfData.cookies || []).map(c => c.split(';')[0]).join('; ');
  console.log('Cookie to send:', cookieHeader);

  // Step 2: Post to /api/auth/callback/credentials
  const postBody = new URLSearchParams({
    csrfToken: csrfData.body.csrfToken,
    email: 'admin@discordserverlink.com',
    password: 'wrongpassword',
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
          body
        });
      });
    });

    req.on('error', reject);
    req.write(postBody);
    req.end();
  });

  console.log('Callback Status:', callbackData.status);
  console.log('Callback Location:', callbackData.headers.location);
  console.log('Callback Body:', callbackData.body);
}

testAuth().catch(console.error);
