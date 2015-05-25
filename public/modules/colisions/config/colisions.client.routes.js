'use strict';

//Setting up route
angular.module('colisions').config(['$stateProvider',
	function($stateProvider) {
		// Colisions state routing
		$stateProvider.
		state('listColisions', {
			url: '/colisions',
			templateUrl: 'modules/colisions/views/list-colisions.client.view.html'
		}).
		state('createColision', {
			url: '/colisions/create',
			templateUrl: 'modules/colisions/views/create-colision.client.view.html'
		}).
		state('viewColision', {
			url: '/colisions/:colisionId',
			templateUrl: 'modules/colisions/views/view-colision.client.view.html'
		}).
		state('editColision', {
			url: '/colisions/:colisionId/edit',
			templateUrl: 'modules/colisions/views/edit-colision.client.view.html'
		});
	}
]);