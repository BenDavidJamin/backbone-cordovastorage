/**
 * Backbone CordovaStorage Adapter
 *
 * @author  Benjamin Metzger
 */


define(['underscore', 'backbone'], function (_, Backbone) {

  /**
   * [S4 description]
   * @method S4
   */
  function S4() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };

  /**
   * [guid description]
   * @method guid
   * @return {[type]} [description]
   */
  function guid() {
     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };

  /**
   * [Store description]
   * @method Store
   * @param  {[type]} cordovaStore [description]
   */
  Backbone.CordovaStorage = window.Store = function(cordovaStore){
	  
	_.bindAll(this, "_tableCheck", "_insertData", "_updateData", "_destroyData", "_findData");
    this.cordovaStore = cordovaStore;
    this.store = window.openDatabase(this.cordovaStore.name, this.cordovaStore.version,
                          this.cordovaStore.description, this.cordovaStore.size);

    this.store.transaction(this._tableCheck,
    		this.errorCB,
    		this.successCB);
  };

  _.extend(Backbone.CordovaStorage.prototype, {

    /**
     * [save description]
     * @method save
     * @return {[type]} [description]
     */
    save: function(model){
      var that = this;
      this.store.transaction(
		  function(tx){
		    that._insertData(tx, model)
		  },
		  this.errorCB,
		  this.successCB
		);
    },

    /**
     * [create description]
     * @method create
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    create: function(model){
      if(!model.id){
        model.id = guid();
        model.set(model.idAttribute, model.id);
      }
      //at the moment save doesn't do anything
      this.save(model);
    },

    /**
     * [update description]
     * @method update
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    update: function(model){
      var that = this;
      this.store.transaction(
	    function(tx){
		  that._updateData(tx, model);
	    },
	    this.errorCB,
	    this.successCB
	  );
    },

    /**
     * [find description]
     * @method find
     * @param  {[type]} model [description]
     * @return {Promise}       [The promise of a value from the find function]
     */
    find: function(model){
      var deferred = new $.Deferred();
      var that = this;
      this.store.transaction(
        function(tx){
          that._findData(tx, "id='"+model.get("id")+"'", deferred);
        },
        function(err){
          that.errorCB(err, deferred);
        },
        this.successCB
      );

      return deferred.promise();
    },

    /**
     * [returns all of the rows in the database pertaining to the 
     * table]
     * @method findAll
     * @return {Promise} Returns the promise of a value or an error message.
     */
    findAll: function() {
      var deferred = new $.Deferred();
      var that = this;
      this.store.transaction(
    	function(tx){
    		that._findData(tx, undefined, deferred);
    	},
        function(err){
    	  that.errorCB(err, deferred);
    	},
        function(){
    	  that.successCB();
    	}
      );

      return deferred.promise();
    },

    /**
     * [Removes the model object from the database if it is there.]
     * @method destroy
     * @param  {Object} model [The model Object to be removed from the database]
     * @return {Object}       [The model Object that was removed from the database]
     */
    destroy: function(model){
      var that = this;
      this.store.transaction(
        function(tx){
          that._destroyData(tx,"id='"+model.get("id")+"'");
        },
        this.errorCB,
        this.successCB
      );
      return model;
    },
    /**
     * [Prints out the sql error to the console.log
     * TODO should make this for debug only]
     * @method errorCB
     * @param  {SQLError} err [The error object returned from the failed sql transaction]
     * @param {Deferred} deferred [The deferred object that contains the rejectWith value]
     */
    errorCB: function(err, deferred){
      // If there is a deferred passed in reject with
      // the error message.
      if(typeof deferred !== "undefined"){
    	  deferred.rejectWith(this, [err]);
      }
      console.log(err.code, err.message);
    },

    successCB: function (deferred){
      if(typeof deferred !== "undefined"){
    	  deferred.resolve();
      }
      console.log("success!");
    },

    _tableCheck: function (tx){
    	
      var that = this;
    	
      //Make sure the id is unique if initiated so in the config
      var tableRecords = _.map(that.cordovaStore.records, function(record){
    	  if(record == "id" && that.cordovaStore.idUnique){
    		  return "id unique";
    	  }else{
    		  return record;
    	  }
      });
      //tx.executeSql('DROP TABLE IF EXISTS '+that.cordovaStore.tableName);
      tx.executeSql('CREATE TABLE IF NOT EXISTS '+that.cordovaStore.tableName+' ('+ tableRecords.join(",")+')');
    },

    _insertData: function (tx, model){
      //Need to preserve the order in which the records are seen.
      var values = [];
      var i;
      
      for(i = 0; i<this.cordovaStore.records.length; i++){
        values.push("'"+model.get(this.cordovaStore.records[i])+"'");
      }
      tx.executeSql('INSERT INTO '+
        this.cordovaStore.tableName+
        ' ( '+this.cordovaStore.records.join(",")+
        ' ) VALUES ( '+values.join(",")+' )');
    },

    _updateData: function (tx, model){
      var values = [];
      var i;
      //Create the strings to be updated in the db
      for(i = 0; i<this.cordovaStore.records.length; i++){
        values.push(this.cordovaStore.records[i]+"='"+
          model.get(this.cordovaStore.records[i])+"'");
      }

      tx.executeSql('UPDATE '+
        this.cordovaStore.tableName+
        ' SET '+this.cordovaStore.records.join(",")+
        ' WHERE id='+model.get("id")+"'");
    },

    _destroyData: function (tx, query){
      tx.executeSql("DELETE FROM "+this.cordovaStore.tableName+" WHERE "+query);
    },

    _findData: function(tx, query, deferred){
      var that = this;
      var queryString = "";
      if(typeof query !== "undefined"){
    	  queryString = " WHERE "+query;
      }
      tx.executeSql('SELECT * FROM '+this.cordovaStore.tableName +" "+queryString, [], 
    		  function(tx, results){
    	  		//not a huge fan of SQLResultSetRowList
    	  		var resultsList = [];
    	  		for(var i = 0;i< results.rows.length;i++){
    	  			resultsList.push(results.rows.item(i));
    	  		}
    	  		deferred.resolveWith(this,[resultsList]);
      		  },
      		  function(err){
      			that.errorCB(err,deferred);  
      		  }
      	      
      ); 
    }
  });

Backbone.CordovaStorage.sync = window.Store.sync = Backbone.cordovaSync = function(method, model, options, error){
  var store = model.cordovaStorage || model.collection.cordovaStorage;

  if(typeof options == 'function'){
    options = {
      success: options,
      error: error
    };
  }

  var resp;

  switch(method) {
    case "read":   resp = model.id !== undefined ? store.find(model) : store.findAll(); break;
    case "create": resp = store.create(model);                                       break;
    case "update": resp = store.update(model);                                       break;
    case "delete": resp = store.destroy(model);                                      break;
  }
  
  resp.done(function(results){
	options.success(model, results, options);
  });
  resp.fail(function(err){
	options.error(model, err, options);
  });
};

Backbone.ajaxSync = Backbone.sync;

Backbone.getSyncMethod = function(model){
  if(model.cordovaStorage || (model.collection && model.collection.cordovaStorage)){
    return Backbone.cordovaSync;
  }

  return Backbone.ajaxSync;
};

Backbone.sync = function(method, model, options, error){
  return Backbone.getSyncMethod(model).apply(this, [method, model, options, error]);
};

return Backbone.CordovaStorage;

});