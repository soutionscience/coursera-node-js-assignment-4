var express = require('express');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');

var Dishes = require('../models/dishes');

var verify = require('./verify')

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

// console.log("uko")
dishRouter.route('/')
    .get(verify.verifyOrdinaryUser, function(req, res, next) {
        // in full app get will get back data from db
        Dishes.find({}).populate('comments.postedBy')
            .exec(function(err, dish) {
                if (err) throw err;
                res.json(dish);
            });
    })
    .post(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
        // the body of req will have data to pass to db

        Dishes.create(req.body, function(err, dish) {

            if (err) throw err;
            console.log('Dish created!');
            var id = dish._id;
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
            res.end('"added the dish with id: ' + id)
        });

    })
    .delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {

        Dishes.remove({}, function(err, resp) {
            if (err) throw err;
            res.json(resp);

        });

    });

dishRouter.route('/:dishId')

    // .get(function(req, res, next){
    // in full app get specific data
    //res.end('Will send details of the dish: ' + req.params.dishId + ' to you!')

    .get(function(req, res, next) {

        Dishes.findById(req.params.dishId).
        populate('comments.postedBy')
            .exec(function(err, dish) {
                if (err) throw err;
                res.json(dish);
            });

    })

    .put(function(req, res, next) {
        // will change/update item with dishId
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true }, function(err, dish) {
            if (err) throw err;
            res.json(dish)
        });
    })
    .delete(function(req, res, next) {

        Dishes.findByIdAndRemove(req.params.dishId, function(err, resp) {
            if (err) throw err;
            res.json(resp);
        });

    });


dishRouter.route('/:dishId/comments')
    .all(verify.verifyOrdinaryUser)
    .get(function(req, res, next) {

        Dishes.findById(req.params.dishId).populate('comments.postedBy')
            .exec(function(err, dish) {
                if (err) throw err;
                res.json(dish.comments);
            });

    })
    .post(function(req, res, next) {

        Dishes.findById(req.params.dishId, function(err, dish) {

            if (err) throw err;

            req.body.postedBy = req.decoded._doc._id;
            dish.comments.push(req.body);

            dish.save(function(err, dish) {
                if (err) throw err;
                console.log('Updated Comments!!');
                //console.log(dish);
                res.json(dish);
            });

        });

    })
    .delete(verify.verifyAdmin, function(req, res, next) {
        Dishes.findById(req.params.dishId, function(err, dish) {
            if (err) throw err;
            for (var i = (dish.comments.length - 1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save(function(err, result) {
                if (err) throw err;
                res.writeHead(200, {
                    'content-type': 'text/plain'
                });
                res.end('Deleted all comments!')
            });
        });

    });

dishRouter.route('/:dishId/comments/:commentId')
    .all(verify.verifyOrdinaryUser)
    .get(function(req, res, next) {
        Dishes.findById(req.params.dishId).populate('comments.postedBy')
            .exec(function(err, dish) {
                if (err) throw err;
                res.json(dish.comments.id(req.params.commentId));
            });
    })
    .put(function(req, res, next) {
        Dishes.findById(req.params.dishId, function(err, dish) {
            if (err) throw err;
            dish.comments.id(req.params.commentId).remove();

            req.body.postedBy = req.decoded._doc._id;

            dish.comments.push(req.body);

            dish.save(function(err, dish) {
                if (err) throw err;
                console.log('Update Comments!');
                console.log(dish);
                res.json(dish);
            });
        });
    })
    .delete(function(req, res, next) {
        Dishes.findById(req.params.dishId, function(err, dish) {

            if (dish.comments.id(req.params.commentId).postedBy !=
                req.decoded._doc._id) {
                var err = new Error("you are not authorised to perfom ths operation");
                err.status = 403;
                return next(err);
            }
            dish.comments.id(req.params.commentId).remove();
            dish.save(function(err, rep) {
                if (err) throw err;
                res.json(rep)
            });
        });
    })
module.exports = dishRouter