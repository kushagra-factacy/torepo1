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
	cert: fs.readFileSync('/etc/letsencrypt/live/factacyinsights.in/fullchain.pem'),
  };


app.get( '/', (req, res) => {

 //console.log(req.params);
 //console.log(req.body);
//	 console.log(req.body);
	 console.log(req.query);

const p = req.query.input;

 //const p = 'NIKON';
console.log(p);
	 
(async(sterm) => {
  try{

const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;

var x = { endpoint, key }

const cosmosClient = new CosmosClient( x );

const databaseName = 'heimdall-db'

// Create database if it doesn't exist
const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
console.log(`${database.id} database ready`);

const containerName = 'heimdall-v2'

const { container } = await database.containers.createIfNotExists({
    id: containerName
});

console.log(`${container.id} container ready`);

const querySpec2 = {

    query: "SELECT * FROM heimdall c WHERE  STARTSWITH(c.MCA_COMPANY_NAME, @keyword)",
    parameters: [
        {
            name: '@keyword',
            value: sterm
        }
    ]

};


// // Get items 
const { resources } = await container.items.query(querySpec2).fetchAll();


console.log(typeof(resources));

console.log(resources.length);

if(resources.length > 15){
	res.send(resources.slice(0,5));
}else{
	res.send(resources);
}

//for (const item of resources) {
  //  console.log(item);
//}

//res.send(resources);

}catch(err){
	console.log(err);
}
})(p);

  //res.send('Server Responding!')
})


app.get('/news' , (req,res) => {

	(async() => {

		try{

			      let today = new Date().toISOString().slice(0, 10);
			      //today = today + '%';
			      //console.log(today);

g		      //let testdate = new Date().toISOString() ;

			      console.log(today);
                              let date = new Date().toISOString();

			      last = date.slice(11,13);

			      li = Number(last);


			      console.log(last);
			      console.log(li);
			      
			      li_str = li.toString();
			      
			      today = today + 'T' + li_str + '%';
			      
			      const key = process.env.COSMOS_KEY;
			      const endpoint = process.env.COSMOS_ENDPOINT;

			      var x = { endpoint, key }
			      
			      const cosmosClient = new CosmosClient( x );
			      
			      const databaseName = 'cdb-L1'

			      const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
			      console.log(`${database.id} database ready`);
			      
			      const containerName = 'ai-cite-ic'
			      
			      const { container } = await database.containers.createIfNotExists({
				                id: containerName
			      });

			      console.log(`${container.id} container ready`);
			      
			      const querySpec3 = {
				            
				                query: "SELECT * FROM c where c.Date LIKE @keyword",
				      		parameters : [
							{
								name : '@keyword',
								value : today
							}
						]
				            };
			
			     console.log('In News');

			         const { resources } = await container.items.query(querySpec3).fetchAll();
			         console.log(typeof(resources));                   
			         console.log(resources.length);                               
			         res.send(resources.slice(0,10));
				}catch(err){
					console.log('Error Message');
					console.log(err);
				}
		      })();
})



//const sslServer=https.createServer(options,app);
const port = 443;

https.createServer(options, app).listen(port, () => {
  console.log('Server listening on port ' + port);
});
