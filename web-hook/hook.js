
const express = require('express');
const app = express();
 const CosmosClient = require("@azure/cosmos").CosmosClient;
// const cors = require('cors');
// const https=require('https')
// const fs=require('fs')
// const path=require('path')


const TelegramBot = require('node-telegram-bot-api');

const token = '5896779019:AAG9fGeDTxPreDR3tmvVQChh-m3FY_mXFeg';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(msg.chat.id, 'Hi There, I am your Smart Factacy Telegram Bot');

  bot.sendMessage(msg.chat.id, 'Welcome To Factacy Aicite News Feed!!');
});


// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(msg.chat.id, 'Hi There, I am your Smart Factacy Telegram Bot');

  bot.sendMessage(msg.chat.id, 'Welcome To Factacy Aicite News Feed!!');

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
				            
				                query: "SELECT TOP 5 * FROM c order by c.Unique_date_time desc"
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
			          

			         res = '';
				 let count = 1;
			         for( const x of uniq ){
					 for ( const y of x ) {
					 console.log(typeof(y));
					 const z = y.title;
					 res = res + String(count) + '. ' +  String(z);
			    		 res = res + '\n\n';

				         const con = y.summary_of_article;
				         res = res + con + '\n\n';
			                 count = count + 1;
						 if(count == 6){
							 break;
						 }
					 }
				 }

				 recnull = uniq[0][0];

				p = (recnull.title);

				 //console.log(resources);
				 ///console.log(uniq).slice(0,2);
				 
				 //const res_Arr = new Array();
				 
				// const res = new Array();
				// for (i in range(0:)):
				//	res.append(uniq[i]);
				
			 	 //res.send(uniq);
			//
			 	 //console.log(res);
			         bot.sendMessage(chatId,res);
				}
		    catch(err){
					console.log('Error Message');
					console.log(err);
				}
		      })();
  
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

app.listen('2222', ()=>{
    console.log('Express Listening');
})
