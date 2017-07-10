const ping = require('net-ping');

module.exports = function(RED) {
    function NetPingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
            var targets = msg.payload;
            const options = {
                retries: 1,
                timeout: 2000
            };
            var session = ping.createSession(options);
            session.on('error', (error) => node.error(error));
            for (var i = 0; i < targets.length; i++) {
            	session.pingHost(targets[i], function(error, target) {
            		if (error)
            			if (error instanceof ping.RequestTimedOutError)
            				node.warn(target + ": Not alive");
            			else
            				node.warn(target + ": " + error.toString ());
            		else
            			node.warn(target + ": Alive");
            	});
            }
        });
    }
    RED.nodes.registerType("net-ping-node", NetPingNode);
};
