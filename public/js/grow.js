getresult = function(){
	var from = moment(document.getElementById('from').value).format('YYYY-MM-DD HH:mm:ss')
	var to = moment(document.getElementById('to').value).format('YYYY-MM-DD HH:mm:ss')
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
	//destroy previous chart
	if(graph){
		graph.destroy()	
	}
	

	//preparing the dataset
	var temperature = []
	var humidity = []
	var labels = []
	var averageTempDataSet = []
	var averageTemp = 0
	for (var i = 0; i < data.rows.length; i++) {
			temperature.push(parseFloat(data.rows[i].temperature))
			humidity.push(data.rows[i].humidity)
			labels.push(moment(data.rows[i].date).format('MMMM D, YYYY h:mm A'))
			averageTemp = averageTemp+parseFloat(data.rows[i].temperature)
	}
	averageTemp = averageTemp/data.rows.length
	averageTemp = Math.round(averageTemp * 100) / 100
	for (var i = 0; i < data.rows.length; i++) {
		averageTempDataSet.push(averageTemp)
	}
	var tempselected=document.getElementById('temperature')
	var chartData = buildChartData(labels,temperature,averageTempDataSet,tempselected,humidity,true,true)
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data:chartData,
	    options: {
        	scales: {
            	yAxes: [{
                	id: 'temperature-y-axis',
                	type: 'linear',
                	position:'left',
                	scaleLabel:{
                		display:true,
                		labelString:'Temperature (°' + tempselected.options[tempselected.selectedIndex].value+')',
                		fontStyle:'bold',
            			fontSize:'14'
                	}
            	}, {
                	id: 'humidity-y-axis',
                	type: 'linear',
                	position:'right',
                	labelString:'Humidity (%)',
                	scaleLabel:{
                		display:true,
                		labelString:'Humidity (%)',
                		fontStyle:'bold',
            			fontSize:'14'
                	}
            	}],
            	xAxes:[{
            		scaleLabel:{
            			display:true,
            			labelString:'Date (Month Day, Year Hour:Minute AM/PM)',
            			fontStyle:'bold',
            			fontSize:'14'
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
	this.graph = myChart
}
buildChartData = function(labels,temperature,averageTempDataSet,tempselected,humidity,showTemp,showHumidity){
	return {
	    	labels:labels,
	    	datasets: [{
	    		data : temperature,
	    		label: "Temperature (°" + tempselected.options[tempselected.selectedIndex].value+')',
	    		fill:false,
	    		backgroundColor:'rgba(215, 39, 39, 1)',
	    		borderColor:'rgba(215, 39, 39, 1)',
	    		borderWidth:1,
	    		pointRadius:1,
	    		yAxisID: 'temperature-y-axis',
	    		showLine:showTemp
	    	},
	    	{
	    		data : averageTempDataSet,
	    		label: "Average temperature (°" + tempselected.options[tempselected.selectedIndex].value+')',
	    		fill:false,
	    		backgroundColor:'rgba(242, 140, 7, 1)',
	    		borderColor:'rgba(242, 140, 7, 1)',
	    		borderWidth:1,
	    		pointRadius:0,
	    		yAxisID: 'temperature-y-axis',
	    		showLine:showTemp
	    	},
	    	{
	    		data : humidity,
	    		label: "Humidity (%)",
	    		fill:false,
	    		backgroundColor:'rgba(32, 154, 248, 1)',
	    		borderColor:'rgba(32, 154, 248, 1)',
	    		borderWidth:1,
	    		pointRadius:1,
	    		yAxisID: 'humidity-y-axis',
	    		showLine:showHumidity
	    	}]
	    }
}
document.addEventListener('DOMContentLoaded', (event) => {
	//calendar
	$('#rangestart').calendar({
		type: 'datetime',
		endCalendar: $('#rangeend'),
	})
	$('#rangeend').calendar({
		type: 'datetime',
		startCalendar: $('#rangestart')
	})
	let from = document.getElementById('from')
	let to = document.getElementById('to')
	let now = moment()
	let nowMinus12Hours = moment().subtract(12, 'hours');
  	to.value = now.format('MMMM D, YYYY h:mm A')
	from.value =  nowMinus12Hours.format('MMMM D, YYYY h:mm A')
	getresult()
})
var showTemp = function(){
	var checkBoxTemp = document.getElementById('showtemp').checked
	if(checkBoxTemp==true){
		graph.data.datasets[0].showLine = true;
		graph.data.datasets[1].showLine = true;
		color = 'rgba(215, 39, 39, 1)'
		graph.data.datasets[0].pointBackgroundColor=color
		graph.data.datasets[1].pointBackgroundColor=color
		graph.data.datasets[0].pointBorderColor=color
		graph.data.datasets[1].pointBorderColor=color
		
	}else{
		graph.data.datasets[0].showLine = false;
		graph.data.datasets[1].showLine = false;
		color = 'rgba(255,255,255,1)'
		graph.data.datasets[0].pointBackgroundColor=color
		graph.data.datasets[1].pointBackgroundColor=color
		graph.data.datasets[0].pointBorderColor=color
		graph.data.datasets[1].pointBorderColor=color
		
	}

	graph.update()
}
var showHumid = function(){
	var checkBoxTemp = document.getElementById('showhumid').checked
	if(checkBoxTemp==true){
		color = 'rgba(32, 154, 248, 1)',
		graph.data.datasets[2].showLine = true;
		graph.data.datasets[2].pointBorderColor=color
		graph.data.datasets[2].pointBorderColor=color
	}else{
		color = 'rgba(255,255,255,1)'
		graph.data.datasets[2].showLine = false;
		graph.data.datasets[2].pointBorderColor=color
		graph.data.datasets[2].pointBorderColor=color
	}

	graph.update()
}

var graph = null