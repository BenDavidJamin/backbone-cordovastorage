define(["backbone", "underscore", "jquery", "cordova_storage", "stores/documentStore"], 
		function (Backbone, _, $, Store, DocumentStore){
	
	var DocumentCollection = Backbone.Collection.extend({
		
		cordovaStorage: new Store(DocumentStore),
		
		initialize: function(){
			console.log(this.cordovaStorage);
		}
	});
	
	return DocumentCollection;
})