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
}

getDataFromFirebase(parseFirebaseData);

/*********************************************
 * HighCharts graphing functions
 *********************************************/

$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        $('#container').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'USD to EUR exchange rate over time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Exchange rate'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'USD to EUR',
                data: data
            }]
        });
    });
});

