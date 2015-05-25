'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Colision Schema
 */
var ColisionSchema = new Schema({
	url_video: {
		type: String,
		default: '',
		required: 'Rellene la url del video',
		trim: true
	},
	latitud: {
		type: String,
		default: '',
		required: 'Rellene la latitud',
		trim: true
	},
	userID: {
		type: String,
		default: '',
		required: 'Rellene el nombre de usuario',
		trim: true
	},
	userEmail: {
		type: String,
		default: '',
		required: 'Rellene el email de usuario',
		trim: true
	},
	userName: {
		type: String,
		default: '',
		required: 'Rellene el nombre de usuario',
		trim: true
	},
	longitud: {
		type: String,
		default: '',
		required: 'Rellene la longitud',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Colision', ColisionSchema);