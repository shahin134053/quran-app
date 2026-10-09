const https = require('https');

const query = `[out:json];nwr(around:5000, 23.8103, 90.4125)[amenity=place_of_worship][religion=muslim];out center;`;
const postData = `data=${encodeURIComponent(query)}`;

const options = {
  hostname: 'overpass-api.de',
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(res.statusCode, data.substring(0, 200)));
});

req.on('error', err => console.error(err));
req.write(postData);
req.end();
