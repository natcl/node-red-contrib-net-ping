const ping = require('net-ping');

module.exports = function(RED) {
    function NetPingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        const options = {
            retries: 1,
            timeout: 2000
        };

        node.session = ping.createSession(options);
        node.session.on('error', (error) => node.error(error));

        node.on('input', function(msg) {
            node.session.pingHost(msg.host, function(error, target, sent, rcvd) {
                const ms = rcvd - sent;
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
                    msg.payload = ms;
                    node.send(msg);
                }
            });
        });
    }
    RED.nodes.registerType("net-ping-node", NetPingNode);
};
