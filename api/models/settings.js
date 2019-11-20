var sqlite3 = require('sqlite3').verbose()


class Settings {

	constructor(){
		this.db = new sqlite3.Database('growdatabase.db',function(err){
			if(err){
				console.log('something went wrong')
				console.log(err)
			}
		})


		this.get = function(callback){
			//get message between dates
			this.db.all('SELECT * FROM settings order by id asc',function(err, rows) {
				if (err){
					console.log('error getting the data')
					console.log(err)
				}
				callback(rows)
			})
			this.db.close()
		}
		this.save = function(tempMinValue,tempMaxValue,humidMinValue,humidMaxValue,fahrenheit,startDate,callback){
			if(fahrenheit=='on'){
				tempMinValue=Math.round((tempMinValue-32)*5/9*10)/10
				tempMaxValue=Math.round((tempMaxValue-32)*5/9*10)/10
			}
			this.db.run("UPDATE settings SET minvalue = ?, maxvalue=? WHERE variable = 'temperature'", tempMinValue,tempMaxValue);
			this.db.run("UPDATE settings SET minvalue = ?, maxvalue=? WHERE variable = 'humidity'", humidMinValue,humidMaxValue);
			this.db.run("UPDATE settings SET date = ? WHERE variable = 'startgrow'", startDate);
			this.db.close()
			callback(tempMinValue,tempMaxValue,humidMinValue,humidMaxValue,startDate)
		}
	}
}

module.exports = Settings