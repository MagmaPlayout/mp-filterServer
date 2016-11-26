/**
 * Listens to FSCP commands and act's accordingly when one arrives.
 * 
 * Currently supported commands:
 *      SETFILTER {filter html code}
 *      CLEARFILTER
 */

var config = require("./config.js");
var redis = require("redis");
var Log = require("log");

var log = new Log("debug");
var redisClient = redis.createClient(config.redis.port, config.redis.host);
var FILTERSERVER_CHANNEL = config.redis.channel;

function filterServer() {}

// Handle redis connection issues
redisClient.on("error", function(err){
    log.info("Filter Server - Could not connect to the redis sever. " + err);
});


/**
 * Launches the filter server.
 * @param {type} io
 */
filterServer.prototype.init = function (io) {
    redisClient.subscribe(FILTERSERVER_CHANNEL);

    redisClient.on("message", function (channel, message) {
        if (channel === FILTERSERVER_CHANNEL) {
            var filterHtmlCode = -1;

            // Check for supported commands
            if (message.indexOf("SETFILTER") !== -1) {
                var opcode = message.indexOf(" ");
                var htmlCode = message.substring(opcode,message.length);
                
                if(htmlCode.length !== 0){
                    filterHtmlCode = htmlCode;
                }
                
                log.info("SETFILTER message received. HtmlCode = " + htmlCode);
            }
            else if (message.indexOf("CLEARFILTER") !== -1) {
                log.info("CLEARFILTER message received");
                filterHtmlCode = "";
            }
            else {
                log.err("Unsupported FSCP command. " + message);
            }
            
            // Sends the filter htmlCode to the webvfx_filter.html if any
            if(filterHtmlCode !== -1){
                io.sockets.emit('filterChanged', filterHtmlCode);
            }
        }
    });
};

module.exports = new filterServer();
