var $ = require('jquery');
var display = require('./display.js');
var session = require('./session.js');
function app() {
    var self = this;

    self.events.on('app:loading', function(){
        $("#app").attr('data-state', 'loading');
    });

    self.events.on('app:ready', function(){
       $("#app").attr('data-state', 'ready');
    });
}
function cache() {
    var self = this;

    self.events.on('cache:get', function() {

    });
    self.events.on('cache:set', function() {

    });
    self.events.on('cache:flush', function (evt) {
        localStorage.clear();
        window.location.reload();
    });
}

function lights() {
    var self = this;

    self.events.on('special:off', function (evt) {
        $('.light-col .btn[data-state="on"]:not([data-type*="Special"])').trigger('click');
    });
    self.events.on('special:on', function (evt) {
        $('.light-col .btn[data-state="off"]:not([data-type*="Special"])').trigger('click');
    });
    self.events.on('app:light_on', function () {

    });
    self.events.on('app:light_off', function () {

    });
    self.events.on('app:lights', function (evt) {
        self.events.trigger('app:refresh');
        self.events.trigger('app:autorefresh');
    });
}

function user() {
    var self = this;
    self.events.on('admin:auth', function(evt) {
        if(self.user.isAdmin()) {
            $("#app").attr('data-display', 'admin');
        }
    });
    self.events.on('user:auth', function (evt) {
        display.log("Authorizing app");
        if (self.auth.check.apply(self)) {
            self.events.trigger('user:auth_success');

            self.log.display('Rendering light controls');
            self.events.trigger('app:lights');
        }
    });

    self.events.on('user:auth_success', function (evt) {
        self.log.display("Login success");
        $("#app").attr('data-display', 'user');

        self.events.trigger('admin:auth');
    });

    self.events.on('user:auth_failed', function (evt) {
        $("#app").attr('data-display', 'guest');
    });

    self.events.on('user:activity', function (evt) {
        self.activity = new Date();
        display.dim.apply(self);
    });
    self.events.on('google:auth', function(evt) {
        $('.abcRioButton').trigger('click');
    });
    self.events.on('user:google_sign_in', function (evt, googleUser) {
        console.log('user:google_sign_in');
        var profile = googleUser.getBasicProfile();

        console.log("response from google auth", profile.getId());
        //console.log('Image URL: ' + profile.getImageUrl());
        $.post('auth', {
            google_auth_response: googleUser.getAuthResponse(),
            google_id: profile.getId(),
            google_id_token: googleUser.getAuthResponse().id_token,
            email: profile.getEmail(),
            name: profile.getName()
        }, function (resp) {
            //console.log("auth resp", resp);
            self.session.googleId = resp.google_id;
            session.remember.apply(self);

            // check for bridge ip and username (already paired to hub)
            if (resp.bridge_ip && resp.username) {

                self.session.bridgeIp = resp.bridge_ip;
                self.session.username = resp.username;
                self.events.trigger('user:auth_success'); // is it really?
                session.remember.apply(self);

                // go ahead and get the lights
                self.events.trigger('app:lights');
            }
        });

        // not paired with hub.. begin attempt
        if (!self.session.username || self.session.username == "null") {
            self.events.trigger('user:auth');
        }
    });
}
function userInteraction() {
    var self = this;
    $(document).on('click, mousemove', function (evt) {
        self.events.trigger('user:activity');
    });
    $(document).on('click', '[data-event-trigger]', function (evt) {
        console.log("trigger", $(this).attr('data-event-trigger'));
        self.events.trigger($(this).attr('data-event-trigger'), [evt.target]);
        return false;
    });
    self.events.on('request:home', function() {
       $("#app").attr('data-view', 'lights');
    });
    self.events.on('request:groups', function() {
        $("#app").attr('data-view', 'groups');
        self.display.groups.apply(self);
    });
    self.events.on('request:settings', function() {
       $("#app").attr('data-view', 'settings');
        self.display.settings.apply(self);
    });
    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function (evt) {
        var isFullscreen = document.fullscreen || document.msFullscreenElement || document.webkitIsFullScreen || document.mozFullScreen;
        $("#app").attr('data-fullscreen-state', (isFullscreen ? "On" : "Off"));
    });

    self.events.on('request:fullscreen', function (evt, target) {
        $("#app").data('fullscreenState', 'fullscreen');

        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }

        $(window).trigger('resize');
    });

    self.events.on('request:fullscreen_exit', function (evt, target) {
        $("#app").data('fullscreenState', 'fullscreen_exit');
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

        $(window).trigger('resize');
    });
}
function bind() {
    var self = this;

    app.apply(self);
    cache.apply(self);
    lights.apply(self);
    user.apply(self);
    userInteraction.apply(self);

    self.events.on('app:refresh', function () {
        display.log("retrieving lights info");
        display.lights.apply(self);
        display.dim.apply(self);
        if (self.config.debug) {
            console.log("updated", new Date());
        }
    });

    self.events.on('app:autorefresh', function () {
        self.interval.refresh = setInterval(function () {
            self.events.trigger('app:refresh');
        }, (self.config.refreshRate * 1000));
    });

    self.events.on('app:freeze', function (evt) {
        clearInterval(self.interval.refresh);
    });
}
module.exports = {
    bind: bind
}