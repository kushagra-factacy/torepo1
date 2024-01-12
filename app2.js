const express = require('express');

const app = express();

const cors = require('cors');

app.use(cors())

app.get('/', (req, res) =>{
	res.send('Request Recieved!');
});

app.listen(4000, ()=>{
	console.log('Listening on port 4000');
});
