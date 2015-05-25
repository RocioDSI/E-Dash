'use strict';

// Colisions controller
angular.module('colisions').controller('ColisionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Colisions', 'ngTableParams',
	function($scope, $stateParams, $location, Authentication, Colisions, ngTableParams) {
		$scope.authentication = Authentication;

		var params = {
			page: 1,
			count: 10
		};

		var settings = {
			total: 0,           // length of data
			counts: [10, 15, 20],
	        getData: function($defer, params) {
	            Colisions.get(params.url(), function(response) {
	            	params.total(response.total);
	            	$defer.resolve(response.results);
	            });
	        }
		};

	    $scope.tableParams = new ngTableParams(params, settings);

		// Create new Colision
		$scope.create = function() {
			// Create new Colision object
			var colision = new Colisions ({
				url_video: this.url_video,
				latitud: this.latitud,
				longitud: this.longitud,
				user_name: this.user_name,
				user_id: this.user_id,
				user_email: this.user_email,
			});

			// Redirect after save
			colision.$save(function(response) {
				$location.path('colisions/' + response._id);

				// Clear form fields
				$scope.url_video = '';
				$scope.logitud = '';
				$scope.latitud = '';
				$scope.user_name= '';
				$scope.user_email = '';
				$scope.user_id = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Colision
		$scope.remove = function(colision) {
			if ( colision ) { 
				colision.$remove();

				for (var i in $scope.colisions) {
					if ($scope.colisions [i] === colision) {
						$scope.colisions.splice(i, 1);
					}
				}
			} else {
				$scope.colision.$remove(function() {
					$location.path('colisions');
				});
			}
		};

		// Update existing Colision
		$scope.update = function() {
			var colision = $scope.colision;

			colision.$update(function() {
				$location.path('colisions/' + colision._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Colisions
		$scope.find = function() {
			$scope.colisions = Colisions.query();
		};

		// Find existing Colision
		$scope.findOne = function() {
			$scope.colision = Colisions.get({ 
				colisionId: $stateParams.colisionId
			});
		};
	}
]);