// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/View',
  'collections/DocumentCollection',
  'models/document'
], function($, _, Backbone, View, DocumentCollection, Document){
  var Router = Backbone.Router.extend({
	
	initialize: function() {
		Backbone.history.start();
		
		var doc = new Document({title: "The Hobbit", author: "J.R.R Tolken", location: "/usr/bin/kill", id: 9898})
		
		documents = new DocumentCollection();
		documents.cordovaStorage.create(doc);
		documents.cordovaStorage.create(doc);
		//var findAllPromise = documents.cordovaStorage.findAll();
		var findPromise = documents.cordovaStorage.find(doc);
		documents.cordovaStorage.destroy(doc);
		var findAllPromise = documents.cordovaStorage.findAll();

		
		documents.fetch({success: function(){
			console.log(JSON.stringify(documents.models));
		}});
		
		/*
		findAllPromise.done(function(results){
			var len = results.length;
			for(var i = 0;i<len;i++){
				console.log("Row = " + i + " Title = " + results.item(i).title + " Author =  " + results.item(i).author);
			}
		});
		
		findAllPromise.fail(function(err){
			console.log(err);
		});
		*/
	},
    routes: {
      // Define some URL routes
      "": "index"
    },
    
    index: function(){
    	var tempView = new View();
    	$("#main").append(tempView.el);
    }
  });
  
  return Router
});