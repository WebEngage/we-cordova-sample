let loggedInCuid = null;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  loggedInCuid = window.localStorage.getItem("userId");
  updateUsername(loggedInCuid);
  handleLogoutButton();
  document
    .getElementById("notification-bell")
    .addEventListener("click", handleNotificationClick);
  getNotificationCount();
}

function handleLogoutButton() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!loggedInCuid) {
      logoutBtn.innerHTML = "Login";
    } else {
      logoutBtn.innerHTML = "Logout";
    }
    logoutBtn.addEventListener("click", handleLogout);
}

function updateUsername(username) {
  let usernameElement = document.getElementById("username");
  if (usernameElement) {
    usernameElement.textContent = username || "Guest";
  }
}

function handleLogout() {
  if (loggedInCuid) {
    webengage.user.logout();
    clearUserId();
  }
  history.back();
}

function handleNotificationClick() {
  WENotificationInboxPlugin.resetNotificationCount();
  window.location.href = "notificationInbox.html";
}

function getNotificationCount() {
  WENotificationInboxPlugin.getNotificationCount(
    function (count) {
      document.getElementById("notification-count").textContent = count;
    },
    function (error) {
      console.error("WebEngage-Inbox: Error getting notification count: " + error);
    }
  );
}

function clearUserId() {
  window.localStorage.setItem("userId", "");
}
