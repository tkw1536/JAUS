var handler = function(router, interface, routes, handlers){
  
  var handleErrors = function(func, errHandler){
    var postArgs = Array.prototype.slice.call(arguments, 2); 
    
    return function(){
      try {
        func.apply(this, arguments); 
      } catch(e){
        postArgs.unshift(null);
        postArgs.unshift(e);  
        errHandler.apply(this, postArgs); 
      }
    }
  }
  
  // all the db interfaces
  var interfaceGet = interface.get; // .get(params, cb)
  var interfaceCreate = interface.create; // .create(data, req, res, cb)
  var interfaceEdit = interface.edit; // .edit(data, req, res, cb)
  var interfaceDelete = interface.delete; // .delete(data, req, res, cb)
  var interfaceCanCreate = interface.canCreate; // .canCreate(req, res, cb)
  var interfaceCanTouch = interface.canTouch; // .canTouch(data, req, res, cb)
  
  var interfaceFilter = interface.filter; // .filter(req, res)
  var interfaceDeserialiseCreate = interface.deserialiseCreate; // .deserialiseCreate(req, res, cb)
  var interfaceDeserialiseDelete = interface.deserialiseDelete; // .deserialiseDelete(req, res, cb)
  var interfaceDeserialiseEdit = interface.deserialiseEdit; // .deserialiseEdit(req, res, cb)
  
  // all the routes
  var listRoute = routes.list;
  var createRoute = routes.add;
  var deleteRoute = routes.delete; 
  var editRoute = routes.edit; 
  var routePrefix = routes.prefix; 
  
  // all the error handlers
  var listHandler = handlers.list; // .list(error, results, req, res)
  var afterCreateHandler = handlers.afterCreate //.afterCreate(error, obj, req, res)
  var afterEditHandler = handlers.afterEdit //.afterEdit(error, obj, req, res)
  var afterDeleteHandler = handlers.afterDelete //.afterDelete(error, obj, req, res)
  
  
  
  // LIST EVERYTHING
  router.get(listRoute, routePrefix, function(req, res){
    
    // handlers
    var $funFilter = handleErrors(interfaceFilter, listHandler, req, res); 
    var $funGet = handleErrors(interfaceGet, listHandler, req, res);
    
    // make a filter for searching. 
    var filter = $funFilter(req, res);
    
    // and then find that
    $funGet(filter, function(err, results){
      listHandler(err, results, req, res); 
    }); 
  }); 
  
  // CREATE SOMETHING
  router.post(createRoute, routePrefix, function(req, res){
    // handlers
    var $funCanCreate = handleErrors(interfaceCanCreate, afterCreateHandler, req, res); 
    var $funDeser = handleErrors(interfaceDeserialiseCreate, afterCreateHandler, req, res); 
    var $funCreate = handleErrors(interfaceCreate, afterCreateHandler, req, res); 
    
    // check if user is allowed to create something. 
    $funCanCreate(req, res, function(err, canCreate){
      
      // in case of error or if we can not, we exit. 
      if(err || !canCreate){
        return afterCreateHandler(err || new Error("Insufficient permissions to create new. "), null, req, res); 
      }
      
      // we need to deserialise now
      $funDeser(req, res, function(err, obj){
        
        // in case of error, we exit
        if(err){
          return afterCreateHandler(err, null, req, res); 
        }
        
        // finally we need to create it. 
        $funCreate(obj, req, res, function(err, cObj){
          afterCreateHandler(err, cObj, req, res); 
        });
      }); 
    }); 
  });
  
  // DELETE SOMETHING
  router.post(deleteRoute, routePrefix, function(req, res){
    
    // handlers
    var $funDeser = handleErrors(interfaceDeserialiseDelete, afterDeleteHandler, req, res); 
    var $funCanTouch = handleErrors(interfaceCanTouch, afterDeleteHandler, req, res); 
    var $funDelete = handleErrors(interfaceDelete, afterDeleteHandler, req, res); 
    
    // first we need to deserialise
    $funDeser(req, res, function(err, obj){
      
      // in case of an error, we exit. 
      if(err){
        return afterDeleteHandler(err, null, req, res); 
      }
      
      // we now check if the user is allowed to delete it
      $funCanTouch(obj, req, res, function(err, canTouch){
        
        // if not, exit
        if(err || !canTouch){
          return afterDeleteHandler(err || new Error("Insufficient permissions to delete. "), null, req, res); 
        }
        
        // finally delete it.  
        $funDelete(obj, req, res, function(err, dObj){
          afterDeleteHandler(err, dObj, req, res); 
        }); 
      })
    }); 
  }); 
  
  // EDIT SOMETHING
  router.post(editRoute, routePrefix, function(req, res){
    
    // handlers
    var $funDeser = handleErrors(interfaceDeserialiseEdit, afterEditHandler, req, res); 
    var $funCanTouch = handleErrors(interfaceCanTouch, afterEditHandler, req, res); 
    var $funEdit = handleErrors(interfaceEdit, afterEditHandler, req, res); 
    
    // first we need to deserialise
    $funDeser(req, res, function(err, obj){
      
      // if that fails we again exit. 
      if(err){
        return afterEditHandler(err, null, req, res); 
      }
      
      // else we need to check if we are allowed to edit it. 
      $funCanTouch(obj, req, res, function(err, canTouch){
        
        // if not, we exit
        if(err || !canTouch){
          return afterEditHandler(err || new Error("Insufficient permissions to edit. "), null, req, res); 
        }
        
        // finally actually do the editing. 
        $funEdit(obj, req, res, function(err, eObj){
          afterEditHandler(err, eObj, req, res); 
        }); 
      })
    }); 
  }); 
  
}; 

var mongooseHandler = function(Schema, router, interfaces, routes, handlers) {  
  
  // all the handlers
  var deSerialiseUpdate = interfaces.deserialiseUpdate; //.deserialiseUpdate(req, res, cb)
  var doEdit = interfaces.doEdit;  //.doEdit(doc, req, res) => SCHEMA
  var canCreate = interfaces.canCreate;  // .canCreate(req, res, cb)
  var canTouch = interfaces.canTouch; // .canTouch(data, req, res, cb)
  var filter = interfaces.filter; //.filter(req, res)
  var deserialiseCreate = interfaces.deserialiseCreate; // .deserialiseCreate(req, res, cb) => SCHEMAJSON
  
  var mongoInterfaces = {
    "get": function(params, cb){
      Schema.find(params, cb); 
    }, 
    "create": function(params, req, res, cb){
      Schema.create(params, cb); 
    }, 
    "edit": function(params, req, res, cb){ 
      params.save(cb); 
    }, 
    "delete": function(params, req, res, cb){
      params.remove(function(err){
        cb.apply(this, arguments); 
      }); 
    }, 
    "deserialiseDelete": function(req, res, cb){
      deSerialiseUpdate(req, res, function(err, filter){
        if(err){
          cb(err, null); 
        } else {
          Schema.findOne(filter, cb); 
        }
      }); 
    }, 
    "deserialiseEdit": function(req, res, cb){
      deSerialiseUpdate(req, res, function(err, filter){
        if(err){
          cb(err, null); 
        } else {
          Schema.findOne(filter, function(err, doc){
            if(err){
              cb(err, null); 
            } else {
              cb(err, doEdit(doc, req, res)); 
            }
          }); 
        }
      }); 
    }, 
    
    // all the existing things. 
    "canCreate": canCreate, 
    "canTouch": canTouch,
    "filter": filter,
    "deserialiseCreate": deserialiseCreate
  }
  
  // and make it a handler
  return handler(router, mongoInterfaces, routes, handlers); 
}

module.exports = {
  "handler": handler, 
  "mongooseHandler": mongooseHandler
}; 