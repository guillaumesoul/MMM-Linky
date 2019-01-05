var NodeHelper = require("node_helper");
const https = require('https');

const linky = require('@bokub/linky');

async function returnUser() {
	return new User('mickael');
}

class User {

	constructor(name) {
		this.name = name;
	}

	sayHi() {
		console.log(this.name);
	}

	test() {
		console.log('async');
	}

}


module.exports = NodeHelper.create({
	start: function() {
	},
	
	reload: function(refConfig) {

		let self = this;

		console.log('reload');
		// Log in
		const sessionPromised = linky.login('hoarau.soullard@gmail.com', 'To@Mo@23E');
		sessionPromised.then(function(session) {
			let dataPromised = session.getDailyData(session, {});
			dataPromised.then(function(data) {
				console.log(data);
				//var JSONParsed = JSON.parse(self.httpsRequestData);
				self.sendSocketNotification("RELOAD_DONE",data);
			});
		});






// Retrieve your power consumption
		/*let data = session.getDailyData();
		console.log(data);*/

		/*var self=this;
		self.httpsRequestData = '';

		var options = {
		  hostname: refConfig.dataGrandLyonURL,
		  port: refConfig.dataGrandLyonPORT,
		  path: refConfig.dataGrandLyonAPIPath,
		  method: 'GET',
		  headers: {
		    'Content-Type': 'application/json',
		 }
		};

		var req = https.request(options, (res) => {
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
					self.httpsRequestData += chunk;
					try{
						var JSONParsed = JSON.parse(self.httpsRequestData);
						self.sendSocketNotification("RELOAD_DONE",JSONParsed);

					}catch(error) {
					}
			});

			res.on('end', () => {
			});

			req.on('error', (e) => {
				console.log(`problem with request: ${e.message}`);
			});

		});

		req.end();*/
		
	},

	socketNotificationReceived: function(notification, payload) {
		console.log('socketNotificationReceived');
		if (notification === 'RELOAD') {
	      this.reload(payload);
	    }
	}
});


