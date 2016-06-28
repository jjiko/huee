var $ = require('jquery');
var $log = $("#log")
module.exports = {
    display: function (msg) {
        $log.show();
        var $logItems = $log.find('div');
        $logItems.css({opacity:.5})
        var $logItem = $('<div>').append(msg).prependTo($log);
        var timeoutTime = ($logItems.length + 1) * 1000;
        var lit = setTimeout(function(){
            $logItem.fadeOut('slow');
        }, timeoutTime);
    },
    done: function () {
        $log.hide();
        // $log.find('div:nth-child(n+1)').fadeOut('slow');
        // var lt = setTimeout(function(){
        //     $log.find('div:nth-child(1)').fadeOut('fast');
        // }, 3000);
    }
}