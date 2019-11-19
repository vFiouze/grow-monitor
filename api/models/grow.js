var sqlite3 = require('sqlite3').verbose()


class Grow {

	constructor(){
		this.db = new sqlite3.Database('growdatabase.db',function(err){
			if(err){
				console.log('something went wrong')
				console.log(err)
			}
		})


		this.get = function(from,to,temperature,callback){
			//get message between dates
			this.db.all('SELECT * FROM grow where DATE >= datetime(?) and DATE <= datetime(?) order by DATE asc',from,to,function(err, rows) {
				if (err){
					console.log('error getting the data')
					console.log(err)
				}
				if(temperature=='F'){
					for (var i = 0; i < rows.length; i++) {
						rows[i].temperature = rows[i].temperature*9/5 +32
					}
				}
				callback(rows)
			})
			this.db.close()
		}
	}
}

module.exports = Grow