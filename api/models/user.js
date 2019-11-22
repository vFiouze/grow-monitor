var sqlite3 = require('sqlite3').verbose()


class User {

	constructor(){
		this.db = new sqlite3.Database('growdatabase.db',function(err){
			if(err){
				console.log('something went wrong')
				console.log(err)
			}
		})


		this.get = function(user,callback){
			//get message between dates
			this.db.all('SELECT * FROM users where user = ?',user,function(err, rows) {
				if (err){
					console.log('error getting the data')
					console.log(err)
				}
				callback(rows)
			})
			this.db.close()
		}

		this.save = function(user,password,callback){
			//get message between dates
			this.db.all('INSERT INTO users (user,password) values(?,?)',user,password,function(err, rows) {
				if (err){
					console.log('error getting the data')
					console.log(err)
				}
				callback(rows)
			})
			this.db.close()
		}
	}
}

module.exports = User