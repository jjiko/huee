var request = require('./request.js');
module.exports = {
    get: function() {
        if(localStorage.hasOwnProperty("hueLights")) {
            return JSON.parse(localStorage.getItem('hueLights'));
        }
        return [];
    },
    set: function(data) {
        if(data.length && data[0].hasOwnProperty('error')) {
            alert(data[0].error.description);
            return false;
        }

        localStorage.setItem('hueLights', JSON.stringify(data));
        request.save({lights: data});
        return data;
    },
    off: function (evt, params) {
        var $light = $(this);
        if ($light.data('type') == "Special On") {
            $('.light-col .btn[data-state="off"]:not([data-type*="Special"])').trigger('click');
            return false;
        }
        request.lightOff.apply($light);
    },
    on: function (evt, params) {
        var $light = $(this);
        if ($light.data('type') == "Special Off") {
            $('.light-col .btn[data-state="on"]:not([data-type*="Special"])').trigger('click');
            return false;
        }
        request.lightOn.apply($light);
    }
}