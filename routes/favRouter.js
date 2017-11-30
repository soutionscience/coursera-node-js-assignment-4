var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var Favourites = require('../models/favourite');
var verify = require('./verify')


var favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());


favouriteRouter.route('/')
    .all(verify.verifyOrdinaryUser)
    .get(function(req, res, next) {


        Favourites.find({})
            .populate('postedBy')
            .populate('dishes')

            .exec(function(err, dish) {
                if (err) throw err;
                console.log("get")
                res.json(dish);
            });

        // .populate('comments.postedBy')
        //          .exec(function(err, fav) {
        //              if (err) throw err;
        //              res.json(fav);
        //          });
        //   next();
        // console.log('hitting')

        // res.send(200)

    })
    .post(function(req, res, next) {
        var id = req.decoded._doc._id
        console.log("decoded" + id)
        Favourites.findOne({ postedBy: id }, function(err, fav) {
            if (err) throw err;
            if (!fav) {
                console.log("no fav")
                req.body.postedBy = id;
                var newFav = new Favourites({ dishes: req.body._id, postedBy: id });
                newFav.save(function(err, newFav) {
                    if (err) throw err
                    res.json(newFav)
                })
            } else {
                fav.dishes.push(req.body._id)
                fav.save(function(err, newFav) {
                    if (err) {
                        throw err;
                        // next(new Error("Favourite already added"))
                        // next();

                    }
                    res.json(newFav)
                })
            }


        })


    })



    .delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
        Favourites.remove({}, function(err, fav) {
            if (err) throw err;
            res.send("all dished deleted")
        })
    })

favouriteRouter.route('/:favId')

    .delete(verify.verifyOrdinaryUser, function(req, res, next) {
var id = req.decoded._doc._id
Favourites.findOneAndUpdate({postedBy: id}, {$pull:{dishes: req.params.favId}}, function(err, data){
    if(err){
        return res.status(500).json({'Error': "error in deleting favourite"})
    }
    res.json(data)
})


 })


module.exports = favouriteRouter