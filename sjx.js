const axios = require('axios');

const cmp = 'FAC' + '*';

const mcn = '*';

axios.get(`http://74.249.50.68:8983/solr/ncore/select?q=MCA_COMPANY_NAME:${cmp}*&MCA_CIN:${mcn}`)
.then((response) => { 
	let d  = response.data;
	d = d['response'];
	console.log(d['docs']);
})
.catch((error) => console.log(error));
