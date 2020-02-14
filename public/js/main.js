const publicKey = 'BHr98FwTnZ7fszUAqe1M1Hw9m24Z1yKNeLdQMoKP3DMktphRO4oBtwogH8zrNokMHUl6KHbDfIVL2VTL5D9vZhE';

            const pushButton = document.querySelector('#subscribe');
            const testButton = document.querySelector('#sample');
            const messageField = document.querySelector('#message');

            let isSubscribed = false;
            let swRegistration = null;
            let subscriptionDetails = null;

            function urlB64ToUint8Array(base64String) {
                const padding = '='.repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding)
                    .replace(/\-/g, '+')
                    .replace(/_/g, '/');

                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);

                for (let i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
            }

            function updateBtn() {
                if (Notification.permission === 'denied') {
                    pushButton.textContent = 'Push Messaging Blocked.';
                    pushButton.disabled = true;
                    return;
                }

                if (isSubscribed) {
                    pushButton.textContent = 'Disable Push Messaging';
                } else {
                    pushButton.textContent = 'Enable Push Messaging';
                }

                pushButton.disabled = false;
            }

            function subscribeUser() {
                const applicationServerKey = urlB64ToUint8Array(publicKey);
                swRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                })
                    .then(async function (subscription) {
                        await fetch("database/add", {
                            method: "POST",
                            body: JSON.stringify(subscription),
                            headers: {
                                "content-type": "application/json"
                            }
                        });
                        console.log('User is subscribed.');
                        isSubscribed = true;
                        subscriptionDetails = JSON.stringify(subscription);

                        updateBtn();
                    })
                    .catch(function (err) {
                        console.log('Failed to subscribe the user: ', err);
                        updateBtn();
                    });
            }

            function unsubscribeUser() {
                swRegistration.pushManager.getSubscription()
                    .then(function (subscription) {
                        if (subscription) {
                            return subscription.unsubscribe();
                        }
                    })
                    .catch(function (error) {
                        console.log('Error unsubscribing', error);
                    })
                    .then(function () {
                        console.log('User is unsubscribed.');
                        isSubscribed = false;

                        updateBtn();
                    });
            }

            function initializeUI() {
                pushButton.addEventListener('click', function () {
                    pushButton.disabled = true;
                    if (isSubscribed) {
                        unsubscribeUser();
                    } else {
                        subscribeUser();
                    }
                });

                // Set the initial subscription value
                swRegistration.pushManager.getSubscription()
                    .then(function (subscription) {
                        isSubscribed = !(subscription === null);
                        if (isSubscribed) {
                            console.log('User IS subscribed.');
                            subscriptionDetails = JSON.stringify(subscription);
                        } else {
                            console.log('User is NOT subscribed.');
                        }

                        updateBtn();
                    });

                testButton.addEventListener('click', async function () {
                    if (isSubscribed) {
                        subscriptionDetails = JSON.parse(subscriptionDetails)
                        subscriptionDetails.message = messageField.value;
                        subscriptionDetails = JSON.stringify(subscriptionDetails);
                        await fetch("/subscribe", {
                            method: "POST",
                            body: subscriptionDetails,
                            headers: {
                                "content-type": "application/json"
                            }
                        });
                    } else {
                        M.toast({ html: 'You are not subscribed', classes: 'rounded' });

                    }
                });
            }

            if ('serviceWorker' in navigator && 'PushManager' in window) {
                console.log('Service Worker and Push is supported');

                Notification.requestPermission(function (status) {
                    console.log('Notification permission status:', status);
                });

                navigator.serviceWorker.register('js/sw.js')
                    .then(function (swReg) {
                        console.log('Service Worker is registered', swReg);

                        swRegistration = swReg;
                        initializeUI();
                        //test();
                    })
                    .catch(function (error) {
                        console.error('Service Worker Error', error);
                    });
            } else {
                console.warn('Push messaging is not supported');
                pushButton.textContent = 'Push Not Supported';
            }