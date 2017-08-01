angular.module('IonicGulpSeed.events', [])

.controller('EventDetailsController', function(eventsService,$scope, $state, $filter, $stateParams, ionicToast) {
		var eventId = $stateParams.id
		var editeventId = $stateParams.id
		var vm = angular.extend(this, {
			event: null,
			enteredevent: {
				title:'',
				description:'',
				startDate:'',
				endDate:'',
				sponsor:'',
				image:'https://images.pexels.com/photos/34950/pexels-photo.jpg',
				facebook:'',
				webpage:'',
				phoneNumber:''
			},
			origin: {
				lat: null,
				lon: null
			},
			zoom: null,
			markers: null,
			editeventId: editeventId,
			
			createNewEvent: createNewEvent,
			deleteEvent: deleteEvent,
			goToEditEventDetails: goToEditEventDetails,
			saveEditEventDetails: saveEditEventDetails,
		
			toggleFavorites: toggleFavorites
		});

		// ********************************************************************

		(function activate() {
		//	getEvent();
		})();

		$scope.$on('$ionicView.enter', function() {
			eventsService.init();
				getEvent();
		});
		

		function goToEditEventDetails(id) {
			 //vm.enteredevent = vm.event;
			$state.go('tab.editevent-details', {
				id: id
			});
		}
		
		function deleteEvent(id) {
			eventsService.deleteEvent(id);
			$state.go('tab.events');
		}
		
		
		
		function saveEditEventDetails(id) {
						
			vm.enteredevent.startDate = $filter('date')(vm.enteredevent.startDate, 'fullDate'); 
			vm.enteredevent.endDate =  $filter('date')(vm.enteredevent.endDate, 'fullDate') ; 
			eventsService.updateEvent(vm.event.$id, vm.enteredevent);
			
			$state.go('tab.event-details', {
				id: id
			});
		}
		
		function createNewEvent (){
			vm.enteredevent.startDate = $filter('date')(vm.enteredevent.startDate, 'fullDate'); // vm.enteredevent.startDate.binding("1288323623006 | date:'medium'")).getText();//.toJSON(); 
			vm.enteredevent.endDate =  $filter('date')(vm.enteredevent.endDate, 'fullDate') ; // vm.enteredevent.endDate.toLocaleDateString(); //.toJSON() ; //Date.UTC(vm.enteredevent.endDate);
			eventsService.createEvent(vm.enteredevent);
			$state.go('tab.events');
		};
		
		
		
		function getEvent() {
			return eventsService.getEvent(eventId).then(function(event) {
				vm.event = event;
				vm.event.isInFavorites = eventsService.isInFavorites(vm.event.$id);
				//vm.enteredevent.title = vm.event.title;
				//vm.enteredevent.description = vm.event.description;
				
				vm.editeventId = vm.event.$id;
				
			})
		};

		function toggleFavorites() {
			vm.event.isInFavorites = !vm.event.isInFavorites;
			if (vm.event.isInFavorites) {
				eventsService.toggleFavorites(vm.event.$id, true);
				ionicToast.show('\'' + vm.event.title + '\' has been added to your Favorites', 'bottom', false, 2000);
			} else {
				eventsService.toggleFavorites(vm.event.$id, false);
				ionicToast.show('\'' + vm.event.title + '\' has been removed from your Favorites', 'bottom', false, 2000);
			}
		}

	}
)
.factory('eventsService', function(dataService, $q, _, localStorageService) {
		var events = null;
		var service = {
			init: init,
			fetchEvents: fetchEvents,
			getEvent: getEvent,
			updateEvent: updateEvent,
			createEvent: createEvent,
			deleteEvent: deleteEvent,
			toggleFavorites: toggleFavorites,
			isInFavorites: isInFavorites
		};
		return service;


		
		function init() {
			
	
		}
		
		function getEvent(eventId) {
			return dataService.getEvent(eventId);
		}

		
		function deleteEvent(eventId) {
			return dataService.deleteEvent(eventId);
		}

		
		function updateEvent(eventId, msg) {
	
			return dataService.updateEvent(eventId, msg);
		}
		function createEvent( msg) {
	
			return dataService.createEvent( msg);
		}
		
		
		function getEvents() {
			if (!events) {
				return dataService.getEvents().then(function(items) {
					events = items;

					var favorites = localStorageService.get('favoritesEvents') || [];
					_.each(items, function(item) {
						if (favorites.indexOf(item.$id) >= 0) {
							item.isInFavorites = true;
						}
					});
					return items;
				});
			}
			return $q.when(events);
		}

		function fetchEvents(filter, showFavorites) {
			filter = filter ? filter.toLowerCase() : filter;
			return getEvents().then(function(events) {
				var filteredEvents = _.filter(events, function(event) {
					return (!filter || event.title.toLowerCase().indexOf(filter) >= 0)
						&& (!showFavorites || event.isInFavorites);
				});

				return $q.when(filteredEvents);
			});
		}

		function toggleFavorites(eventId, toggle) {
			_.each(events, function(event) {
				if (event.$id === eventId) {
					event.isInFavorites = toggle;

					var favorites = localStorageService.get('favoritesEvents') || [];
					if (toggle) {
						favorites.push(event.$id);
						favorites = _.uniq(favorites);
					} else {
						favorites = _.filter(favorites, function(item) {
							return item != event.$id;
						});
					}
					localStorageService.set('favoritesEvents', favorites);
				}
			});
		};

		function isInFavorites(id) {
			var favorites = localStorageService.get('favoritesEvents');
			return _.indexOf(favorites, id) >= 0;
		}
	}
)
	.controller('EventsController', function($state, eventsService, $ionicListDelegate, $scope) {
		var vm = angular.extend(this, {
			events: [],
			filter: null,
			favorites: false,
			goToEventDetails: goToEventDetails,
			goToEditEventDetails: goToEditEventDetails,
			goToNewEventDetails: goToNewEventDetails,
			showFavorites: showFavorites,
			showAll: showAll,
			filterChanged: filterChanged,
			addFavorites: addFavorites,
			init: init,
			removeFavorites: removeFavorites
		});

		//*********************************************

		(function activate() {
			// fetchEvents();
		})();
		
		
		$scope.$on('$ionicView.enter', function() {
			eventsService.init();
			fetchEvents();
		});
		
		function init()
		{
			eventsService.init();
			
		}
		
		function goToNewEventDetails() {
			 
			$state.go('tab.newevent-details');
		}

		function fetchEvents() {
			eventsService.fetchEvents(vm.filter, vm.favorites).then(function(items) {
				vm.events = items;
			})
		}

		function goToEventDetails(id) {
			$state.go('tab.event-details', {
				id: id
			});
		}
		function goToEditEventDetails(id) {
			$state.go('tab.editevent-details', {
				id: id
			});
		}

		function filterChanged() {
			fetchEvents();
		}

		function addFavorites(event, eventId) {
			event.stopPropagation();
			eventsService.toggleFavorites(eventId, true);
			$ionicListDelegate.closeOptionButtons();
		}

		function removeFavorites(eventId) {
			eventsService.toggleFavorites(eventId, false);
			showFavorites();
		}

		function showFavorites() {
			vm.favorites = true;
			fetchEvents();
		}

		function showAll() {
			vm.favorites = false;
			fetchEvents();
		}
	}
);
