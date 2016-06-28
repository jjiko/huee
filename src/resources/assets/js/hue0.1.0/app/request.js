var session = require('./session.js');
module.exports = {
    auth: function () {
        var self = this;
        var jqxhr = $.ajax({
            type: "POST",
            url: 'http://' + self.session.bridgeIp + '/api',
            data: JSON.stringify({"devicetype": 'jiko_hue_app#web jiko'}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (resp) {
                if (resp.length && typeof(resp[0].success) !== "undefined") {
                    self.display.log("New user authorized " + resp[0].success.username);
                    self.session.username = resp[0].success.username;
                    session.remember.apply(self);

                    self.events.trigger('user:auth_success');
                    self.events.trigger('app:lights');
                }
            },
            failure: function (err) {
                alert(err);
            }
        });
    },
    bridge: function () {
        var self = this,
            bridgeIp = null,
            bridges = [];
        var jqxhr = $.ajax({
                async: false,
                context: self,
                type: "GET",
                url: 'https://www.meethue.com/api/nupnp',
            })
            .done(function (resp) {
                //console.log("response from hue bridge", resp, self.session.bridgeIp);
                if (resp.length) {
                    bridges = resp;
                }

                if (resp.length && resp[0].hasOwnProperty('internalipaddress')) {
                    // use first result by default
                    bridgeIp = resp[0].internalipaddress;
                    self.session.bridgeIp = bridgeIp;
                    // session.remember.apply(self);
                }
                else {
                    // @todo send deferred request
                    console.log("Set as remote request");
                    self.session.bridgeIP = null;
                    self.session.remote = true;
                }
            });
        //console.log("bridge ip", bridgeIp);
        return bridges;
    },
    defer: function (data) {
        if (typeof(data) == "undefined") {
            data = {};
        }

        $.post('defer', data, function (resp) {
            console.log("deferring request");
        });
    },
    deferred: function () {
        var self = this;
        $.get('deferred', function (resp) {
            if (resp.length) {
                console.log("deferred response has a length");
                $.each(resp, function (i, r) {
                    console.log("process deferred request", r);
                    var jqxhr = $.ajax({
                        type: r.type,
                        url: r.url,
                        data: r.data
                    }).done(function (resp) {
                        console.log('deferred task done', r);
                    });
                });
            }
        });
    },
    lightOn: function () {
        var $light = this, requestUri, putData;
        var lights = require('./lights.js');
        if (!$light.data('remote')) {
            requestUri = $light.data("requesturi");
            putData = JSON.stringify({"on": true, "bri": 255});
        }
        else {
            // @todo add column for active devices.. maybe browserId, Timestamp (last active)
            requestUri = "defer";
            putData = {
                url: $light.data('requesturi'),
                type: "PUT",
                data: JSON.stringify({"on": true, "bri": 255})
            }
        }
        var jqxhr = $.ajax({
            type: "PUT",
            url: requestUri,
            data: putData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (resp) {
                if (resp.length && resp[0].hasOwnProperty('error')) {
                    alert(resp[0].error.description);
                    return false;
                }

                // @todo show deferred state
                $light.attr('data-state', "on");
                $light.find('i.material-icons').empty().append('highlight');
                $light.off('click');
                $light.on('click', $.proxy(lights.off, $light));
            },
            failure: function (err) {
                alert(err);
            }
        });
    },
    lightOff: function () {
        var $light = this, requestUri, putData;
        var lights = require('./lights.js');
        if (!$light.data('remote')) {
            requestUri = $light.data("requesturi");
            putData = JSON.stringify({"on": false});
        }
        else {
            // @todo add column for active devices.. maybe browserId, Timestamp (last active)
            requestUri = "defer";
            putData = JSON.stringify({
                url: $light.data('requesturi'),
                type: "PUT",
                data: {"on": false}
            });
        }

        var lights = require('./lights.js');
        var jqxhr = $.ajax({
            type: "PUT",
            url: requestUri,
            data: putData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (resp) {
                if (resp.length && resp[0].hasOwnProperty('error')) {
                    alert(resp[0].error.description);
                    return false;
                }
                $light.attr('data-state', "off");
                $light.find('i.material-icons').empty().append('lightbulb_outline');
                $light.off('click');
                $light.on('click', $.proxy(lights.on, $light));
            },
            failure: function (err) {
                alert(err);
            }
        });
    },
    lights: function () {
        var self = this;
        // verify bridge ip is valid
        // console.log("request bridge", self.request.bridge.apply(self));
        var bridges = self.request.bridge.apply(self);
        if (!bridges) {
            // console.log("bridge ip verification failed.");
            self.config.remote = true;
        }

        var config = self.config.request;
        if (self.debug) {
            self.lights.set(dummy.lights);
            return self.lights.get();
        }
        // console.log(self.session);
        config.base = config.base.replace('{BRIDGE}', self.session.bridgeIp)
            .replace('{USER}', self.session.username);

        self.config.request = config;

        console.log("remote?", self.session.remote);
        if (!self.session.remote) {
            var jqxhr = $.ajax({
                    async: false,
                    context: self,
                    type: "GET",
                    url: config.base + config.lights,
                })
                .done(self.lights.set);
        }
        else {
            var jqxhr = $.ajax({
                async: false,
                context: self,
                type: "POST",
                data: {
                    "google_id": self.session.googleId
                },
                url: "lights"
            }).done(self.lights.set);
        }

        return self.lights.get();
    },
    save: function (data) {
        $.post("save", data, function (resp) {
            // console.log("save", resp);
        });
    }
}