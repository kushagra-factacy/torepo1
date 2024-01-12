
const express = require('express');
const app = express();
const CosmosClient = require("@azure/cosmos").CosmosClient;
const cors = require('cors');
const https=require('https')
const fs=require('fs')
const path=require('path')


//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/factacyinsights.in/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/factacyinsights.in/fullchain.pem')
 };


const axios = require('axios');

const cmp = 'FAC' + '*';

const mcn = '*';

axios.get(`http://74.249.50.68:8983/solr/ncore/select?q=MCA_COMPANY_NAME:${cmp}*&MCA_CIN:${mcn}`)
.then((response) => {
    let d = response.data;
    d = d['response'];
    console.log(d['docs']);
})
.catch((error) => console.log(error));


const port = 443;

https.createServer(options, app).listen(port, () => {
  console.log('Server listening on port ' + port);
});
