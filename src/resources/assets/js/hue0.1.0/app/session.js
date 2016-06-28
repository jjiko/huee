var bridge = require('./bridge.js');
var validate = require('./validate.js');
// @note not using cookies anymore
var readCookie = function (key) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}

module.exports = {
    init: function (self) {
        var session = this;

        self.display.log("Checking for previous authorization in session");
        self.session = session.recall.apply(self);

        // console.log("self.session", self.session);
        if (self.session.username && self.session.bridgeIp) {
            self.events.trigger('user:auth_success');
            self.events.trigger('app:lights');
            return self;
        }

        if (self.session.googleId) {
            self.events.trigger('user:auth');
            return self;
        }

        // exception for google onhub firewall retardedness
        if (window.location.href.indexOf("192.168.86.100/hue") > -1) {
            self.display.log("Using local rules");
            self.session = {
                googleId: dummy.googleId,
                username: dummy.username,
                bridgeIp: dummy.bridgeIp
            }
            self.events.trigger('app:lights');
            return self;
        }

        self.display.log('no previous session detected.<br>Initializing google sign in');
        $.getScript('https://apis.google.com/js/platform.js', function () {
            self.events.trigger('app:ready');
            if(self.config.debug) { console.log('google platform ready'); }
            self.log.display('Sign in to continue..');
            self.log.done();
            $("#app").attr('data-google-ready', true);
        });
    },
    recall: function (key) {
        var stored = {
            hue: {},
            lights: []
        };

        if (localStorage.hasOwnProperty('hueUser')) {
            stored.hue = JSON.parse(localStorage.getItem('hueUser'));
        }

        if (localStorage.hasOwnProperty('hueLights')) {
            stored.lights = JSON.parse(localStorage.getItem('hueLights'));
        }

        var self = this,
            sessionUser = {
                googleId: null,
                username: null,
                bridgeIp: null
            };

        if (self.config.debug) {
            return {
                googleId: dummy.googleId,
                username: dummy.username,
                bridgeIp: dummy.bridgeIp
            }
        }

        // @todo fix later
        if (validate.notNull(stored)) {
            if (stored.hue.hasOwnProperty('googleId')) {
                sessionUser.googleId = stored.hue.googleId;
            }
            if (stored.hue.hasOwnProperty('username')) {
                sessionUser.username = stored.hue.username;
            }
            if (stored.hue.hasOwnProperty('bridgeIp')) {
                sessionUser.bridgeIp = stored.hue.bridgeIp;
            }
            if (stored.hasOwnProperty('lights')) {
                sessionUser.lights = stored.lights;
            }
        }

        return sessionUser;
    },
    remember: function () {

        var self = this,
            sessionUser = {
                googleId: self.session.googleId,
                username: self.session.username,
                bridgeIp: self.session.bridgeIp,
                lights: self.session.lights
            }

        if (self.config.debug) {
            console.log("remember sessionUser", sessionUser);
        }
        localStorage.setItem('hueUser', JSON.stringify({
            googleId: sessionUser.googleId,
            username: sessionUser.username,
            bridgeIp: sessionUser.bridgeIp
        }));

        var sessionConfig = {
            display: {
                flip: self.config.display.flip
            }
        }
        localStorage.setItem('hueLights', JSON.stringify(sessionUser.lights));
        localStorage.setItem('hueConfig', JSON.stringify(sessionConfig));

        self.request.save({
            "google_id": sessionUser.googleId,
            username: sessionUser.username,
            "bridge_ip": sessionUser.bridgeIp,
            lights: sessionUser.lights
        });
    }
}