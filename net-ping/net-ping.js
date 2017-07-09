const ping = require('net-ping');

module.exports = function(RED) {
    function NetPingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
            const options = {
                retries: 1,
                timeout: 2000
            };
            const session = ping.createSession(options);
            session.on('error', (error) => node.error(error));
            session.pingHost(msg.payload, (error, target) => {
                if (error) {
                    node.warn(error);
                } else {
                    node.warn(`Success ${target}`);
                }
            });
            //msg.payload = msg.payload.toLowerCase();
            //node.send(msg);
        });
    }
    RED.nodes.registerType("net-ping-node", NetPingNode);
};
