var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var favouriteSchema = new Schema({

	id: String,
	postedBy:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}


})


module.exports = favouriteSchema

var favorite = mongoose.model('favorite', favouriteSchema)

module.exports = favorite;