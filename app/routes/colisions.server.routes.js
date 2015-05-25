'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var colisions = require('../../app/controllers/colisions.server.controller');

	// Colisions Routes
	app.route('/colisions')
		.get(colisions.list)
		.post(colisions.create);

	app.route('/colisions/:colisionId')
		.get(colisions.read)
		.put(users.requiresLogin, colisions.hasAuthorization, colisions.update)
		.delete(users.requiresLogin, colisions.hasAuthorization, colisions.delete);

	// Finish by binding the Colision middleware
	app.param('colisionId', colisions.colisionByID);
};
