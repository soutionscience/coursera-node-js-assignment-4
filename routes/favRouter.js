var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var Favourites = require('../models/favourite');
var verify = require('./verify')


var favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());


favouriteRouter.route('/')
.get(verify.verifyOrdinaryUser, function(req, res, next){


	  Favourites.find({}, function(err, fav){
	  	if(err) throw err
	  		res.json(fav)
	  })

	  // .populate('comments.postedBy')
   //          .exec(function(err, fav) {
   //              if (err) throw err;
   //              res.json(fav);
   //          });
   //   next();
	// console.log('hitting')

	// res.send(200)

})
.post( verify.verifyOrdinaryUser, function(req, res, next){
	Favourites.create(req.body, function(err, fav){
		if(err) throw err;
		console.log("favourite created")
		var id = fav._id;
		res.writeHead(200,{
			'content-type': 'text/plain',
		})
		res.end('"added the comments with id: ' + id)
	})
})

.delete(verify.verifyOrdinaryUser,  function(req, res, next){
	console.log("item deleted")
})

module.exports = favouriteRouter


