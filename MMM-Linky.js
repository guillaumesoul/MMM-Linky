'use strict';

Module.register("MMM-Linky",{
    // Default module config.
    defaults: {
        updateInterval: 900000,
        initialLoadDelay: 0,
        animationSpeed: 1000,
        jsonData: {},
        /*dataType: ['daily', 'hourly', 'estimationCurrentMonth'],
        kWhPrice: 0.1467,
        abonnementPrice: 14.77*/
    },

    start: function() {

        this.initDomForChart();

        Log.log('LOG' + this.name + ' is started!');
        // Set locale.
        moment.locale(config.language);
        this.title = "Loading...";
        this.loaded = false;
        var self = this;
        setInterval(function() { self.updateLinky(); }, this.data.config.updateInterval);

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
        this.sendSocketNotification('RELOAD',this.data.config);
    },
    socketNotificationReceived: function(notification, payload) {

        if(payload.hourly != undefined) {
            console.log(payload.hourly);
            this.config.jsonData.hourly = this.formatHourlyData(payload.hourly);
            this.drawChartHourly();
        }

        if(payload.daily != undefined) {
            this.config.jsonData.daily = payload.daily;
            this.drawChartDaily();
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
        let currentMonthEstimationprice = this.data.config.abonnementPrice;
        for(var i=0; i<rawData.length; i++ ) {
            currentMonthEstimationprice += parseFloat(rawData[i].value)*this.data.config.kWhPrice;
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

        var ctx = document.getElementById("daily");

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: consoLabel,
                datasets: [{
                    label: 'Conso 30 derniers jours',
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
    },

    drawChartHourly() {
        let dailyData = this.config.jsonData.hourly;
        console.log(dailyData);
        var consoLabel = []
        for(var i = 0 ; i< 24 ; i++) {
            consoLabel.push(i);
        }
        let BackgroundColors = [];
        for(var i = 0 ; i<dailyData.length; i++) {
            BackgroundColors.push('rgba(255, 255, 255, 0.7)')
        }

        var ctx = document.getElementById("hourly");
        console.log(ctx);

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: consoLabel,
                datasets: [{
                    label: 'Conso hier',
                    data: dailyData,
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
    },

    /*
    * Create canvas tag for all datatype set in config.dataTypes
    */
    initDomForChart() {
        let self = this;
        this.data.config.dataTypes.forEach(function(dataType) {
            if(dataType != 'currentMonthEstimation') {
                var domElement = document.createElement('canvas');
                domElement.setAttribute("id", dataType);
            } else {
                var domElement = document.createElement('div');
                domElement.setAttribute('id','currentEstimation');
            }
            // select the container from the region defined in config (eg '.top.right .container')
            var selectorContainer = '.'+self.data.position.split('_').join('.')+' .container';
            var chartContainer = document.querySelectorAll(selectorContainer);
            chartContainer[0].appendChild(domElement);
        });
    },


});
