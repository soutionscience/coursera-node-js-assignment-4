var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;
//create schema



var leadSchema = new Schema({
	name: {
		type:String,
		required:true,
		unique:true
	},
	image:{
		type: String,
		required:true

	},
	
	designation:{
		type: String,
		required:true

	},
	abbr:{
		type: String,
		required:true

	},
	description:{
		type: String,
		required: true
	},
	
	
},
	{
		timestamps:true
	
});

// create a model
var Leaders = mongoose.model('Leader' , leadSchema);

module.exports =Leaders;