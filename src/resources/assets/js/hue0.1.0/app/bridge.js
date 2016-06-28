var $ = require('jquery');
var session = require('./session.js');
var validate = require('./validate.js');
module.exports = {
    detect: function () {
        var self = this;
        self.display.log("Detecting hue bridge");

        if (self.session.bridgeIp) {
            return self.session.bridgeIp;
        }

        var bridges = self.request.bridge.apply(self);
        session.remember.apply(self);

        return self.session.bridgeIp;
    }
}