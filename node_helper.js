var NodeHelper = require("node_helper");
const https = require('https');

const linky = require('@bokub/linky');

module.exports = NodeHelper.create({
	start: function() {
	},
	
	reload: async function(refConfig) {
		let dailyData = await this.requestDailyData();
		this.sendSocketNotification("RELOAD_DONE",dailyData);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'RELOAD') {
	      this.reload(payload);
	    }
	},

	getLinkySessionPromised() {
		return linky.login('hoarau.soullard@gmail.com', 'To@Mo@23E');
	},

	async requestDailyData() {
		let sessionPromised = this.getLinkySessionPromised();
		let session = await sessionPromised;
		let dataPromised = session.getDailyData(session, {});
		return await dataPromised;
	}
});


