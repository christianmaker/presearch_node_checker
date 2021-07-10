require('dotenv').config();

const SSH = require('simple-ssh');
const serverList = require('./server.json');
const https = require('https');

function checkServer() {
let data='';
let restart = false;

https.get(process.env.PRESEARCH_API_HOST + process.env.PRESEARCH_API, (response) => {
	response.on('data', (chunk) => {
		data += chunk;
	});
	response.on('end', () => {
		let obj = JSON.parse(data);
		console.log(obj.nodes)
		for (let node in obj.nodes) {
			console.log(typeof obj.nodes[node].status.connected)
			if (!obj.nodes[node].status.connected) {
				restart = true;
			}
		}
if (restart) {
	console.log("In restart");
	for( let i = 0; i < serverList.server.length; i++) {
		let ssh = new SSH({
			host: serverList.server[i].ip,
			user: serverList.server[i].user,
			pass: serverList.server[i].pass
		});
		ssh
		.exec(process.env.FIRST_COMMAND)
		.exec(process.env.SECOND_COMMAND)
		.start();
	}
	restart = false;
}
});
});
}
setInterval(checkServer,1800000);
