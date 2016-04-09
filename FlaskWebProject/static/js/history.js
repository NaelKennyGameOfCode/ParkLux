/*********************************************
* Page elements
**********************************************/
$('#about-button').click(function () {
  swal({
    title: 'About',
    html: 'This web app displays live parking data in the City of Luxembourg, and allows you to find the closest available parking lot to your current location.<br/><br/>Built by <a href="http://kennysong.com" target="_blank">Kenny Song</a> and Nael Hailemariam in 24 hours for the <a href="http://www.gameofcode.eu/" target="_blank">Game of Code 2016</a>.',
    confirmButtonText: 'Awesome!',
  });
});

$('#history-button').click(function () {
  window.location = '/';
});

$('#parklux-text').click(function () {
  window.location = '/';
})

/*********************************************
 * Data handling functions
 *********************************************/
var db = new Firebase('https://parklux.firebaseio.com');

// Set listener for new parking lot data from Firebase
function getDataFromFirebase(callback) {
  db.once('value', callback);
}

function parseFirebaseData(snapshot) {
  snapshot = snapshot.val();
  console.log('Firebase data received', snapshot);

  parkingLotData = {}
  parkingLotNames.forEach(function (name) {
    data = [];
    for (unixTime in snapshot) {
      if (snapshot.hasOwnProperty(unixTime)) {
        var filledRatio = (snapshot[unixTime][name].capacity - snapshot[unixTime][name].available) / snapshot[unixTime][name].capacity;
        unixTime = parseInt(unixTime, 10) * 1000;
        data.push([unixTime, filledRatio]);
      } 
    }
    parkingLotData[name] = data;
  });

  // console.log(parkingLotData);
  graphAll(parkingLotData);
}

var parkingLotNames = ["Auchan", "Beggen", "Bouillon", "Brasserie", "Coque 1", "Coque 2", "Fort Neipperg", "Fort Wedell", "Gare", "Glacis", "Kirchberg", "Knuedler", "Kockelscheuer", "Luxembourg Sud", "Luxexpo", "Martyrs", "Monterey", "Nobilis", "Place de l'Europe", "Rocade", "Rond Point Schuman", "Saint-Esprit", "Stade", "Theatre", "Trois Glands"]
var namesToIds = {"Auchan": "auchan", "Beggen": "beggen", "Bouillon": "bouillon", "Brasserie": "brasserie", "Coque 1": "coque-1", "Coque 2": "coque-2", "Fort Neipperg": "fort-neipperg", "Fort Wedell": "fort-wedell", "Gare": "gare", "Glacis": "glacis", "Kirchberg": "kirchberg", "Knuedler": "knuedler", "Kockelscheuer": "kockelscheuer", "Luxembourg Sud": "luxembourg-sud", "Luxexpo": "luxexpo", "Martyrs": "martyrs", "Monterey": "monterey", "Nobilis": "nobilis", "Place de l'Europe": "place-de-leurope", "Rocade": "rocade", "Rond Point Schuman": "rond-point-schuman", "Saint-Esprit": "saint-esprit", "Stade": "stade", "Theatre": "theatre", "Trois Glands": "trois-glands"};
getDataFromFirebase(parseFirebaseData);

/*********************************************
 * HighCharts graphing functions
 *********************************************/
Highcharts.setOptions({
  global: {
      timezoneOffset: -2*60
  }
});

function graphAll(parkingLotData) {
  parkingLotNames.forEach(function (name) {
    var divId = namesToIds[name];
    $('#' + divId).highcharts({
      chart: { zoomType: 'x' },
      title: { text: name + ' Parking Data'},
      // subtitle: { text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in' },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: 'Filled Ratio' }, labels: {format: '{value:.2f}'}, minRange: 0.5, max: 1.0 },
      legend: { enabled: false },
      plotOptions: { area: 
        { fillColor: {},
          marker: { radius: 2 },
          lineWidth: 1,
          states: { hover: { lineWidth: 1 } },
          threshold: null
        }
      },
      series: [{ 
        type: 'line',
        name: name + ' Filled Ratio',
        data: parkingLotData[name]
      }],
      tooltip: { valueDecimals: 2}
    }); 
  });

  $('#loading').hide();

 // $('#container').highcharts({
 //    chart: { zoomType: 'x' },
 //    title: { text: 'USD to EUR exchange rate over time' },
 //    subtitle: { text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in' },
 //    xAxis: { type: 'datetime' },
 //    yAxis: { title: { text: 'Exchange rate' } },
 //    legend: { enabled: false },
 //    plotOptions: { area: 
 //      { fillColor: {},
 //        marker: { radius: 2 },
 //        lineWidth: 1,
 //        states: { hover: { lineWidth: 1 } },
 //        threshold: null
 //      }
 //    },
 //    series: [{ 
 //      type: 'area',
 //      name: 'USD to EUR',
 //      data: data
 //    }]
 //  }); 
}



Highcharts.theme = {
   colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
      style: {
         fontFamily: "'Raleway', sans-serif"
      },
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
      }
   },
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
  

