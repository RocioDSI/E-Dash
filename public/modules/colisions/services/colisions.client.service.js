'use strict';

//Colisions service used to communicate Colisions REST endpoints
angular.module('colisions').factory('Colisions', ['$resource',
	function($resource) {
		return $resource('colisions/:colisionId', { colisionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);