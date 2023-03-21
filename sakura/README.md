# Common development instructions

```sh
# install dependencies
yarn install

# start the development server
yarn start

# run unit tests
npx cypress run-ct

# run browser tests
npx cypress run

# build a new version for deployment
(cd ../loaderapp && ./publish.sh)
```

# How to develop against Ankiconnect Android

These instructions are for developing against the Android version of Ankiconnect
called Ankiconnect Android. This will work for the following scenarios:

1. You have an android device such as your mobile phone or tablet.
2. You are using an existing version of Ankiconnect Android, or you are
   developing a version with Android Studio and you can run it on your device.

## Prerequisites for development

These instructions are for Chrome on a Mac. If you are using a different browser
or operating system, you may need to find the equivalent steps.

- Install Ankiconnect Android on your device
- Connect your device to your computer and enable USB debugging in Android.
- Connect your Android device to the same network as your computer.

## Connecting to hare on your Android device

1. Find out the IP address of your computer. For example, if you are on a
   Mac, you can run `ifconfig | grep inet` and look for the IP address that
   starts with 192.168.0. or 10.0.0.
1. In the Ankiconnect Android app, go to the settings and change the cors setting
   to `*`. This will allow access from any host. If you want to limit this, you
   can also set it to `http://<the ip address of your computer>:4000`. The
   settings will be taken into use immediately.
1. Start hare on your computer with `yarn start`. This will make it available to
   the network so you can connect to it from your device.
1. On your device, open http://<your computer's IP address>:4000

## Connect your computer's chrome to your Android device's chrome

1. Connect your Android device to your computer with a USB cable.
2. Open Chrome on your computer and go to chrome://inspect/#devices . You will
   be presented with a list of tabs on your device. Choose the tab that is running
   hare.
3. Now you can use the developer tools on your computer to debug the code on your
   device. Run the following code to test the connection:

```js
fetch("http://localhost:8765")
  .then((r) => r.text())
  .then(console.log);
```

It will respond with "Ankiconnect Android is running.". If you get a CORS error,
double check that you have set the cors setting in the app to `*` or
`http://<your computer's IP address>:4000`.

NOTE: on your device, you need to have the chrome tab active for this to work.
