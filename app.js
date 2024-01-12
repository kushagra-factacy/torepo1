const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/factacyinsights.in/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/factacyinsights.in/fullchain.pem'),
};

app.use((req, res, next) => {
  res.send('<h1>HTTPS is working!</h1>');
});

const port = 443;

https.createServer(options, app).listen(port, () => {
  console.log('Server listening on port ' + port);
});
