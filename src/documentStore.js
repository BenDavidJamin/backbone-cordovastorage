define(['stores/cordovastore'], function (CordovaStore){

  var Documents = CordovaStore;
  
  _.extend(Documents, {
    tableName: "documents",
    records: ['id', 'title', 'author', 'location'],
    // By default this is false
    idUnique: true
    
  });

  return Documents;
});