# Backbone Cordova Storage

The goal of this project is to make access to the local cordova storage a snap using backbone's sync method.

      /**
       * @author Benjamin Metzger
       *
       * CordovaStore is an implementation of Backbone.sync.
       * In it we provide support to insert data into the cordova
       * database methods.
       *
       * This is an example base class for a database. To Utilize it
       * you should extend it.
       *
       * Ex
       *   _.extend(CordovaStore, {
       *     tableName: "Users",
       *     ...
       *   })
       * Using it in this way will allow the user to get all of the
       * inherited values below. So define one CordovaStore per application.
       * Then for each table extend this in order to make sure all of the settings are the same.
       */
      define([], function(){
        var CordovaStore = {
          // Database Name
          name: "Example",
          // Database description
          description: "This is an example discription of our cordovaStore",
          // Database version
          version: "1.0.0",
          //size of the database
          size: 20000,
          // The table name in the database
          tableName:"",
          // the columns in the database table. 
          records: [],
          //In the construction of a table if the id value is unique
          idUnique: false
        };

        return CordovaStore;
      });