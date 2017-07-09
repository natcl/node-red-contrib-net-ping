const ping = require('net-ping');

module.exports = function(RED) {
  function NetPingNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    this.on('input', function(msg) {
      msg.payload = msg.payload.toLowerCase();
      node.send(msg);
    });
  }
  RED.nodes.registerType("net-ping-node", NetPingNode);
};
