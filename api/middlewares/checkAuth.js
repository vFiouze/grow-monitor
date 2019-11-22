const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
	token = req.cookies.token
	try {
		jwt.verify(token, process.env.JWT_KEY)
		next()
	}catch(e) {
		res.redirect('/login')
	}
}