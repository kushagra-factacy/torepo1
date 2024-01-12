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



const querySpec = {
 
    query: "SELECT * FROM heimdall-v2 c WHERE  STARTSWITH(c.AKA_Brand_Name, 'TAGZ FOODS')",
    parameters: [
		  {
//			name: '@keyword',
//			value: sterm
	  	  }
		]

};

// // Get items 
const { resources } = await container.items.query(querySpec2).fetchAll();

//const {resources2 } = await container.items.query(querySpec).fetchAll();

console.log(typeof(resources));

console.log(resources.length);

//console.log(typeof(resources2));

//console.log(resources2);

//console.log(resources2.length);

//const comb_names = resources2.concat(resources);

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
});


app.get( '/bname', (req, res) => {

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
   
	   query: "SELECT * FROM heimdall c WHERE  STARTSWITH(c.AKA_Brand_Name, @keyword)",
	   parameters: [
		   {
			   name: '@keyword',
			   value: sterm
		   }
	   ]
   
   };
   
   
   
   const querySpec = {
	
	   query: "SELECT * FROM heimdall-v2 c WHERE  STARTSWITH(c.AKA_Brand_Name, 'TAGZ FOODS')",
	   parameters: [
			 {
   //			name: '@keyword',
   //			value: sterm
			   }
		   ]
   
   };
   
   // // Get items 
   const { resources } = await container.items.query(querySpec2).fetchAll();
   
   //const {resources2 } = await container.items.query(querySpec).fetchAll();
   
   console.log(typeof(resources));
   
   console.log(resources.length);
   
   //console.log(typeof(resources2));
   
   //console.log(resources2);
   
   //console.log(resources2.length);
   
   //const comb_names = resources2.concat(resources);
   
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
   });
   


app.get('/news' , (req,res) => {

	(async() => {

		try{

			      let today = new Date().toISOString().slice(0, 10);
			      //today = today + '%';
			      //console.log(today);

			      let date = new Date().toISOString() ;
			      console.log(date);
			      let last = date.slice(11,13);

			      let li  = Number(last);
			      li = li-1;

			  
			      
			      li_str = li.toString();

			      if (Number(li_str) < 10){
				      li_str = '0' + li_str;
			      };

			      console.log(last);
			      console.log(li);
			      console.log(li_str);

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
				            
				                query: "SELECT * FROM c where STARTSWITH(c.COMPANY_NAME, @keyword)",
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
			         //res.send(resources.slice(0,10));
			         const data = resources.slice(0,10);
			         const uniq = [...new Set(data)];
				 res.send(uniq);
				}catch(err){
					console.log('Error Message');
					console.log(err);
				}
		      })();
});


app.get( '/financials', (req, res) => {


	   console.log(req.query);
	   
	   const p = req.query.input;
	   
	    console.log(typeof(p));


	   (async(sterm) => {
		   	 try{
				    
				    const key = process.env.COSMOS_KEY;
				    const endpoint = process.env.COSMOS_ENDPOINT;
				    
				    var x = { endpoint, key }
				    
				    const cosmosClient = new CosmosClient( x );
				    
				    const databaseName = 'financials-db'

				    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
				    console.log(`${database.id} database ready`);
				       
				    const containerName = 'cap-tables'


				    const { container } = await database.containers.createIfNotExists({
					 	   id: containerName
					    });
				    
				    console.log(`${container.id} container ready`);
				       
				    const querySpec2 = {
					       
					    	   query: "SELECT * FROM c where STARTSWITH(c.COMPANY_NAME, @keyword)",
					    	   parameters: [
							   		   {
										   			   name: '@keyword',
										   			   value: sterm
										   		   }
							   	   ]
					       
					       };
				 const { resources } = await container.items.query(querySpec2).fetchAll();
				    
				    console.log(typeof(resources));
				    
				    console.log(resources.length);
				    
				    if(resources.length > 15){
					    	   res.send(resources.slice(0,5));
					       }else{
						       	   res.send(resources);
						          }
				    
				    
				    }catch(err){
					    	   console.log(err);
					       }
		      })(p);

	   });



app.get( '/patents', (req, res) => {


	           console.log(req.query);

	           const p = req.query.input;

	            console.log(typeof(p));


	           (async(sterm) => {
			                            try{

							                                        const key = process.env.COSMOS_KEY;
							                                        const endpoint = process.env.COSMOS_ENDPOINT;

							                                        var x = { endpoint, key }

							                                        const cosmosClient = new CosmosClient( x );

							                                        const databaseName = 'heimdall-db'

							                                        const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
							                                        console.log(`${database.id} database ready`);

												const containerName = 'patent'
																							

							                                        const { container } = await database.containers.createIfNotExists({
													                                                   id: containerName
													                                            });

							                                        console.log(`${container.id} container ready`);

							                                        const querySpec2 = {

													                                                   query: "SELECT * FROM c where STARTSWITH(c.MCA_COMPANY_NAME, @keyword)",
													                                                   parameters: [
																				                                                                              {
																														                                                                                                                 name: '@keyword',
																														                                                                                                                 value: sterm
																														                                                                                                         }
																				                                                                      ]

													                                               };
							                                     const { resources } = await container.items.query(querySpec2).fetchAll();


							                                        console.log(typeof(resources));

							                                        console.log(resources.length);

							                                        if(resources.length > 15){
													res.send(resources.slice(0,5));
												}else{
																			                                                                  res.send(resources);
																			                                                                 }


							                                        }catch(err){
													                                                   console.log(err);
													                                               }
			                         })(p);

	           });


//const sslServer=https.createServer(options,app);
const port = 443;


https.createServer(options, app).listen(port, () => {
  console.log('Server listening on port ' + port);
});
