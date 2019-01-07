var NodeHelper = require("node_helper");
const https = require('https');
const linky = require('@bokub/linky');
const moment = require('moment');

module.exports = NodeHelper.create({
	start: function() {
	},
	
	reload: async function(refConfig) {

		try {
			let self = this;
			let data = {};
			let index = 0;
			for (dataType of refConfig.dataTypes) {
				var linkyData = await self.requestData(dataType);
				data[''+dataType] = linkyData;
			}

			this.sendSocketNotification("RELOAD_DONE",data);
		} catch(err) {
			err
		}
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'RELOAD') {
	      this.reload(payload);
	    }
	},

	getLinkySessionPromised() {
		return linky.login('hoarau.soullard@gmail.com', 'To@Mo@23E');
	},

	async requestData(dataType) {

		try {
			let sessionPromised = this.getLinkySessionPromised();
			let session = await sessionPromised;

			switch(dataType) {
				case 'hourly':
					var dataPromised = session.getHourlyData();
					break;
				case 'daily':
					var dataPromised = session.getDailyData();
					break;
				case 'monthly':
					var dataPromised = session.getMonthlyData();
					break;
				case 'yearly':
					var dataPromised = session.getYearlyData();
					break;
				case 'currentMonthEstimation':
					var firstDayOfCurrentMonth = moment().startOf('month').format('DD/MM/YYYY');
					var dataPromised = session.getDailyData({
						start: firstDayOfCurrentMonth
					});
					break;
			}

			var returnData = await dataPromised;
			return returnData;

		} catch(err) {
			console.log(err);
		}


	},



});


