'use strict';

// Configuring the Articles module
angular.module('colisions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Colisions', 'colisions', 'dropdown', '/colisions(/create)?');
		Menus.addSubMenuItem('topbar', 'colisions', 'List Colisions', 'colisions');
		Menus.addSubMenuItem('topbar', 'colisions', 'New Colision', 'colisions/create');
	}
]);