const express = require('express');
const app = express();
const CosmosClient = require("@azure/cosmos").CosmosClient;
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path =require('path');
const axios = require('axios');

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
				    
				    sterm = sterm.replaceAll('"','');
				    
				    console.log('Final');
				    console.log(sterm);
				    
				    let p = ' \'Others\' , \'Transportation and Logistics Tech\' '
				    
				    console.log(p);
				    
				    let s = `SELECT TOP 500 * FROM c WHERE c.summary_IC IN ( ${sterm} ) order by c.Unique_date_time desc`
			     	    
				    
				    const querySpec3 = {
				            
				                query: s,
				      		parameters : [
				    			{
				    				name : '@keyword',
				    				value : sterm
				    			}
				 		]
				            }
				 
			         const { resources } = await container.items.query(querySpec3).fetchAll();
			         console.log(typeof(resources));      
				 console.log(resources);
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

				    console.log(nterm);
				    console.log(typeof(nterm));

                                    const querySpec3 = {
					
                                                query: "SELECT * FROM c where c.MCA_COMPANY_NAME LIKE @keyword OR c.MCA_CIN LIKE @keyword OR c.AKA_Brand_Name LIKE @keyword OR c.FACTACY_INDUSTRIAL_CLASSIFICATION LIKE @keyword", 
				
					    	parameters : [
							{
								name : '@keyword',
								value : nterm
							}
						]
                                            };

				 const cmp = sterm + '*';
				 const mcn = sterm + '*';


     				 axios.get(`http://74.249.50.68:8983/solr/ncore/select?q=MCA_COMPANY_NAME:${cmp}%20ORM%20MCA_CIN:${mcn}`).then((response) => {
    let d = response.data;
    d = d['response'];
    d = d['docs'];
    res.send(d);
    
}).catch((error) => console.log(error));


                                 //const { resources } = await container.items.query(querySpec3).fetchAll();
                                 //console.log(typeof(resources));
                                 //console.log(resources.length);
                                 //res.send(resources.slice(0,10));
                                 //const data = resources.slice(0,10);
                                 const uniq = [...new Set(data)];
                                 res.send(uniq);

                         }
                   catch(err){
                                 console.log('Error');
			   	console.log(err);
                         }


           }
)(p);
}
);

app.get('ncore/search', (req, res) => {

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

                                    console.log(nterm);
                                    console.log(typeof(nterm));
					
                                    const querySpec3 = {
					
                                                query: "SELECT * FROM c where c.MCA_COMPANY_NAME LIKE @keyword OR c.MCA_CIN LIKE @keyword OR c.AKA_Brand_Name LIKE @keyword OR c.FACTACY_INDUSTRIAL_CLASSIFICATION LIKE @keyword",
					
                                                parameters : [
                                                        {
                                                                name : '@keyword',
                                                                value : nterm
                                                        }
                                                ]
                                            };
					
                                 const cmp = sterm + '*';
                                 const mcn = sterm + '*';
 						
				 axios.get(`http://74.249.50.68:8983/solr/ncore/select?q=MCA_COMPANY_NAME:${cmp}%20OR%20MCA_CIN:${mcn}`).then((response) => {
    let d = response.data;
    d = d['response'];
    d = d['docs'];
    res.send(d);

}).catch((error) => console.log(error));


                                 //const { resources } = await container.items.query(querySpec3).fetchAll();
                                 //console.log(typeof(resources));
                                 //console.log(resources.length);
                                 //res.send(resources.slice(0,10));
                                 //const data = resources.slice(0,10);
                                 const uniq = [...new Set(data)];
                                 res.send(uniq);

                         }
                   catch(err){
                                 console.log('Error');
                                console.log(err);
                         }


           }
)(p);
}
);




app.get( '/solrcore2', (req, res) => {

           console.log(req.query);

           const p = req.query.field;
	   const q = req.query.val;

           console.log(p);

           (async(sterm, sterm2) => {

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

                                    console.log(nterm);
                                    console.log(typeof(nterm));


                                 const cmp = sterm;
                                 let mcn = sterm2;

				 console.log(mcn);
				 
				 mcn = mcn.replaceAll(' ','%20');

				 console.log(mcn);


                                 axios.get(`http://74.249.50.68:8983/solr/core2/select?q=headline:${mcn}%20OR%20summary_of_article:${mcn}`).then((response) => {
    				 let d = response.data;
    				 d = d['response'];
    				 d = d['docs'];
    				 res.send(d);

}).catch((error) => console.log(error));


                                 //const { resources } = await container.items.query(querySpec3).fetchAll();
                                 //console.log(typeof(resources));
                                 //console.log(resources.length);
                                 //res.send(resources.slice(0,10));
                                 //const data = resources.slice(0,10);
                                 //const uniq = [...new Set(d)];
                                 //res.send(uniq);

                         }
                   catch(err){
                                 console.log('Error');
                                console.log(err);
                         }


           
}
)(p,q);
}
);

app.get( '/solrcore2/lax', (req, res) => {

           console.log(req.query);

           const p = req.query.field;
           const q = req.query.val;

           console.log(p);

           (async(sterm, sterm2) => {

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

                                    console.log(nterm);
                                    console.log(typeof(nterm));


                                 const cmp = sterm;
                                 let mcn = sterm2;

                                 console.log(mcn);

                                 mcn = mcn.replaceAll(' ','+');

                                 console.log(mcn);


                                 axios.get(`http://74.249.50.68:8983/solr/core2/select?q=headline:${mcn}%20OR%20summary_of_article:${mcn}`).then((response) => {
                                 let d = response.data;
                                 d = d['response'];
                                 d = d['docs'];
                                 res.send(d);

}).catch((error) => console.log(error));


                                 //const { resources } = await container.items.query(querySpec3).fetchAll();
                                 //console.log(typeof(resources));
                                 //console.log(resources.length);
                                 //res.send(resources.slice(0,10));
                                 //const data = resources.slice(0,10);
                                 //const uniq = [...new Set(d)];
                                 //res.send(uniq);

                         }
                   catch(err){
                                 console.log('Error');
                                console.log(err);
                         }



}
)(p,q);
}
);




app.get( '/comp', (req, res) => {

           console.log(req.query);

           const p = req.query.email;

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

                                    const containerName = 'User-Data';

                                    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                               });

                                    console.log(`${container.id} container ready`);

                                    const querySpec3 = {

                                                query: "SELECT * FROM c where c.Email_Id = @keyword ORDER BY c._ts DESC",

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
				 
				 if(resources.length == 0 ){
				 	 res.status(400).send('Non Existent User');
				 }
				 console.log(resources[0]);

				 const rl = resources[0];
                                 //res.send(resources.slice(0,10));
                                 //const data = resources.slice(0,10);
                                 //const uniq = [...new Set(data)];
                                 res.send(rl);
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
	   //const rid = req.query.rid

           //console.log(p); 
		

	  //const documentdef = {

            //                             'MCA_CIN' : mca_cin,
              //                           'MCA_COMPANY_NAME' : mca_company_name,
                //                         'FACTACY_INDUSTRIAL_CLASSIFICATION' : factacy_industrial_classification,
                  //                       'AKA_Brand_Name' : aka_brand_name,
		  //			 'First_Name' : first_name,
                    //                     'Last_Name' : last_name,
                      //                   'Company_Name' : company_name,
                        //                 'Contact_Number' : contact_number,
                          //               'Email_Id'  : email_id,
		  	//		  'id' : id
//
  //                               };


           (async(sterm) => {

                         try{
				    
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
                                         // 'id' : id

                                 };

                                    const key = process.env.COSMOS_KEY;
                                    const endpoint = process.env.COSMOS_ENDPOINT;

                                    var x = { endpoint, key }

                                    const cosmosClient = new CosmosClient( x );

                                    const databaseName = 'heimdall-db'

                                    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
                                    console.log(`${database.id} database ready`);

                                    const containerName = 'User-Data';

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

				 //const documentdef = {
				//	 
				//	 'MCA_CIN' : mca_cin,	
				//	 'MCA_COMPANY_NAME' : mca_company_name,	
				//	 'FACTACY_INDUSTRIAL_CLASSIFICATION' : factacy_industrial_classification,	
				//	 'AKA_Brand_Name' : aka_brand_name,	
				//	 'First_Name' :	first_name,	
				//	 'Company_Name' : company_name,
				//	 'Contact_Number' : contact_number,	
				//	 'Email_Id'  : email_id
				//
				//				 };



                                 const createRes = await container.items.create(documentdef);
                                 //console.log(typeof(resources));
                                 //console.log(resources.length);
                                 //res.send(resources.slice(0,10));
                                 //const data = resources.slice(0,10);
                                 //const uniq = [...new Set(data)];
                                 res.send('Added successfully');
                         }
                   catch(err){
                                 console.log(err);
                         }
        }
)();
}
);


app.get( '/allinone', (req, res) => {
	  
	  // console.log(req.params);
	  // console.log(req.body);
	  //	 console.log(req.body);
	  // console.log(req.query);
	  //
	  //res.send('Okay');

	  const p = req.query.input1;
	  const q = req.query.input2;

	  //const p = 'NIKON';
	  console.log(p);
	  console.log(q);

	  (async(sterm1, sterm2) => {
	  	try{

	  const key = process.env.COSMOS_KEY;
	  const endpoint = process.env.COSMOS_ENDPOINT;

	  console.log(sterm1);
	  console.log(sterm2);

	  var x = { endpoint, key }

	  const cosmosClient = new CosmosClient( x );

	  const databaseName = sterm1;

	  // Create database if it doesn't exist
	  const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
	  console.log(`${database.id} database ready`);

	  const containerName = sterm2;

	  const { container } = await database.containers.createIfNotExists({
		  id: containerName
	  });

	  console.log(`${container.id} container ready`);

	  const qSp2 = {

		  query: "SELECT * FROM c WHERE c.published_date <= GetCurrentDateTime() order by c.published_date desc"
		  //parameters: [
	          //		  {
		  //		  name: '@keyword',
		 //		  value: sterm2
		  //	  }
		 // ]

	  };



	  // // Get items
	  const { resources } = await container.items.query(qSp2).fetchAll();
  	  
	  //const {resources2 } = await container.items.query(querySpec).fetchAll();
	  
	  console.log(typeof(resources));
    	  
	  console.log(resources);
 	  
	  resources.sort( function(a,b) {
		  var d1 = a['published_date'];
		  var d2 = b['published_date'];
	
		  console.log(typeof(d1));
	 	  console.log(typeof(d2));

		  let part1 = d1.split('-');
		  let part2 = d2.split('-');

		  fd1 = new Date(part1[0], part1[1], part1[2]);
		  fd2 = new Date(part2[0], part2[1], part2[2]);

		  let flag = 0;

		  if(fd1 > fd2){
			  flag = -1
		  }else{
			  flag = 1
		  }

		  return flag;
	  });


	  //console.log(typeof(resources2));

	  //console.log(resources2);

	  //console.log(resources2.length);

	  //const comb_names = resources2.concat(resources);

	  //if(resources.length > 15){
	  //	  res.send(resources.slice(0,5));
	  //}else{
	  //	  res.send(resources);
	  //}


	  //for (const item of resources) {
		//  console.log(item);
	  //}

	  res.send(resources);

	  }catch(err){
		  console.log(err);
	  }
	  })(p,q)

		//res.send('Server Responding!')
	});


app.get( '/deal', (req, res) => {

          // console.log(req.params);
          // console.log(req.body);
          //     console.log(req.body);
          // console.log(req.query);
          //
          //res.send('Okay');

          const p = 'heimdall-db';
          const q =  'Investor-Id';

          //const p = 'NIKON';
          console.log(p);
          console.log(q);

          (async(sterm1, sterm2) => {
                try{

          const key = process.env.COSMOS_KEY;
          const endpoint = process.env.COSMOS_ENDPOINT;

          console.log(sterm1);
          console.log(sterm2);

          var x = { endpoint, key }

          const cosmosClient = new CosmosClient( x );

          const databaseName = sterm1;

          // Create database if it doesn't exist
          const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
          console.log(`${database.id} database ready`);

	   const containerName = sterm2;

          const { container } = await database.containers.createIfNotExists({
                  id: containerName
          });

          console.log(`${container.id} container ready`);

          const qSp2 = {

                  query: "SELECT * FROM c  order by c._ts desc"
                  //parameters: [
                  //              {
                  //              name: '@keyword',
                 //               value: sterm2
                  //      }
                 // ]

          };



          // // Get items
          const { resources } = await container.items.query(qSp2).fetchAll();

          //const {resources2 } = await container.items.query(querySpec).fetchAll();

          console.log(typeof(resources));

          console.log(resources);

          //resources.sort( function(a,b) {
           //       var d1 = a['published_date'];
           //       var d2 = b['published_date'];

            //      console.log(typeof(d1));
            //      console.log(typeof(d2));

           //       let part1 = d1.split('-');
           //       let part2 = d2.split('-');

           //       fd1 = new Date(part1[0], part1[1], part1[2]);
           //       fd2 = new Date(part2[0], part2[1], part2[2]);

           //       let flag = 0;
	   //               if(fd1 > fd2){
           //               flag = -1
           //       }else{
           //               flag = 1
           //       }

           //       return flag;
         // });


          //console.log(typeof(resources2));

          //console.log(resources2);

          //console.log(resources2.length);

          //const comb_names = resources2.concat(resources);

          //if(resources.length > 15){
          //      res.send(resources.slice(0,5));
          //}else{
          //      res.send(resources);
          //}


          //for (const item of resources) {
                //  console.log(item);
          //}

          res.send(resources);

          }catch(err){
                  console.log(err);
          }
          })(p,q)

                //res.send('Server Responding!')
        });







app.get( '/getone', (req, res) => {

          // console.log(req.params);
          // console.log(req.body);
          //     console.log(req.body);
          // console.log(req.query);
          //
          //res.send('Okay');

          const p = req.query.input1;
          const q = req.query.input2;
	  const r = req.query.input3;
	  const s = req.query.input4;

          //const p = 'NIKON';
          console.log(p);
          console.log(q);

          (async(sterm1, sterm2, sterm3, sterm4) => {
                try{

          const key = process.env.COSMOS_KEY;
          const endpoint = process.env.COSMOS_ENDPOINT;

          console.log(sterm1);
          console.log(sterm2);

          var x = { endpoint, key }

          const cosmosClient = new CosmosClient( x );

          const databaseName = sterm1;

          // Create database if it doesn't exist
          const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
          console.log(`${database.id} database ready`);

          const containerName = sterm2;

          const { container } = await database.containers.createIfNotExists({
                  id: containerName
          });

          console.log(`${container.id} container ready`);

	  const attr = sterm3;

	  const val = sterm4;

	  console.log(attr);
	

	  console.log(val);

          const qSp2 = {

                  query: `SELECT TOP 10 * FROM c WHERE c.${attr} = '${val}'`
                  //parameters: [
                  //              {
                  //              name: '@keyword',
                 //               value: sterm2
                  //      }
                 // ]

          };
	
	
	
          // // Get items
          const { resources } = await container.items.query(qSp2).fetchAll();
	
          //const {resources2 } = await container.items.query(querySpec).fetchAll();
	
          console.log(typeof(resources));
	
          console.log(resources);
	
          //console.log(typeof(resources2));
	
          //console.log(resources2);
	
          //console.log(resources2.length);
	
          //const comb_names = resources2.concat(resources);
	
          //if(resources.length > 15){
          //      res.send(resources.slice(0,5));
          //}else{
          //      res.send(resources);
          //}
	
	
          //for (const item of resources) {
                //  console.log(item);
          //}
	
          res.send(resources);
	
          }catch(err){
                  console.log(err);
          }
          })(p,q,r,s)
	
                //res.send('Server Responding!')
        });
	
	
	
	
	
	
	
	
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
		
	const { email, password, id, factacy_token } = req.query;

	//factacy_token = 'portronics';


	//res.status(401).send('You are Not Authorized To access this resource');
	
	if(factacy_token != 'EA-BOON-1213'){

		res.status(401).send('You are Not Authorized To access this resource');
		return ;
	}
		

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

                                                query: "SELECT TOP 1 * FROM c WHERE c.email = @keyword",
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
				console.log(resources);
				
				console.log(resources.length);
		 		const res0 = resources[0];
				console.log(res0);
				const dbpass = res0.password;

				console.log(password);
				console.log(dbpass);
		                if(dbpass == password){
					console.log('is equal');
				}else{
					console.log('not equal');
				}
				
	if(dbpass == password) {
    	return res.json({
      token: jsonwebtoken.sign({ user: username }, JWT_SECRET),
    });
  }else{
	  res.status(401).send('The username and password you provided are invalid');
  }
	}catch(err){
  return res
    .status(404)
    .json({ message: "Bad Request" });
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


	  //sterm = sterm + '*';

const querySpec2 = {

    query: "SELECT TOP 10 * FROM c WHERE STARTSWITH ( c.MCA_COMPANY_NAME , @keyword)",
    parameters: [
        {
            name: '@keyword',
            value: sterm
        }
    ]

};



//const querySpec = {
 
//    query: "SELECT * FROM heimdall-v2 c WHERE  STARTSWITH(c.AKA_Brand_Name, 'TAGZ FOODS')"
//    parameters: [
		  //{
//			name: '@keyword',
//			value: sterm
	  	  //}
		//]

//};

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

                                    const containerName = 'AICITE-IC'


                                    const { container } = await database.containers.createIfNotExists({
                                                   id: containerName
                                            });

                                    console.log(`${container.id} container ready`);

                                    const querySpec2 = {

                                                   query: "SELECT * FROM c where c.Art_Id=@keyword",
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

                                    const containerName = 'AICITE-IC';


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

			   	 //nst uniq = [...new Array(resources)];
                                 //console.log(uniq);
                                 //const uniq = [...new Set(resources)];
                                 //uniq_new = uniq[0];
				//uniq_new.reverse();

                                    res.send(resources);

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
const port = 5000;


https.createServer(options, app).listen(port, () => {
  console.log('Server listening on port ' + port);
});
