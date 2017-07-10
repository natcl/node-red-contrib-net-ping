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
                    msg.topic = target;
                    if (error) {
                        if (error instanceof ping.RequestTimedOutError) {
                            msg.payload = false;
                            node.send(msg);
                        } else {
                            msg.payload = false;
                            node.send(msg);
                        }
                    } else {
                        msg.payload = true;
                        node.send(msg);
                    }
                });
            }
        });
    }
    RED.nodes.registerType("net-ping-node", NetPingNode);
};
