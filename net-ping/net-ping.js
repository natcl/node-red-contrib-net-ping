const ping = require('net-ping');

module.exports = function(RED) {
    function NetPingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.host = config.host || null;
        node.timeout = parseInt(config.timeout);
        node.retries = parseInt(config.retries);

        const options = {
            retries: node.retries,
            timeout: node.timeout * 1000
        };

        node.session = ping.createSession(options);
        node.session.on('error', (error) => node.error(error));

        node.on('input', function(msg) {
            var host;
            if (msg.hasOwnProperty('host') && node.host === null) {
                host = msg.host;
            } else {
                host = node.host;
            }
            node.session.pingHost(host, function(error, target, sent, rcvd) {
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
