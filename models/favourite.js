var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var dishSchema = require('./dishes')





var favouriteSchema = new Schema({

	id: String,
	postedBy:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User36'
	},
	dishes:[{
		type: ObjectId,
    ref: "Dish"}
    ]



})


module.exports = favouriteSchema

var favorite = mongoose.model('favorite', favouriteSchema)

module.exports = favorite;