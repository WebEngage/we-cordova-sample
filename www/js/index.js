/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  var androidVersion = parseFloat(device.version); // Get the Android version
  if(androidVersion >= 13) {
      checkAndroidPushPermission(); //Request Android push permission for Android OS > 13
  }
  androidfcm.updateToken();

  webengage.push.onClick(function (deeplink, customData) {
    console.log("Push clicked");
  });


  webengage.notification.onPrepared(function (inAppData) {
    console.log(
      "InApp Prepared Callback Received, Data: " + JSON.stringify(inAppData)
    );
  });

  webengage.notification.onShown(function (inAppData) {
    console.log("In-app shown");
  });

  webengage.notification.onDismiss(function (inAppData) {
    console.log("In-app dismissed");
  });

  webengage.notification.onClick(function (inAppData, actionId) {
    console.log("In-app shown");
  });


  webengage.jwtManager.tokenInvalidatedCallback(function () {
    console.log("JWT Token Invalidated");
})
  

  webengage.engage();
  document.getElementById("deviceready").classList.add("ready");
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  
  // Comment below line incase app freezing issue or configure FCM
  FCM.eventTarget.addEventListener("notification", listener, false);
}

// Handles user Optin changes
document.querySelectorAll(".toggleOptIn").forEach(function (checkbox) {
  checkbox.addEventListener("click", function () {
    const optInType = this.getAttribute("data-type");
    const isChecked = this.checked;
    console.log(optInType + " opt-in . isChecked: " + isChecked);
    webengage.user.setUserOptIn(optInType, isChecked);
  });
});

function checkAndroidPushPermission() {
  var permissions = cordova.plugins.permissions;
  permissions.checkPermission(
    permissions.POST_NOTIFICATIONS,
    function (status) {
      if (status.hasPermission) {
        webengage.user.setDevicePushOptIn(true);
      } else {
        permissions.requestPermission(
          permissions.POST_NOTIFICATIONS,
          function (status) {
            if (status.hasPermission) {
              webengage.user.setDevicePushOptIn(true);
            } else {
              webengage.user.setDevicePushOptIn(false);
            }
          },
          function () {}
        );
      }
    }
  );
}

function toggleModal() {
  var modal = document.getElementById("loginModal");
  if (modal.style.display === "block") {
    modal.style.display = "none"; // Hide the modal
  } else {
    modal.style.display = "block"; // Show the modal
  }
}

function toggleJwtModal() {
    var modal = document.getElementById("secureTokenModal");
    if (modal.style.display === "block") {
      modal.style.display = "none"; // Hide the modal
    } else {
      modal.style.display = "block"; // Show the modal
    }
  }

// Function to save data from the modal
function saveData() {
 
  const cuid = document.getElementById("cuid").value;
  const jwt = document.getElementById("jwt").value;
  if (cuid != "") {
    if (jwt != "") {
        console.log("login: Login with jwt - ",jwt)
      webengage.user.login(cuid, jwt);
    } else {
        console.log("login: Login without jwt. cuid- ",cuid)
        webengage.user.login(cuid);
    }
    window.localStorage.setItem("userId", cuid);
  } else {
    alert("Please Enter valid credentials.");
  }
  toggleModal();
}

function updateSecureToken() {
    const cuid = document.getElementById("updateCuid").value;
    const jwt = document.getElementById("updateJwt").value;
    if (cuid != "" && jwt != "") {
      webengage.user.setSecureToken(cuid,jwt);
      window.localStorage.setItem("userId", cuid);
    } else {
      alert("Please Enter valid credentials.");
    }
    toggleJwtModal();
  }

document.getElementById("loginButton").addEventListener("click", saveData);
document.getElementById("updatJwt").addEventListener("click", updateSecureToken);

// LOGIN
document.getElementById("login").addEventListener("click", function() {toggleModal(false)});
function showLoginAlert() {
  navigator.notification.prompt(
    "Please enter your username.", // message
    performLogin, // callback to invoke
    "Login", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

// jwtToken
document.getElementById("jwtToken").addEventListener("click", toggleJwtModal);
function showJwtAlert() {
    navigator.notification.prompt(
        "Please enter Valid JWT.", // message
        performLogin, // callback to invoke
        "Update Secure Token", // title
        ["Ok", "Cancel"], // buttonLabels
        "" // defaultText
      );
}


function performLogin(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    webengage.user.login(results.input1);
    alert("You are logged in with the username: " + results.input1);
  }
}

// LOGOUT
document.getElementById("logout").addEventListener("click", showLogoutAlert);
function showLogoutAlert() {
  console.log("logout button pressed");
  alert("You are logged out");
  performLogout();
}

function performLogout() {
  webengage.user.logout();
}

// SET FIRST NAME
document
  .getElementById("firstName")
  .addEventListener("click", showFirstNameAlert);
function showFirstNameAlert() {
  // Cordova is now initialized. Have fun!
  console.log("firstName button pressed");
  navigator.notification.prompt(
    "Please enter your first name.", // message
    setFirstName, // callback to invoke
    "Set User Details", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

function setFirstName(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
    webengage.user.setAttribute("we_first_name", results.input1);
  }
}

// SET LAST NAME
document
  .getElementById("lastName")
  .addEventListener("click", showLastNameAlert);
function showLastNameAlert() {
  // Cordova is now initialized. Have fun!
  console.log("firstName button pressed");
  navigator.notification.prompt(
    "Please enter your last name.", // message
    setLastName, // callback to invoke
    "Set User Details", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

function setLastName(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
    webengage.user.setAttribute("we_last_name", results.input1);
  }
}

// SET EMAIL
document.getElementById("email").addEventListener("click", showEmailAlert);
function showEmailAlert() {
  // Cordova is now initialized. Have fun!
  console.log("email button pressed");
  navigator.notification.prompt(
    "Please enter your email.", // message
    setEmail, // callback to invoke
    "Set User Email", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

function setEmail(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
    webengage.user.setAttribute("we_email", results.input1);
  }
}

// SET HASHED EMAIL
document
  .getElementById("hashedEmail")
  .addEventListener("click", showHashedEmailAlert);
function showHashedEmailAlert() {
  // Cordova is now initialized. Have fun!
  console.log("hashed email button pressed");
  navigator.notification.prompt(
    "Please enter your hashed email.", // message
    setHashedEmail, // callback to invoke
    "Set Hashed Email", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

function setHashedEmail(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
    webengage.user.setAttribute("we_hashed_email", results.input1);
  }
}

// SET PHONE
document.getElementById("phone").addEventListener("click", showPhoneAlert);
function showPhoneAlert() {
  // Cordova is now initialized. Have fun!
  console.log("phone button pressed");
  navigator.notification.prompt(
    "Please enter your phone.", // message
    setPhone, // callback to invoke
    "Set Phone Number", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

function setPhone(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
    webengage.user.setAttribute("we_phone", results.input1);
  }
}

// SET HASHED PHONE
document
  .getElementById("hashedPhone")
  .addEventListener("click", showHashedPhoneAlert);
function showHashedPhoneAlert() {
  // Cordova is now initialized. Have fun!
  console.log("hashed phone button pressed");
  navigator.notification.prompt(
    "Please enter your hashed phone number.", // message
    setHashedPhone, // callback to invoke
    "Set Hashed Phone Number", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

function setHashedPhone(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
    webengage.user.setAttribute("we_hashed_phone", results.input1);
  }
}

// SET LOCATION
document
  .getElementById("location")
  .addEventListener("click", showLocationAlert);
function showLocationAlert() {
  // Cordova is now initialized. Have fun!
  console.log("location button pressed");
}

function setLocation(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
  }
}

// SET SCREEN NAME
document.getElementById("screen").addEventListener("click", showScreenAlert);
function showScreenAlert() {
  // Cordova is now initialized. Have fun!
  console.log("screen button pressed");
  navigator.notification.prompt(
    "Please enter Screen name.", // message
    setScreenName, // callback to invoke
    "Set Screen Name", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

function setScreenName(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
    webengage.screen(results.input1);
  }
}

// Pass FCM Token To WebEngage
function sendFcmToken() {
  webengage.push.sendFcmToken("PASS_YOUR_TOKEN_FROM_JS");
}

// Pass FCM Message To WebEngage
function sendOnMessageRecieved() {
  const jsonData = {
    message_data: {
      identifier: "WEBENGAGE_LICENSE",
      image: null,
      rt: "<!DOCTYPE html><html><head></head><body>Test Title</body></html>",
      custom: [
        {
          key: "provider",
          value: "FCM",
        },
      ],
      expandableDetails: {
        style: "BIG_TEXT",
        ratingScale: 5,
        message: "Test Description",
      },
      title: "Test Title",
      message: "Test Description",
      priority: null,
      bckColor: "",
      cta: null,
      timeToLive: 86400,
      messageAction: "NOTIFICATION",
      customEventData: null,
      childExperimentMetaData: null,
      experimentId:
        "T_~asdf0s||asdf-7f60-4cd8-9d21-325493bbdafe#2:1716972731492",
      packageName: "com.webengage.cordovaSample",
      rm: "<!DOCTYPE html><html><head></head><body>Test Description</body></html>",
      license_code: "~134105693",
    },
    source: "webengage",
    message_action: "show_system_tray_notification",
  };
  webengage.push.onMessageReceived(jsonData);
}

// TRACK EVENT
document.getElementById("event").addEventListener("click", showEventAlert);
function showEventAlert() {
  // Cordova is now initialized. Have fun!
  console.log("event button pressed");
  navigator.notification.prompt(
    "Please enter Event name.", // message
    trackEvent, // callback to invoke
    "Track Event", // title
    ["Ok", "Cancel"], // buttonLabels
    "" // defaultText
  );
}

function trackEvent(results) {
  console.log(results);
  if (results.buttonIndex == 1) {
    alert("You are logged in with the username: " + results.input1);
    webengage.track(results.input1);
  }
}
