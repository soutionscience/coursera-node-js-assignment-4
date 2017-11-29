var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var dishSchema = require('./dishes')





var favouriteSchema = new Schema({

	dishes:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish'
	}],

    postedBy:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User36'
	}

	



})


module.exports = favouriteSchema

var favorite = mongoose.model('favorite', favouriteSchema)

module.exports = favorite;