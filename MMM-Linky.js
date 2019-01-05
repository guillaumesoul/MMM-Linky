'use strict';

Module.register("MMM-Linky",{
    // Default module config.
    defaults: {
        updateInterval: 900000,
        initialLoadDelay: 0,
        animationSpeed: 1000,
        result: {},
        jsonData: {},
    },

    start: function() {

        var canvas = document.createElement('canvas');
        canvas.setAttribute("id", "dailyChart");
        canvas.setAttribute("style", "width: 400px; height: 400px; ");

        let chartContainer = document.getElementById("chartContainer");
        chartContainer.appendChild(canvas);

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

        console.log('getDom');

        //var canvas = '<canvas id="myChart" width="400" height="400"></canvas>';



        var wrapper = document.createElement("div");
        var data = this.result;
        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        //wrapper.appendChild(canvas);

        console.log(this.config.jsonData);
        var test = this.config.jsonData[0].date;
        console.log(test);
        var momentdate = moment(test);
        console.log(momentdate);

        let consoLabel = this.config.jsonData.map(a => a.date);
        let consoData = this.config.jsonData.map(a => a.value);
        let BackgroundColors = [];
        for(var i = 0 ; i<consoData.length; i++) {
            BackgroundColors.push('rgba(255, 255, 255, 0.7)')
        }


        var ctx = document.getElementById("dailyChart");

        console.log(ctx);

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: consoLabel,
                datasets: [{
                    label: '# of Votes',
                    data: consoData,
                    backgroundColor: BackgroundColors,
                    /*borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1*/
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


        return wrapper;

    },
    updateLinky: function() {
        this.config.jsonData = {};
        this.sendSocketNotification('RELOAD',this.config);
    },
    socketNotificationReceived: function(notification, payload) {
        this.config.jsonData = payload;
        if (notification === "RELOAD_DONE") {
            this.loaded = true;
            this.updateDom(this.animationSpeed);
        }
    }

});
