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
      "id": "cordova-plugin-webengage.WebEngagePlugin",
      "file": "plugins/cordova-plugin-webengage/www/WebEngagePlugin.js",
      "pluginId": "cordova-plugin-webengage",
      "clobbers": [
        "webengage"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-dialogs": "2.0.2",
    "cordova-plugin-webengage": "1.0.0"
  };
});