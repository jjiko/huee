var validate = require('./validate.js');
var session = require('./session.js');
module.exports = {
    attempt: 0,
    get: function () {
        var self = this;
        if (self.session.username && self.session.username !== "null") {
            return self.auth.check.apply(self);
        }

        self.request.auth.apply(self);

        return self.auth.check.apply(self);
    },
    check: function () {
        var self = this;

        if (self.debug || validate.notNull(self.session.username)) {
            return true;
        }

        if (validate.isNull(self.session.bridgeIp)) {
            var bridges = self.request.bridge.apply(self);
            session.remember.apply(self);
        }

        if(self.session.remote) {
            self.display.log("No bridge detected on local network. Attempting remote controls.");
            return true;
        }

        if (self.auth.attempt > self.config.authCheckTimeout) {
            console.log(self.events);
            var $failbtn = $('<button class="btn btn-primary">Click here to try again</button>')
                .on('click', function (evt) {
                    self.auth.attempt = 0;
                    self.auth.check.apply(self);
                });
            var $fail = $('<div />').append('Authorization failed. ').append($failbtn).append(' or refresh the page')
            self.display.log($fail);
            return false;
        }

        self.display.log("Waiting for link button to be pressed.. " + (self.config.authCheckTimeout - self.auth.attempt));
        setTimeout(function () {
            self.auth.attempt++;
            self.auth.get.apply(self);
        }, 1000);
    }
}