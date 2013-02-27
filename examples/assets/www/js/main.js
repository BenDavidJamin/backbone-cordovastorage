// Set the require.js configuration for your application.
require.config({
  baseUrl: 'js',
  paths: {
	    jquery: 'libs/jquery/jquery',
	    underscore: 'libs/underscore/underscore',
	    handlebars: 'libs/handlebars/handlebars',
	    backbone: 'libs/backbone/backbone',
	    cordova_storage: "libs/cordovastorage/backbone-cordovastorage",
	    text: 'libs/require/text'
  },

  map: {

    // Put additional maps here.
  },

  shim: {
    
	  'underscore': {
		  exports: '_'
	  },
	  
	  'backbone': {
		  deps: ['underscore', 'text'],
		  exports: 'Backbone'
	  },
	  'cordova_storage': {
		  deps: ['backbone', 'underscore']
	  }
  }

});


require(["jquery", "backbone", "router","cordova_storage"
],
 
 function($, Backbone, Router, Store) {
	return new Router();
 }
);