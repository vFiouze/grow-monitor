const express = require('express')
const app = express()
const moment = require('moment')
var bodyParser = require('body-parser')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine','ejs')
app.use('/asset',express.static('public'))

app.post('/',function(req,res){
	let Grow = require('./api/models/grow.js')
	grow = new Grow()
	let from = req.body.from
	let to = req.body.to
	let temperature = req.body.temperature
	grow.get(from,to,temperature,function(rows){
		res.status(200).json({rows:rows})
	})
})
app.get('/',function(req,res){
	res.render('pages/index')
})

app.get('/settings',function(req,res){
	let Settings = require('./api/models/settings.js')
	settings = new Settings()
	settings.get(function(rows){
		//console.log(rows[0].minvalue)
		let data = [ rows[0].minvalue, rows[0].maxvalue, rows[1].minvalue, rows[1].maxvalue ]
		res.render('pages/settings',{data: data,success:false})
	})
})


app.post('/settings',function(req,res){

	tempMinValue = req.body.tempMinValue
	tempMaxValue =req.body.tempMaxValue
	humidMinValue = req.body.humidMinValue
	humidMaxValue = req.body.humidMaxValue
	temp = req.body.fahrenheit
	let Settings = require('./api/models/settings.js')
	settings = new Settings()
	settings.save(tempMinValue,tempMaxValue,humidMinValue,humidMaxValue,temp,function(tempMinValue,tempMaxValue,humidMinValue,humidMaxValue){
		res.render('pages/settings',{data: [tempMinValue,tempMaxValue,humidMinValue,humidMaxValue],success:true})	
	})
	
})
app.listen(3000)