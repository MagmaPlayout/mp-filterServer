var redis = require("redis")
, filter = require("./filter.js")
, Log = require ("log")
, log = new Log("debug")
, redisClient = redis.createClient()
;

function filterServer(){
  log.info("filterServer - new instance created");
}

/**
 * Initializes filter server.
 * @param {object} socket
 */
filterServer.prototype.init = function(io){
  redisClient.subscribe("FSCP");

  redisClient.on("message",function(channel, message){
    if(channel=="FSCP"){
      // Adds html content to "filter-banner"
      if(message.includes("SETFILTER")){
        var idFilter = message.split(" ")[1];
        log.info("SETFILTER message received. IdFilter= " + idFilter );

        filter.get(idFilter,function(error,reply){
          if(!error) {
              io.sockets.emit('filterChanged',reply.htmlCode);
          }
          else{
            log.info("Could not get the filter");
          }
        });
      };

      //Clear filter
      if(message.includes("CLEARFILTER")){
          log.info("CLEARFILTER message received");
          io.sockets.emit('filterChanged',"");
      }
    }

  });
};

module.exports = new filterServer();
