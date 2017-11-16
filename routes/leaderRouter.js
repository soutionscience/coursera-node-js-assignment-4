
var express = require('express');
 var bodyParser = require('body-parser');


 var mongoose = require('mongoose');

var Leaders = require('../models/leadership');

var verify = require('./verify')


var leadRouter = express.Router();
leadRouter.use(bodyParser.json());


// console.log("uko")
leadRouter.route('/').
get(verify.verifyOrdinaryUser, function(req, res, next){

	Leaders.find({}, function(err, leader){
		if(err) throw err
			res.json(leader)

	});

})

.post(verify.verifyOrdinaryUser,  verify.verifyAdmin, function(req, res, next){
	Leaders.create(req.body, function(err, leader){
		if(err) throw err
			console.log("leader Created!!")
		var id= leader._id;
		res.writeHead(200,{
			'content-type':'text/plain'
		});

        res.end('"added the leader with id: '+ id)
	});


})
.delete(verify.verifyOrdinaryUser,  verify.verifyAdmin, function(req, res, next){

	Leaders.remove({}, function(err, rsp){
		if(err) throw err
			res.json(rsp)
	})
});

leadRouter.route('/:leadId')
.get(verify.verifyOrdinaryUser, function(req, res, next){
	// in full app get specific data
	  Leaders.findById(req.params.leadId, function(err, leader){
	  	if(err) throw err
	  		res.json(leader)
	  });
})
.put(verify.verifyOrdinaryUser,  verify.verifyAdmin, function(req, res, next){
	// will change/update item with leadId
	Leader.findByIdAndUpdate(req.params.leadId,{$set: req.body}, {new: true}, function(err, lead){
		if( err )throw err
			res.json(lead)


	});
})
.delete(verify.verifyOrdinaryUser,  verify.verifyAdmin, function(req, res, next){

	Leader.findByIdAndRemove(req.params.leadId, function(err, resp){
		if (err) throw err
			resp.json(resp);

	});

});
	
	module.exports = leadRouter