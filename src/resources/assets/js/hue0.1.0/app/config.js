module.exports = {
    activityTimeout: 5,
    refreshWindowAfter: -1, //hours, -1 = never
    refreshRate: 30, // seconds
    authCheckTimeout: 60, // seconds to wait for hub auth
    debug: false,
    display: {
        flip: false
    },
    remote: false,
    request: {
        base: 'http://{BRIDGE}/api/{USER}',
        light: '/light/{LIGHT_ID}',
        lights: '/lights'
    }
}