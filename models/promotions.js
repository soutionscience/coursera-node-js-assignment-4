var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;
//create schema



var promoSchema = new Schema({
	name: {
		type:String,
		required:true,
		unique:true
	},
	image:{
		type: String,
		required:true

	},
	
	label:{
		type: String,
		default: null

	},
	price:{
		type: Currency,
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
var Promotion = mongoose.model('Promo' , promoSchema);

module.exports =Promotion;