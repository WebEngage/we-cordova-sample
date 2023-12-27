cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-dialogs.notification",
      "file": "plugins/cordova-plugin-dialogs/www/notification.js",
      "pluginId": "cordova-plugin-dialogs",
      "merges": [
        "navigator.notification"
      ]
    },
    {
      "id": "cordova-plugin-dialogs.notification_android",
      "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
      "pluginId": "cordova-plugin-dialogs",
      "merges": [
        "navigator.notification"
      ]
    },
    {
      "id": "cordova-plugin-fcm-with-dependecy-updated.FCMPlugin",
      "file": "plugins/cordova-plugin-fcm-with-dependecy-updated/www/FCMPlugin.js",
      "pluginId": "cordova-plugin-fcm-with-dependecy-updated",
      "clobbers": [
        "FCM"
      ]
    },
    {
      "id": "cordova-plugin-webengage.WebEngagePlugin",
      "file": "plugins/cordova-plugin-webengage/www/WebEngagePlugin.js",
      "pluginId": "cordova-plugin-webengage",
      "clobbers": [
        "webengage"
      ]
    },
    {
      "id": "cordova-plugin-android-fcm.AndroidFcmPlugin",
      "file": "plugins/cordova-plugin-android-fcm/www/AndroidFcmPlugin.js",
      "pluginId": "cordova-plugin-android-fcm",
      "clobbers": [
        "androidfcm"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-dialogs": "2.0.2",
    "cordova-plugin-fcm-with-dependecy-updated": "7.8.0",
    "cordova-plugin-webengage": "1.0.0",
    "cordova-plugin-android-fcm": "1.0.1"
  };
});