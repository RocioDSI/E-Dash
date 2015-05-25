'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Colision = mongoose.model('Colision'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, colision;

/**
 * Colision routes tests
 */
describe('Colision CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Colision
		user.save(function() {
			colision = {
				name: 'Colision Name'
			};

			done();
		});
	});

	it('should be able to save Colision instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Colision
				agent.post('/colisions')
					.send(colision)
					.expect(200)
					.end(function(colisionSaveErr, colisionSaveRes) {
						// Handle Colision save error
						if (colisionSaveErr) done(colisionSaveErr);

						// Get a list of Colisions
						agent.get('/colisions')
							.end(function(colisionsGetErr, colisionsGetRes) {
								// Handle Colision save error
								if (colisionsGetErr) done(colisionsGetErr);

								// Get Colisions list
								var colisions = colisionsGetRes.body;

								// Set assertions
								(colisions[0].user._id).should.equal(userId);
								(colisions[0].name).should.match('Colision Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Colision instance if not logged in', function(done) {
		agent.post('/colisions')
			.send(colision)
			.expect(401)
			.end(function(colisionSaveErr, colisionSaveRes) {
				// Call the assertion callback
				done(colisionSaveErr);
			});
	});

	it('should not be able to save Colision instance if no name is provided', function(done) {
		// Invalidate name field
		colision.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Colision
				agent.post('/colisions')
					.send(colision)
					.expect(400)
					.end(function(colisionSaveErr, colisionSaveRes) {
						// Set message assertion
						(colisionSaveRes.body.message).should.match('Please fill Colision name');
						
						// Handle Colision save error
						done(colisionSaveErr);
					});
			});
	});

	it('should be able to update Colision instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Colision
				agent.post('/colisions')
					.send(colision)
					.expect(200)
					.end(function(colisionSaveErr, colisionSaveRes) {
						// Handle Colision save error
						if (colisionSaveErr) done(colisionSaveErr);

						// Update Colision name
						colision.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Colision
						agent.put('/colisions/' + colisionSaveRes.body._id)
							.send(colision)
							.expect(200)
							.end(function(colisionUpdateErr, colisionUpdateRes) {
								// Handle Colision update error
								if (colisionUpdateErr) done(colisionUpdateErr);

								// Set assertions
								(colisionUpdateRes.body._id).should.equal(colisionSaveRes.body._id);
								(colisionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Colisions if not signed in', function(done) {
		// Create new Colision model instance
		var colisionObj = new Colision(colision);

		// Save the Colision
		colisionObj.save(function() {
			// Request Colisions
			request(app).get('/colisions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Colision if not signed in', function(done) {
		// Create new Colision model instance
		var colisionObj = new Colision(colision);

		// Save the Colision
		colisionObj.save(function() {
			request(app).get('/colisions/' + colisionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', colision.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Colision instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Colision
				agent.post('/colisions')
					.send(colision)
					.expect(200)
					.end(function(colisionSaveErr, colisionSaveRes) {
						// Handle Colision save error
						if (colisionSaveErr) done(colisionSaveErr);

						// Delete existing Colision
						agent.delete('/colisions/' + colisionSaveRes.body._id)
							.send(colision)
							.expect(200)
							.end(function(colisionDeleteErr, colisionDeleteRes) {
								// Handle Colision error error
								if (colisionDeleteErr) done(colisionDeleteErr);

								// Set assertions
								(colisionDeleteRes.body._id).should.equal(colisionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Colision instance if not signed in', function(done) {
		// Set Colision user 
		colision.user = user;

		// Create new Colision model instance
		var colisionObj = new Colision(colision);

		// Save the Colision
		colisionObj.save(function() {
			// Try deleting Colision
			request(app).delete('/colisions/' + colisionObj._id)
			.expect(401)
			.end(function(colisionDeleteErr, colisionDeleteRes) {
				// Set message assertion
				(colisionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Colision error error
				done(colisionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Colision.remove().exec();
		done();
	});
});