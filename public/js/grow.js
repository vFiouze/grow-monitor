getresult = function(){
	let cookie=document.cookie
	let token=cookie.substring(7,cookie.length)
	let from = moment(document.getElementById('from').value).format('YYYY-MM-DD HH:mm:ss')
	let to = moment(document.getElementById('to').value).format('YYYY-MM-DD HH:mm:ss')
	let temperature=document.getElementById('temperature')
	let tempRequest = temperature.options[temperature.selectedIndex].value
	let myInit = { method: 'POST',
               	   headers: {'Accept': 'application/json, text/plain, */*',
               	   			 'Content-Type': 'application/json'},
  				   body: JSON.stringify({from: from, to: to,temperature:tempRequest,token:token})
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
			labels.push(moment(data.rows[i].date).format('MMMM D, YYYY hh:mm A'))
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
	let from = document.getElementById('from')
	let to = document.getElementById('to')
	if(from!==null){
		//adding class active itme
		$('#monitor').addClass('active')
		$('#settings').removeClass('active')
		$('#changepassword').removeClass('active')

		//calendar
		$('#rangestart').calendar({
			type: 'datetime',
			endCalendar: $('#rangeend'),
		})
		$('#rangeend').calendar({
			type: 'datetime',
			startCalendar: $('#rangestart'),
			maxDate: new Date()
		})
		
		let now = moment()
		let nowMinus12Hours = moment().subtract(12, 'hours');
		format = 'MMMM D, YYYY hh:mm A'
	  	to.value = now.format(format)
		from.value =  nowMinus12Hours.format(format)
		getresult()
	}
	if(document.getElementById('tempMinValue')!==null){
		$('#settings').addClass('active')
		$('#monitor').removeClass('active')
		$('#changepassword').removeClass('active')
		

		minCel =  document.getElementById('tempMinValue').value
		maxCel = document.getElementById('tempMaxValue').value
		$('.ui.form').form({
    			fields: {
	      			tempMinValue  : 'decimal',
	      			tempMaxValue  : 'decimal',
	      			humidMinValue : 'decimal',
	      			humidMaxValue : 'decimal',
				}
		})
		$('#startgrow').calendar({
			type: 'date'})
  		}

  	if(document.getElementById('login')!=null){
  		$('.ui.form').form({
    			fields: {
	      			name  : 'empty',
	      			password:'empty'
	      		}
	      })

  	}
	if(document.getElementById('repass')!=null){
  		$('#monitor').removeClass('active')
		$('#settings').removeClass('active')
		$('#changepassword').addClass('active')
		$('.ui.form').form({
    			fields: {
    				match:{
    					identifier:"password",
    					rules:[{
    						type: 'match[repass]',
    						prompt:'Both password are not equal'
    					},
    					{
    						type: 'empty',
    						prompt:'Fill password fields'
    					}]
    				}
	      		}
	      	})
	}


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
var minCel = null 
var maxCel = null

var convert = function(){
	let checkbox = document.getElementById('convertcheck').checked
	if(checkbox==true){
		minTemp = Math.round(((minCel * 9/5) + 32)*10)/10
		maxTemp = Math.round(((maxCel * 9/5) + 32)*10)/10
		document.getElementById('tempMinValue').value = minTemp
		document.getElementById('tempMaxValue').value = maxTemp
	}else{
		document.getElementById('tempMinValue').value = minCel
		document.getElementById('tempMaxValue').value = maxCel
	}
	
}

