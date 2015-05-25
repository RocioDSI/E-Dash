'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Colision = mongoose.model('Colision'),
	_ = require('lodash');

/**
 * Create a Colision
 */
exports.create = function(req, res) {
	var colision = new Colision(req.body);
	//colision.user = req.user;

	colision.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(colision);
		}
	});
};

/**
 * Show the current Colision
 */
exports.read = function(req, res) {
	res.jsonp(req.colision);
};

/**
 * Update a Colision
 */
exports.update = function(req, res) {
	var colision = req.colision ;

	colision = _.extend(colision , req.body);

	colision.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(colision);
		}
	});
};

/**
 * Delete an Colision
 */
exports.delete = function(req, res) {
	var colision = req.colision ;

	colision.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(colision);
		}
	});
};

/**
 * List of Colisions
 */
exports.list = function(req, res) { 

	var count = req.query.count || 5;
	var page = req.query.page || 1;
	var sort;
	var sortObject = {};
	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page -1) * count,
		count: count
	};
	if(req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = [req.query.sorting[sortKey]];

		sortObject[sortValue] = sortKey;
	}
	else {
		sortObject['desc'] = '_id';
	}
	var sort = {
		sort: sortObject
	};

	Colision
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, colisions) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} 
			else {
				res.jsonp(colisions);
			}
		});
};

/**
 * Colision middleware
 */
exports.colisionByID = function(req, res, next, id) { 
	Colision.findById(id).populate('user', 'displayName').exec(function(err, colision) {
		if (err) return next(err);
		if (! colision) return next(new Error('Failed to load Colision ' + id));
		req.colision = colision ;
		next();
	});
};

/**
 * Colision authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.colision.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
