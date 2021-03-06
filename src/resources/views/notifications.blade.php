<!doctype html>
<link rel="manifest" href="/manifest.json">
<script>
    var reg;
    var sub;
    var isSubscribed = false;
    // var subscribeButton = document.querySelector('button');

    if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported');
        navigator.serviceWorker.register('service-worker.js').then(function () {
            return navigator.serviceWorker.ready;
        }).then(function (serviceWorkerRegistration) {
            console.log('after registration');
            reg = serviceWorkerRegistration;
            // subscribeButton.disabled = false;
            console.log('Service Worker is ready :^)', reg);
            subscribe();
        }).catch(function (error) {
            console.log('Service Worker Error :^(', error);
        });
    }

    // subscribeButton.addEventListener('click', function () {
    //     if (isSubscribed) {
    //         unsubscribe();
    //     } else {
    //         subscribe();
    //     }
    // });

    function subscribe() {
        console.log("subscribing to serviceworker");
        reg.pushManager.subscribe({userVisibleOnly: true}).then(function (pushSubscription) {
            sub = pushSubscription;
            console.log('Subscribed! Endpoint:', sub.endpoint);
            //subscribeButton.textContent = 'Unsubscribe';
            isSubscribed = true;
        });
    }

    function unsubscribe() {
        sub.unsubscribe().then(function (event) {
            //subscribeButton.textContent = 'Subscribe';
            console.log('Unsubscribed!', event);
            isSubscribed = false;
        }).catch(function (error) {
            console.log('Error unsubscribing', error);
            //subscribeButton.textContent = 'Subscribe';
        });
    }
</script>