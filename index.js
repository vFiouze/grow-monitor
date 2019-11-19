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

app.listen(3000)