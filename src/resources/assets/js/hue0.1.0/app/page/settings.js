var $ = require('jquery');
var session = require('../session.js');
var display = {
    "$html": $("html"),
    "$flipper": $("#displayFlip"),
    flip: function (isFlipped) {
        display.$flipper.prop('checked', isFlipped);
        if (isFlipped) {
            display.$html.css({"transform":"rotate(180deg)"});
            return true;
        }

        display.$html.attr('style', '');
        return false;
    }
}
module.exports = {
    bind: function () {
        var self = this;
        display.$flipper.on('change', function (evt) {
            self.config.display.flip = display.flip(display.$flipper.is(':checked'));
            session.remember.apply(self);
        });

        return self;
    },
    init: function (self) {
        this.bind.apply(self);

        display.flip(self.config.display.flip);
    }
}