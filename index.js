const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const moment = require('moment')
var bodyParser = require('body-parser')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine','ejs')
app.use('/asset',express.static('public'))
app.use(cookieParser())
const dotenv = require('dotenv')
dotenv.config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('./api/middlewares/checkAuth.js')

app.get('/',checkAuth,function(req,res){
	res.render('pages/index',{login:true})
})

app.post('/',checkAuth,function(req,res){
	let Grow = require('./api/models/grow.js')
	grow = new Grow()
	let from = req.body.from
	let to = req.body.to
	let temperature = req.body.temperature
	grow.get(from,to,temperature,function(rows){
		res.status(200).json({rows:rows})
	})
})

app.get('/settings',checkAuth,function(req,res){
	let Settings = require('./api/models/settings.js')
	settings = new Settings()
	settings.get(function(rows){
		let data = [ rows[0].minvalue, rows[0].maxvalue, rows[1].minvalue, rows[1].maxvalue,rows[2].date ]
		res.status(200).render('pages/settings',{data: data,success:false,login:true})
	})
})

app.post('/settings',checkAuth,function(req,res){
	tempMinValue = req.body.tempMinValue
	tempMaxValue =req.body.tempMaxValue
	humidMinValue = req.body.humidMinValue
	humidMaxValue = req.body.humidMaxValue
	temp = req.body.fahrenheit
	startDate=moment(req.body.startgrow).format('YYYY-MM-DD HH:mm:ss')
	let Settings = require('./api/models/settings.js')
	settings = new Settings()
	settings.save(tempMinValue,tempMaxValue,humidMinValue,humidMaxValue,temp,startDate,function(tempMinValue,tempMaxValue,humidMinValue,humidMaxValue,startDate){
		res.status(200).render('pages/settings',{data: [tempMinValue,tempMaxValue,humidMinValue,humidMaxValue,startDate],success:true})	
	})	
})

app.get('/login',function(req,res){
	res.status(200).render('pages/login',{loginSuccess:true,login:false})
})

app.post('/login',function(req,res){
	username = req.body.username
	password=req.body.password;
	let User = require('./api/models/user.js')
	user = new User()
	user.get(username,function(rows){
		if(bcrypt.compareSync(password,rows[0].password)){
			//issue token.
			token = jwt.sign({username:username},
							process.env.JWT_KEY,
							{expiresIn:864000})
			res.status(200).cookie('token',token,{expires:moment().add(10,'days').toDate()}).redirect('/')
		}else{
			res.status(200).render('pages/login',{loginSuccess:false})
		}
		
	})
})

app.get('/signup',function(req,res){
	res.status(200).render('pages/signup',{login:false,error:false})
})

app.post('/signup',function(req,res){
	//creating the user, the password and issuing the token
	username = req.body.username
	password=bcrypt.hashSync(req.body.password, 10);
	let User = require('./api/models/user.js')
	user = new User()
	user.get(username,function(rows){
		if(rows.length>0){
			res.status(200).render('pages/signup',{login:false,error:"User already exists"})
		}else{
			user = new User()
			user.save(username,password,function(){
			res.status(200).render('pages/login',{login:false,loginSuccess:true})
	})
		}
	})
	
})

app.get('/logout',function(req,res){
	res.clearCookie('token').redirect('/')
})

app.listen(3000)