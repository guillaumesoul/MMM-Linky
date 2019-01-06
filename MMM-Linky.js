'use strict';

Module.register("MMM-Linky",{
    // Default module config.
    defaults: {
        updateInterval: 900000,
        initialLoadDelay: 0,
        animationSpeed: 1000,
        jsonData: {},
        dataType: ['daily', 'hourly', 'estimationCurrentMonth'],
        kWhPrice: 0.1467,
        abonnementPrice: 14.77
    },

    start: function() {

        var canvas = document.createElement('canvas');
        canvas.setAttribute("id", "dailyChart");
        canvas.setAttribute("style", "width: 400px; height: 400px; ");

        //let chartContainer = document.getElementById("chartContainer");
        //let chartContainer = document.getElementsByClassName('MMM-Linky')
        //let chartContainer = document.querySelectorAll('.MMM-Linky .module-content');
        let chartContainer = document.querySelectorAll('.top.left .container');
        console.log(chartContainer);
        //chartContainer.appendChild(canvas);

        Log.log('LOG' + this.name + ' is started!');
        // Set locale.
        moment.locale(config.language);
        this.title = "Loading...";
        this.loaded = false;
        var self = this;
        setInterval(function() { self.updateLinky(); }, this.config.updateInterval);

        // first update on start
        self.updateLinky();
    },

    // Define required scripts.
    getScripts: function() {
        return ["https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.bundle.min.js", "moment.js"];
    },

    getStyles: function() {
        return [];
    },

    // Override dom generator.
    getDom: function() {

        var wrapper = document.createElement("div");
        //var data = this.result;
        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if(this.config.jsonData.daily != undefined) {
            //this.drawChartDaily();
        }
        return wrapper;

    },
    updateLinky: function() {
        this.config.jsonData = {};
        this.sendSocketNotification('RELOAD',this.config);
    },
    socketNotificationReceived: function(notification, payload) {

        if(payload.hourly != undefined) {
            this.config.jsonData.hourly = this.formatHourlyData(payload.hourly);
        }

        if(payload.daily != undefined) {
            this.config.jsonData.daily = payload.daily;
        }

        if(payload.currentMonthEstimation != undefined) {
            this.config.jsonData.currentMonthEstimation = this.getCurrentMonthEstimationprice(payload.currentMonthEstimation);
        }

        if (notification === "RELOAD_DONE") {
            this.loaded = true;
            this.updateDom(this.animationSpeed);
        }
    },

    formatHourlyData(rawData) {
        let dataFormatted = [];
        for(var i=0; i<rawData.length; i++ ) {
            if(dataFormatted[Math.trunc(i/2)] == undefined) {
                dataFormatted[Math.trunc(i/2)] = 0;
            }
            dataFormatted[Math.trunc(i/2)] += parseFloat(rawData[i].value);
            if(i%2 == 1) {
                dataFormatted[Math.trunc(i/2)] = parseFloat(dataFormatted[Math.trunc(i/2)].toFixed(2));
            }
        }
        return dataFormatted;
    },

    getCurrentMonthEstimationprice(rawData) {
        let currentMonthEstimationprice = this.config.abonnementPrice;
        for(var i=0; i<rawData.length; i++ ) {
            currentMonthEstimationprice += parseFloat(rawData[i].value)*this.config.kWhPrice;
        }
        return Math.round(currentMonthEstimationprice);
    },

    drawChartDaily() {
        let dailyData = this.config.jsonData.daily;
        let consoLabel = dailyData.map(a => moment(a.date).format('DD/MM'));
        let consoData = dailyData.map(a => a.value);
        let BackgroundColors = [];
        for(var i = 0 ; i<consoData.length; i++) {
            BackgroundColors.push('rgba(255, 255, 255, 0.7)')
        }

        var ctx = document.getElementById("dailyChart");

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: consoLabel,
                datasets: [{
                    label: '# of Votes',
                    data: consoData,
                    backgroundColor: BackgroundColors,
                }]
            },
            options: {
                //responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

});
