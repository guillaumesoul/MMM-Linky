var NodeHelper = require("node_helper");
const https = require('https');

const linky = require('@bokub/linky');

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
		
	},

	socketNotificationReceived: function(notification, payload) {
		console.log('socketNotificationReceived');
		if (notification === 'RELOAD') {
	      this.reload(payload);
	    }
	}
});


