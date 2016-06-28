/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

// Version 0.1

'use strict';

var _hueSW = {
    version: 1,
    logging: true,
    appKey: "b0c6e44714304c5697b13ff4dcd7c3ad",
    host: "https://app.joejiko.com"
};

self.addEventListener('install', function(evt) {
    //Automatically take over the previous worker.
    evt.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(evt) {
    if (_hueSW.logging) console.log("Activated Hue ServiceWorker version: " + _hueSW.version);
});

//Handle the push received event.
self.addEventListener('push', function(evt) {
    if (_hueSW.logging) console.log("push listener", evt);
    evt.waitUntil(self.registration.pushManager.getSubscription().then(function(subscription) {
        var regID = null;
        if ('subscriptionId' in subscription) {
            regID = subscription.subscriptionId;
        } else {
            //in Chrome 44+ and other SW browsers, reg ID is part of endpoint, send the whole thing and let the server figure it out.
            regID = subscription.endpoint;
        }
        return fetch(_hueSW.host + "/notifications/get?version=" + _hueSW.version + "&appKey=" + _hueSW.appKey + "&deviceID=" + encodeURIComponent(regID)).then(function(response) {
            console.log("response", response);
            return response.json().then(function(json) {
                if (_hueSW.logging) console.log(json);
                //var promises = [];
                //for (var i = 0; i < json.notifications.length; i++) {
                //    var note = json.notifications[i];
                //    if (_hueSW.logging) console.log("Showing notification: " + note.body);
                //    var url = "/roost.html?noteID=" + note.roost_note_id + "&sendID=" + note.roost_send_id + "&body=" + encodeURIComponent(note.body);
                //    promises.push(showNotification(note.roost_note_id, note.title, note.body, url, _hueSW.appKey));
                //}
                //return Promise.all(promises);
            });
        });
    }));
});

self.addEventListener('notificationclick', function(evt) {
    if (_hueSW.logging) console.log("notificationclick listener", evt);
    evt.waitUntil(handleNotificationClick(evt));
});

function parseQueryString(queryString) {
    var qd = {};
    queryString.split("&").forEach(function (item) {
        var parts = item.split("=");
        var k = parts[0];
        var v = decodeURIComponent(parts[1]);
        (k in qd) ? qd[k].push(v) : qd[k] = [v, ]
    });
    return qd;
}

//Utility function to handle the click
function handleNotificationClick(evt) {
    if (_hueSW.logging) console.log("Notification clicked: ", evt.notification);
    evt.notification.close();
    //var iconURL = evt.notification.icon;
    //if (iconURL.indexOf("?") > -1) {
    //    var queryString = iconURL.split("?")[1];
    //    var query = parseQueryString(queryString);
    //    if (query.url && query.url.length == 1) {
    //        if (_hueSW.logging) console.log("Opening URL: " + query.url[0]);
    //        return clients.openWindow(query.url[0]);
    //    }
    //}
    //console.log("Failed to redirect to notification for iconURL: " + iconURL);
}

//Utility function to actually show the notification.
function showNotification(noteID, title, body, url, appKey) {
    var options = {
        body: body,
        tag: "hue",
        icon: _hueSW.host + '/logo?size=100&direct=true&appKey=' + _hueSW.appKey + '&noteID='+ noteID + '&url=' + encodeURIComponent(url)
    };
    return self.registration.showNotification(title, options);
}