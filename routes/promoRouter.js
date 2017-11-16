
var express = require('express');
 var bodyParser = require('body-parser');

 var mongoose= require('mongoose')
  var Promo= require('../models/promotions')
  var verify = require('./verify')

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());

// console.log("uko")
promoRouter.route('/')

.get(verify.verifyOrdinaryUser, function(req, res, next){
	Promo.find({}, function(err, promotion){

		if (err) throw err
			res.json(promotion);

	});
})
.post(verify.verifyOrdinaryUser,  verify.verifyAdmin, function(req, res, next){
	// the body of req will have data to pass to db

	Promo.create(req.body, function(err, promotion){
		if (err) throw err
			console.log("promotion has been created")
		var id = promotion._id;
		res.writeHead(200,{
			'content-type':'text/plain'
		})
		res.end("added the leader with id: "+ id)
	})

})
.delete(verify.verifyOrdinaryUser,  verify.verifyAdmin, function(req, res, next){

	Promo.remove({}, function(err, resp){
		if (err) throw err
			res.json(resp);

	})

});

promoRouter.route('/:promoId')

.get(verify.verifyOrdinaryUser, function(req, res, next){
	Promo.findById(req.params.promoId, function(err, promotion){
		if (err) throw err
			res.json(promotion)
	})
})
.put(verify.verifyOrdinaryUser,  verify.verifyAdmin, function(req, res, next){
	// will change/update item with promoId
Promo.findByIdAndUpdate(req.params.promoId,{$set: req.body}, {new: true}, function(err, promotion){
	if (err) throw err
		res.json(promotion)

})
})
.delete(verify.verifyOrdinaryUser,  verify.verifyAdmin, function(req, res, next){

	Promo.findByIdAndRemove(req.params.promoId, function(err, resp){
		if (err) throw err
			res.json(resp)
	})

});
	
	module.exports = promoRouter