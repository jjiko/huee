$ = require('jquery');

var calc = require('./app/calc.js');
var display = require('./app/display.js');
var lights = require('./app/lights.js');
var validate = require('./app/validate.js');
/*
 API Docs: http://www.developers.meethue.com/documentation/core-concepts
 
 */
var hue = {
    activity: new Date(),
    auth: require('./app/auth.js'),
    config: {},
    display: display,
    events: $({}),
    interval: {
        refresh: null,
        refreshWindow: null
    },
    lights: lights,
    log: require('./app/log.js'),
    request: require('./app/request.js'),
    service: {},
    session: {
        remote: false
    },
    user: {},
    //groups: require('./app/groups.js'),
    //config: require('./app/config.js'),
    //schedules: require('./app/schedules.js'),
    //scenes: require('./app/scenes.js'),
    //sensors: require('./app/sensors.js'),
    //rules: require('./app/rules.js'),
    init: function () {
        var self = this;

        self.config = require('./app/config.js');
        if(localStorage.hasOwnProperty('hueConfig')) {
            self.config = $.extend(self.config, JSON.parse(localStorage.getItem('hueConfig')));
        }
        self.user.isAdmin = function() {
            return (self.session.googleId === "110880509059057751100");
        }

        require('./app/events.js').bind.apply(self);

        self.events.trigger('app:ready');

        require('./app/session.js').init(self);
        require('./app/page/settings.js').init(self);
        require('./app/page/groups.js');

        // self.service = require('./app/service.js');

        if(self.user.isAdmin()) {
            $('body').addClass('display-admin');
        }

        return self.api();
        //self.session.bridgeIp = bridge.detect.apply(self);
        //console.log(self);
    },
    api: function () {
        return {
            config: this.config,
            enableDebug: function(){
                this.config.debug = true;
            },
            events: this.events,
            service: this.service,
            session: this.session,
            user: this.user,
            toString: this.toString()
        }
    },
    toString: function () {
        return JSON.stringify({
            session: this.session,
            lights: this.lights
        });
    }
}
module.exports = hue.init();
