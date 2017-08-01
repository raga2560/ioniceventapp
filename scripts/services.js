angular.module('IonicGulpSeed.services', ['firebase'])

.factory('AuthService', function($rootScope, $firebaseAuth, db) {
	var firebaseAuth = firebase.auth();
		var auth = $firebaseAuth(firebaseAuth);

		
    //var auth = $firebaseAuth();
    var login = function() {
        return auth.$signInWithPopup('google').then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // [START_EXCLUDE]
		 // alert(user);
    
			
			setUser(user.email,user.photoURL );
			$rootScope.$broadcast('loggedIn');
			
          // [END_EXCLUDE]
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // [START_EXCLUDE]
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
          } else {
            console.error(error);
          }
          // [END_EXCLUDE]
        });
    };
    var logout = function() {
		
		setUser(null, null);
         auth.$signOut();
		
		 $rootScope.$broadcast('loggedOut');
		 
		 
		 
    };
    var user = {};
	
	
	
		
    auth.$onAuthStateChanged(function(authData) {
        
		
		
		
		if (authData) {
          // User is signed in.
		  user = authData;
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          setUser(user.email,photoURL );
		  
          //alert(JSON.stringify(user, null, '  '));
          // [END_EXCLUDE]
        } else {
          // User is signed out.
		  setUser(null, null);
		  
          // [START_EXCLUDE]
          
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
        
        // [END_EXCLUDE]
      
	  
	  
    })
	
	function setUser(email , photoURL) {
			if (!email) {
				service.user.email = null;
				service.user.photoURL = '';
				service.user.isSignedIn = false;
			} else {
				service.user.email = email;
				service.user.photoURL = photoURL;
				service.user.isSignedIn = true;
			}
			setStoredUser(service.user);
		}

		function getStoredUser() {
			var user = localStorage.getItem('authUser');
			if (user) {
				user = JSON.parse(user);
			}
			return user || { isSignedIn: false };
		}

		function setStoredUser(user) {
			if (user) {
				user = JSON.stringify(user);
			}
			localStorage.setItem('authUser', user);
		}
	
		var service = {
			user: {
				isSignedIn: false

			},
			 login: login,
             logout: logout,
			
			//signUp: signUp,
			
			getUser: getStoredUser
		};
		
	

    return service;
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
