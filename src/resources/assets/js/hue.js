// Hi :)
var tid = setInterval(function () {
    if (document.readyState !== 'complete') return;
    clearInterval(tid);
    app = require('./hue0.1.0/app.js') || {};

    if (app.config.refreshWindowAfter > -1) {
        var ri = setInterval(function () {
            //var x = new Date();
            //x.setTime(new Date().getTime() + (app.config.refreshWindowAfter*60*60*1000));
            //x.toString()
            window.location.reload();
        }, (app.config.refreshWindowAfter * 60 * 60 * 1000));
    }
}, 100);