getresult = function(){
	var from = document.getElementById('from').value
	var to = document.getElementById('to').value
	var temperature=document.getElementById('temperature')
	var tempRequest = temperature.options[temperature.selectedIndex].value
	var myInit = { method: 'POST',
               	   headers: {'Accept': 'application/json, text/plain, */*',
               	   			 'Content-Type': 'application/json'},
  				   body: JSON.stringify({from: from, to: to,temperature:tempRequest})
               	};
	fetch('/',myInit)
	.then(response=>response.json())
	.then(data=>plotChart(data))
}

plotChart = function(data){
	//preparing the dataset

	var temperature = []
	var humidity = []
	var labels = []
	var averageTempDataSet = []
	var averageTemp = 0
	for (var i = 0; i < data.rows.length; i++) {
			temperature.push(parseFloat(data.rows[i].temperature))
			humidity.push(data.rows[i].humidity)
			labels.push(data.rows[i].date)
			averageTemp = averageTemp+parseFloat(data.rows[i].temperature)
	}
	averageTemp = averageTemp/data.rows.length
	averageTemp = Math.round(averageTemp * 100) / 100
	for (var i = 0; i < data.rows.length; i++) {
		averageTempDataSet.push(averageTemp)
	}
	var tempselected=document.getElementById('temperature')
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data:{
	    	labels:labels,
	    	datasets: [{
	    		data : temperature,
	    		label: "Temperature (°" + tempselected.options[tempselected.selectedIndex].value+')',
	    		fill:false,
	    		backgroundColor:'rgba(215, 39, 39, 1)',
	    		borderColor:'rgba(215, 39, 39, 1)',
	    		borderWidth:2,
	    		yAxisID: 'temperature-y-axis',
	    	},
	    	{
	    		data : averageTempDataSet,
	    		label: "Average temperature (°" + tempselected.options[tempselected.selectedIndex].value+')',
	    		fill:false,
	    		backgroundColor:'rgba(242, 140, 7, 1)',
	    		borderColor:'rgba(242, 140, 7, 1)',
	    		borderWidth:2,
	    		yAxisID: 'temperature-y-axis',
	    	},
	    	{
	    		data : humidity,
	    		label: "Humidity (%)",
	    		fill:false,
	    		backgroundColor:'rgba(32, 154, 248, 1)',
	    		borderColor:'rgba(32, 154, 248, 1)',
	    		borderWidth:2,
	    		yAxisID: 'humidity-y-axis'
	    	}]
	    },
	    options: {
        	scales: {
            	yAxes: [{
                	id: 'temperature-y-axis',
                	type: 'linear',
                	position:'left',
                	scaleLabel:{
                		display:true,
                		labelString:'Temperature (°' + tempselected.options[tempselected.selectedIndex].value+')'
                	}
            	}, {
                	id: 'humidity-y-axis',
                	type: 'linear',
                	position:'right',
                	labelString:'Humidity (%)',
                	scaleLabel:{
                		display:true,
                		labelString:'Humidity (%)'
                	}
            	}],
            	xAxes:[{
            		scaleLabel:{
            			display:true,
            			labelString:'Date (YYYY-MM-DD HH:mm:ss)',
            		},
            		ticks:{
            			autoSkip: true,
                    	maxRotation: 90,
                    	minRotation: 90
            		}
            	}]
        	}
    	}   
	});
}

document.addEventListener('DOMContentLoaded', (event) => {
	let from = document.getElementById('from')
	let to = document.getElementById('to')
	let now = moment()
	let nowMinus12Hours = moment().subtract(12, 'hours');
  	to.value = now.format('YYYY-MM-D HH:mm:ss')
	from.value =  nowMinus12Hours.format('YYYY-MM-D HH:mm:ss')
	getresult()
})