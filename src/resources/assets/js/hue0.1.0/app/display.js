var calc = require('./calc.js');
var log = require('./log.js');
module.exports = {
    dim: function () {
        var self = this;
        //console.log(self.activity, self.config.activityTimeout);
        if (!calc.userIsActive(self.activity, self.config.activityTimeout)) {
            //console.log("dimming due to inactivity");
            $("#app").addClass('dim');
            return;
        }

        $("#app").removeClass('dim');
    },
    appendSpecialLights: function (specialLights, squareSize) {
        var self = this;
        var template = {
            col: '<div class="col light-col special-light-col"></div>',
            light: '<div class="special-light"><div class="light-label"><span class="light-label-text">{NAME}</span></div><button class="btn btn-default btn-fab" data-id="{ID}" data-requesturi="{REQUEST_URI}" data-state="{STATE}" data-type="{TYPE}" data-remote="{REMOTE_STATUS}">{ICON}</button></div>',
            icons: {
                "off": '<i class="material-icons">lightbulb_outline</i>',
                "on": '<i class="material-icons">highlight</i>',
                "settings": '<i class="material-icons">settings</i>'
            }
        }
        var $output = $(template.col).css({width: squareSize + "px", height: squareSize + "px"});
        squareSize = squareSize / 2;
        $.each(specialLights, function (i, v) {
            var templateString, $thisLight, lightState;
            if (v.type === "Settings") {
                templateString = template.light
                    .replace('{ID}', null)
                    .replace('{NAME}', v.name)
                    .replace('{STATE}', null)
                    .replace('{TYPE}', v.type)
                    .replace('{REMOTE_STATUS}', self.config.remote)
                    .replace('{REQUEST_URI}', "settings")
                    .replace('{ICON}', template.icons.settings);
                $thisLight = $(templateString).css({
                    width: squareSize + "px",
                    height: squareSize + "px"
                });
                $thisLight.find('.light-label').css({top: (squareSize * .667) + "px"});
                $thisLight.find('.light-label-text').css({"font-size": (squareSize / 3 / 3) + "px"});
                $thisLight.find('.btn i').css({
                    "font-size": (squareSize * .60) + "px",
                    height: (squareSize * .60) + "px"
                });
                $thisLight.appendTo($output);
                return false;
            }
            lightState = v.state.on ? "on" : "off";
            templateString = template.light
                .replace('{ID}', i)
                .replace('{NAME}', v.name)
                .replace('{STATE}', lightState)
                .replace('{TYPE}', v.type)
                .replace('{REQUEST_URI}', self.config.request.base + "/lights/" + i + "/state")
                .replace('{REMOTE_STATUS}', self.config.remote)
                .replace('{ICON}', template.icons[lightState]);
            $thisLight = $(templateString).css({
                width: squareSize + "px",
                height: squareSize + "px"
            });
            $thisLight.find('.light-label').css({top: (squareSize * .667) + "px"});
            $thisLight.find('.light-label-text').css({"font-size": (squareSize / 3 / 3) + "px"});
            $thisLight.find('.btn i').css({
                "font-size": (squareSize * .60) + "px",
                height: (squareSize * .60) + "px"
            });
            $thisLight.appendTo($output);
        });

        return $output;
    },
    appendLight: function (i, v, squareSize) {
        var self = this;
        var template = {
            col: '<div class="col light-col"><div class="light-label"><span class="light-label-text">{NAME}</span></div><button class="btn btn-default btn-fab" data-id="{ID}" data-requesturi="{REQUEST_URI}" data-state="{STATE}" data-type="{TYPE}" data-remote="{REMOTE_STATUS}">{ICON}</button></div>',
            icons: {
                "off": '<i class="material-icons">lightbulb_outline</i>',
                "on": '<i class="material-icons">highlight</i>'
            }
        }
        console.log("appending light state", v.state.on);
        var lightState = JSON.parse(v.state.on) ? "on" : "off";
        var templateString = template.col
            .replace('{ID}', i)
            .replace('{NAME}', v.name)
            .replace('{STATE}', lightState)
            .replace('{TYPE}', v.type)
            .replace('{REMOTE_STATUS}', self.config.remote)
            .replace('{REQUEST_URI}', self.config.request.base + "/lights/" + i + "/state")
            .replace('{ICON}', template.icons[lightState]);
        var $thisLight = $(templateString).css({
            width: squareSize + "px",
            height: squareSize + "px"
        });
        $thisLight.find('.light-label').css({top: (squareSize * .667) + "px"});
        $thisLight.find('.light-label-text').css({"font-size": (squareSize / 3 / 3) + "px"});
        $thisLight.find('.btn i').css({
            "font-size": (squareSize * .60) + "px",
            height: (squareSize * .60) + "px"
        });

        return $thisLight;
    },
    lights: function () {
        var self = this;

        // process deferred requests from remote hosts
        if(!self.config.remote) {
            self.request.deferred.apply(self);
        }

        var lights = self.request.lights.apply(self);
        if (!Object.keys(lights).length) {
            self.display.log("No lights found.");
            return false;
        }

        var lightCount = Object.keys(lights).length;
        var squareSize = calc.square(lightCount);
        var $output = $('<div />');
        self.display.log("Building lights display");
        $.each(lights, function (i, v) {
            if (v.type === "Special") {
                //console.log(v.type);
                $output.append(self.display.appendSpecialLights.call(self, v.lights, squareSize));
                return false;
            }

            $output.append(self.display.appendLight.call(self, i, v, squareSize));
        });
        $("#lights").empty().append($("<div>").append($output));
        $(window).on('resize', function (evt) {
            //console.log("resizing",window.innerHeight);
            // @todo setTimeout delay
            var $cols = $('.col');
            var squareSize = calc.square($cols.length);
            $cols.each(function (i, e) {
                var $col = $(e);
                var ss;
                if ($col.is('.special-light-col')) {
                    ss = squareSize / 2;
                    $col.css({width: squareSize + "px", height: squareSize + "px"});
                    $col.find('.special-light').css({width: ss + "px", height: ss + "px"});
                } else {
                    ss = squareSize;
                    $col.css({width: ss + "px", height: ss + "px"});
                }
                $col.find('.light-label').css({top: (ss * .667) + "px"});
                $col.find('.light-label-text').css({"font-size": (ss / 3 / 3) + "px"})
                $col.find('.btn i.material-icons').css({
                    "font-size": (ss * .60) + "px",
                    height: (ss * .60) + "px"
                });
            });
        });
        $(document).find('.btn[data-state="off"]').on('click', self.lights.on);
        $(document).find('.btn[data-state="on"]').on('click', self.lights.off);
        self.log.done();
    },
    settings: function(){
        var self = this;
        
        var bridges = self.request.bridge.apply(self);
    },
    groups: function() {
        var self = this;
        require('./page/groups.js');
    },
    log: function (m) {
        return log.display(m);
    }
}