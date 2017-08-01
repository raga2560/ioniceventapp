angular.module('IonicGulpSeed.firebaseDataService', [])

.constant('ENV',   {
						name: 'development',
						dataProvider: 'FIREBASE', // LOCAL | REMOTE | FIREBASE
						// REMOTE / LOCAL URLS
						// In the case of REMOTE or LOCAL a URI should be set.
						// Examples:
						 apiUrl: 'misc/data.json', // for LOCAL
						// apiUrl: 'http://appseed.io.s3.amazonaws.com/mobile-apps/conference/data.json', // for REMOTE

						firebaseConfig: {
							apiKey: "AIzaSyD1gkNz4pdV9ZWJHezP59OjMm0-TQ2G8pI",
							authDomain: "sociallogindemo-35b63.firebaseapp.com",
							    databaseURL: "https://sociallogindemo-35b63.firebaseio.com",
    							projectId: "sociallogindemo-35b63",
    							storageBucket: "sociallogindemo-35b63.appspot.com",
    							messagingSenderId: "729675561056"
	
						},
						ionicAppId: '2c646baf',
						gcmId: '729675561056' 
					}
					
	
	
	
)
		
.factory('db', ['ENV', function(ENV) {
			firebase.initializeApp(ENV.firebaseConfig);

			var rootRef = firebase.database().ref();
			return rootRef;
}])
.factory('firebaseDataService', function(_, db, $firebaseArray, $firebaseObject) {
		
		var service = {
			getEvents: getEvents,
			getEvent: getEvent,
			updateEvent: updateEvent,
			createEvent: createEvent,
			deleteEvent: deleteEvent,
			init: init
		};
	
		return service;

		// ***********************************************************

		function init() {}
		
		
		function getEvents() {
			var query = db.child('events');
			return $firebaseArray(query).$loaded();
		}
		
		

		function getEvent(eventId) {
			var query = db.child('events/' + eventId);
			return $firebaseObject(query).$loaded();
		}

		function updateEvent(eventId, eventmessage) {

			var dbref = firebase.database().ref('events/' +eventId);
			dbref.update( eventmessage);
			
		}
		
		function createEvent( eventmessage) {
			alert(angular.toJson(eventmessage));
			
			db.child('events').push().set(eventmessage);

			

		}
		function deleteEvent(eventId) {

			var dbref = firebase.database().ref('events/' +eventId);
			dbref.remove( );
			
		}
		
		

	}
);
