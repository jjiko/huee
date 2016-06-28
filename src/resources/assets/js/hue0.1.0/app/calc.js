var $ = require('jquery');
var validate = require('./validate.js');
module.exports = {
    userIsActive: function (lastActive, s) {
        if (!validate.date(lastActive)) {
            return false;
        }

        if (typeof(s) == "undefined") {
            s = 15;
        }
        var now = new Date();
        //console.log("time difference", (now.getTime() - lastActive.getTime()));
        return ((now.getTime() - lastActive.getTime()) < (s * 1000)); // 15 seconds
    },
    isNight: function () {
        var now = new Date();
        return (now.getHours() >= 18 && now.getHours() <= 6);
    },
    screenOrientation: function () {
        return (window.innerWidth > window.innerHeight) ? "landscape" : "portrait"
    },
    square: function (n) {
        var $nav = $("#nav .inner");
        var x = window.innerWidth,
            y = window.innerHeight,
            navHeight = $nav.innerHeight(),
            navWidth = $nav.innerWidth();
        // landscape
        if(window.innerWidth > window.innerHeight) {
            $nav.css('width', '');
            y -= navHeight;
        }
        // portrait
        if(window.innerWidth < window.innerHeight) {
            $nav.css('width', window.innerHeight);
            x -= navHeight;
        }

        var px = Math.ceil(Math.sqrt(n * x / y));
        var sx, sy, py;

        if (Math.floor(px * y / x) * px < n) { // does not fit y/(x/px)=px*y/x
            sx = y / Math.ceil(px * y / x);
        } else {
            sx = x / px;
        }

        py = Math.ceil(Math.sqrt(n * y / x));
        if (Math.floor(py * x / y) * py < n) { // does not fit
            sy = x / Math.ceil(x * py / y);
        }
        else {
            sy = y / py;
        }

        return (sx > sy) ? sx : sy;
    }
}