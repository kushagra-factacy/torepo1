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



app.get( '/industrial_portfolio', (req, res) => {

	   console.log(req.query);
	   
	   const p = req.query.input;

	   console.log(p);
	   
	   
	   (async(sterm) => {

		   	 try{
				    
				    const key = process.env.COSMOS_KEY;
				    const endpoint = process.env.COSMOS_ENDPOINT;
				    
				    var x = { endpoint, key };
				    
				    const cosmosClient = new CosmosClient( x );
				    
				    const databaseName = 'cdb-L1'
				    
				    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
				    console.log(`${database.id} database ready`);
				    
				    const containerName = 'AICITE-IC';
				    
				    const { container } = await database.containers.createIfNotExists({
					    	   id: containerName
					       });
				    
				    console.log(`${container.id} container ready`);

				    console.log(sterm);
				    console.log(typeof(sterm));

				    const querySpec3 = {
				            
				                query: "SELECT TOP 200 * FROM c WHERE c.summary_IC = @keyword order by c.Unique_date_time desc",
				      		parameters : [
							{
								name : '@keyword',
								value : sterm
							}
						]
				            }
				 
			         const { resources } = await container.items.query(querySpec3).fetchAll();
			         console.log(typeof(resources));                   
			         console.log(resources.length);                               
			         //res.send(resources.slice(0,10));
			         //const data = resources.slice(0,10);
				 const uniq = [...new Array(resources)];
				 //console.log(uniq);
			         //const uniq = [...new Set(resources)];

				 uniq_new = uniq[0];
				 res.send(uniq_new);
				
			 }
		   catch(err){
				 console.log('Error');
			}

	   }
)(p);
}
);


app.get( '/search', (req, res) => {

           console.log(req.query);

           const p = req.query.input;

           console.log(p);

           (async(sterm) => {

                         try{

                                    const key = process.env.COSMOS_KEY;
                                    const endpoint = process.env.COSMOS_ENDPOINT;

                                    var x = { endpoint, key }

                                    const cosmosClient = new CosmosClient( x );

                                    const databaseName = 'cdb-L1'

                                    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                    console.log(`${database.id} database ready`);

                                    const containerName = 'AKA_Search'

                                    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                               });

                                    console.log(`${container.id} container ready`);
				  
				    nterm = sterm + '%';

				    console.log(sterm);
				    console.log(typeof(sterm));

                                    const querySpec3 = {

                                                query: "SELECT * FROM c where c.MCA_COMPANY_NAME LIKE @keyword OR c.MCA_CIN LIKE @keyword OR c.AKA_Brand_Name LIKE @keyword OR c.FACTACY_INDUSTRIAL_CLASSIFICATION LIKE @keyword", 
				
					    	parameters : [
							{
								name : '@keyword',
								value : sterm
							}
						]
                                            }


                                 const { resources } = await container.items.query(querySpec3).fetchAll();
                                 console.log(typeof(resources));
                                 console.log(resources.length);
                                 //res.send(resources.slice(0,10));
                                 const data = resources.slice(0,10);
                                 const uniq = [...new Set(data)];
                                 res.send(uniq);

                         }
                   catch(err){
                                 console.log('Error');
                         }


           }
)(p);
}
);


app.get( '/comp', (req, res) => {

           console.log(req.query);

           const p = req.query.input;

           console.log(p);

           (async(sterm) => {

                         try{

                                    const key = process.env.COSMOS_KEY;
                                    const endpoint = process.env.COSMOS_ENDPOINT;

                                    var x = { endpoint, key }

                                    const cosmosClient = new CosmosClient( x );

                                    const databaseName = 'heimdall-db'

                                    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                    console.log(`${database.id} database ready`);

                                    const containerName = 'Aicite-User';

                                    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                               });

                                    console.log(`${container.id} container ready`);

                                    const querySpec3 = {

                                                query: "SELECT * FROM c where c.Email_Id = @keyword",

                                                parameters : [
                                                        {
                                                                name : '@keyword',
                                                                value : sterm
                                                        }
                                                ]
                                            }


                                 const { resources } = await container.items.query(querySpec3).fetchAll();
                                 console.log(typeof(resources));
                                 console.log(resources.length);
                                 //res.send(resources.slice(0,10));
                                 //const data = resources.slice(0,10);
                                 //const uniq = [...new Set(data)];
                                 res.send(resources);
                         }
                   catch(err){
                                 console.log('Error');
                         }

	}
)(p);
}
);


app.get( '/comp_add', (req, res) => {

           console.log(req.query);

           const mca_cin = req.query.mca_cin;
	   const mca_company_name =  req.query.mca_company_name;
	   const factacy_industrial_classification = req.query.factacy_industrial_classification;
           const aka_brand_name = req.query.aka_brand_name;
	   const first_name = req.query.first_name;
	   const last_name = req.query.last_name;
	   const company_name = req.query.company_name;
	   const contact_number = req.query.contact_number;
	   const email_id = req.query.email_id;
	   const id = req.query.id

           //console.log(p); 
		

	  const documentdef = {

                                         'MCA_CIN' : mca_cin,
                                         'MCA_COMPANY_NAME' : mca_company_name,
                                         'FACTACY_INDUSTRIAL_CLASSIFICATION' : factacy_industrial_classification,
                                         'AKA_Brand_Name' : aka_brand_name,
		  			 'First_Name' : first_name,
                                         'Last_Name' : last_name,
                                         'Company_Name' : company_name,
                                         'Contact_Number' : contact_number,
                                         'Email_Id'  : email_id,
		  			  'id' : id

                                 };


           (async(sterm, dd) => {

                         try{

                                    const key = process.env.COSMOS_KEY;
                                    const endpoint = process.env.COSMOS_ENDPOINT;

                                    var x = { endpoint, key }

                                    const cosmosClient = new CosmosClient( x );

                                    const databaseName = 'heimdall-db'

                                    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                    console.log(`${database.id} database ready`);

                                    const containerName = 'Aicite-User';

                                    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                               });

                                    console.log(`${container.id} container ready`);

                                    const querySpec3 = {

                                                query: "SELECT * FROM c where c.Company_Name LIKE @keyword",

                                                parameters : [
                                                        {
                                                                name : '@keyword',
                                                                value : sterm
                                                        }
                                                ]
                    
				    }

				 const documentdef = {
					 
					 'MCA_CIN' : mca_cin,	
					 'MCA_COMPANY_NAME' : mca_company_name,	
					 'FACTACY_INDUSTRIAL_CLASSIFICATION' : factacy_industrial_classification,	
					 'AKA_Brand_Name' : aka_brand_name,	
					 'First_Name' :	first_name,	
					 'Company_Name' : company_name,
					 'Contact_Number' : contact_number,	
					 'Email_Id'  : email_id

				 };



                                 const createRes = await container.items.create(dd);
                                 console.log(typeof(resources));
                                 console.log(resources.length);
                                 //res.send(resources.slice(0,10));
                                 //const data = resources.slice(0,10);
                                 //const uniq = [...new Set(data)];
                                 res.send(createRes);
                         }
                   catch(err){
                                 console.log(err);
                         }
        }
)( documentdef);
}
);



app.get( '/cnews', (req, res) => {
	


	console.log(req.query);

	const p = req.query.input;

	console.log(p);

	const q = req.query.input2;



	(async(sterm, sterm2) => {
	  try{

	const key = process.env.COSMOS_KEY;
	const endpoint = process.env.COSMOS_ENDPOINT;

	var x = { endpoint, key }

	const cosmosClient = new CosmosClient( x );

	const databaseName = 'cdb-L1'

	const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
	console.log(`${database.id} database ready`);

	const containerName = 'Business-News'

	const { container } = await database.containers.createIfNotExists({
		id: containerName
	});

	console.log(`${container.id} container ready`);

	const querySpec2 = {

		query: "SELECT * FROM c WHERE  STARTSWITH(c.Brand_Name, @keyword)",
		parameters: [
			{
				name: '@keyword',
				value: sterm
			}
		]

	};


	const databaseName2 = 'cdb-L1'

	const { database2 } = await cosmosClient.databases.createIfNotExists({ id: databaseName2 });
	console.log(`${database2.id} database ready`);

	const containerName2 = 'art-id'

	const { container2 } = await database.containers.createIfNotExists({
		id: containerName2
	});

	console.log(`${container2.id} container ready`);

	const querySpec3 = {

		query: "SELECT * FROM c WHERE  STARTSWITH(c.id, @keyword)",
		parameters: [
			{
				name: '@keyword',
				value: sterm2
			}
		]

	};


	const { resources3 } = await container.items.query(querySpec3).fetchAll();

	console.log(typeof(resources3));

	console.log(resources3.length);

	if(resources3.length > 15){
		res.send(resources3.slice(0,5));
	}else{
		res.send(resources3);
	}


	}catch(err){
		console.log(err);
	}
	})(p,q);

	});


const jsonwebtoken = require("jsonwebtoken");


const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

//const app = express();
app.use(express.json());


const udb = {
	admin : 'admin'
}

app.post('/tregister', (req, res) => {
	
	
	(async() => {
		


	try{
		
	const { email, password, id } = req.query;

	udb[email] = password;
	console.log(udb);
	const key = process.env.COSMOS_KEY;
                                    const endpoint = process.env.COSMOS_ENDPOINT;

                                    var x = { endpoint, key }

                                    const cosmosClient = new CosmosClient( x );

                                    const databaseName = 'heimdall-db'

                                    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                    console.log(`${database.id} database ready`);

                                    const containerName = 'Aicite-User';

                  		    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                               });

	
	const { statusCode, item, resource, activityId, etag} = await container.items.create({ 
        id: id, 
        email : email,
	password : password
    });

	console.log(statusCode);
	res.status(200).send('Registration successfull');
	}catch(err){
		res.send('bad request');
		console.log(err);
	}
	})();
	
});

app.post("/tlogin", (req, res) =>{	


	(async()=>{


	try{

          const { username, password } = req.query;
	  console.log( req.body.username);

  	  console.log(req.body);
 	  console.log(udb.string);
 	  console.log(typeof(udb.string));

	  console.log(`${username} is trying to login ..`);

          const key = process.env.COSMOS_KEY;
                                   const endpoint = process.env.COSMOS_ENDPOINT;

                                   var x = { endpoint, key }

                                   const cosmosClient = new CosmosClient( x );

                                   const databaseName = 'heimdall-db'

                                   const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                   console.log(`${database.id} database ready`);

                                   const containerName = 'Aicite-User';

                                   const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                               });

				   const querySpec3 = {

                                                query: "SELECT TOP 1 * FROM c WHERE c.Email_Id = @keyword",
                                                parameters : [
                                                      {
                                                              name : '@keyword',
                                                              value : username
                                                      }

                                                ]
                                             };

                                 console.log('In News');

                                 const { resources } = await container.items.query(querySpec3).fetchAll();
		console.log('log resources');		
		console.log(resources.length);
  				 

  if (udb[username] !== undefined) {
    return res.json({
      token: jsonwebtoken.sign({ user: "admin" }, JWT_SECRET),
    });
  }else{
	  res.status(401).send('Unauthorized');
  }

	}catch(err){


  return res
    .status(401)
    .json({ message: "The username and password your provided are invalid" });
}

})();

});


app.get( '/', (req, res) => {

 //console.log(req.params);
 //console.log(req.body);
 //console.log(req.body);
 //console.log(req.query);

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

//const {resources2 } = await container.items.query(querySpec).fetchAll();

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
				
						
				
			     //today = today + 'T' + li_str + '%';
			     	
			     // SELECT TOP 10 * FROM c order by c._ts descconsole.log(today);

			      const key = process.env.COSMOS_KEY;
			      const endpoint = process.env.COSMOS_ENDPOINT;

			      var x = { endpoint, key }
			      
			      const cosmosClient = new CosmosClient( x );
			      
			      const databaseName = 'cdb-L1'

			      const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
			      console.log(`${database.id} database ready`);
			      
			      const containerName = 'AICITE-IC'
			      
			      const { container } = await database.containers.createIfNotExists({
				                id: containerName
			      });

			      console.log(`${container.id} container ready`);
			 
			      console.log('Ready');
			       
			      const querySpec3 = {
				            
				                query: "SELECT TOP 250 * FROM c order by c.Unique_date_time desc"
				      		//parameters : [
						//	{
						//		name : '@keyword',
						//		value : today
						//	}

						//]
				             };
			
			     	 console.log('In News');

			         const { resources } = await container.items.query(querySpec3).fetchAll();
			         console.log(typeof(resources));                   
			         console.log(resources.length);                               
			         //res.send(resources.slice(0,10));
			         //const data = resources.slice(0,10);
			         const uniq = [...new Array(resources)];
				 console.log(resources);
				 ///console.log(uniq).slice(0,2);
				 
				 //const res_Arr = new Array();
				 
				// const res = new Array();
				// for (i in range(0:)):
				//	res.append(uniq[i]);
				
			 	 res.send(uniq);
				}
		    catch(err){
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
				    
				    const databaseName = 'financials-db';

				    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
				    console.log(`${database.id} database ready`);
				       
				    const containerName = 'cap-tables';


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


app.get( '/getids', (req, res) => {


           console.log(req.query);

           const p = req.query.input;

            console.log(typeof(p));


           (async(sterm) => {
                         try{

                                    const key = process.env.COSMOS_KEY;
                                    const endpoint = process.env.COSMOS_ENDPOINT;

                                    var x = { endpoint, key };

                                    const cosmosClient = new CosmosClient( x );

                                    const databaseName = 'cdb-L1';

                                    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                    console.log(`${database.id} database ready`);

                                    const containerName = 'Business-News';


                                    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                            });

                                    console.log(`${container.id} container ready`);
					
				    console.log(sterm);
                                    const querySpec2 = {

                                                  query: "SELECT * FROM c where c.ORG LIKE @keyword",
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

                                    res.send(resources);

				    }catch(err){
                                                   console.log(err);
                                               }
                      })(p);

           });



app.get( '/getarts', (req, res) => {


           console.log(req.query);

           const p = req.query.input;

            console.log(typeof(p));


           (async(sterm) => {
                         try{

                                    const key = process.env.COSMOS_KEY;
                                    const endpoint = process.env.COSMOS_ENDPOINT;

                                    var x = { endpoint, key }

                                    const cosmosClient = new CosmosClient( x );

                                    const databaseName = 'cdb-L1'

                                    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                    console.log(`${database.id} database ready`);

                                    const containerName = 'art-id'


                                    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                            });

                                    console.log(`${container.id} container ready`);

                                    const querySpec2 = {

                                                   query: "SELECT * FROM c where c.id = @keyword",
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

                                    res.send(resources);

                                    }catch(err){
                                                   console.log(err);
                                               }
                      })(p);

           });



app.get( '/funding', (req, res) => {


           console.log(req.query);

           const p = req.query.input;

            console.log(typeof(p));


           (async(sterm) => {
		   try{

                                    const key = process.env.COSMOS_KEY;
                                    const endpoint = process.env.COSMOS_ENDPOINT;

                                    var x = { endpoint, key }

                                    const cosmosClient = new CosmosClient( x );

                                    const databaseName = 'cdb-L1';

                                    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                    console.log(`${database.id} database ready`);

                                    const containerName = 'Aicite-Ic';


                                    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                            });

                                    console.log(`${container.id} container ready`);

                                    const querySpec2 = {

                                                   query: "SELECT * FROM c where c.Funding_Alert ='Funding' ORDER BY c.Unique_date_time desc",
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

				  //const out = new Array(resources);

			   	 const uniq = [...new Array(resources)];
                                 //console.log(uniq);
                                 //const uniq = [...new Set(resources)];
                                 //uniq_new = uniq[0];
				//uniq_new.reverse();

                                    res.send(uniq);

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
