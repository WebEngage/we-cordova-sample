document.addEventListener('deviceready', onDeviceReady, false);
let messageListObj = [];
let hasNextPage = false;
let spinnerTimeout = null;
let noNotificationList = null;
const UNREAD = 'unread';
const READ = 'read';
const DELETE = 'delete';
function onDeviceReady() {

    fetchNotificationList();

    const backButton = document.getElementById('backBtn');
    backButton.addEventListener('click', function () {
        history.back();
    });

    const menuIcon = document.getElementById("menu-icon");
    menuIcon.addEventListener("click", toggleMenu);

    const readAll = document.getElementById("readAll");
    readAll.addEventListener("click", function () {
        handleButtonClick(READ);
    });

    const unreadAll = document.getElementById("unreadAll");
    unreadAll.addEventListener("click", function () {
        handleButtonClick(UNREAD);
    });

    const deleteAll = document.getElementById("deleteAll");
    deleteAll.addEventListener("click", function () {
        handleButtonClick(DELETE);
    });

    const fetchMoreButton = document.getElementById("fetchMoreButton");
    fetchMoreButton.addEventListener("click", fetchNextList);

    noNotificationList = document.getElementById("no-notification");

}

function toggleMenu() {
    const floatingMenu = document.getElementById("floatingMenu");
    floatingMenu.classList.toggle("active-menu");
}

function handleButtonClick(buttonNumber) {
    switch (buttonNumber) {
        case READ:
            if (messageListObj.length) {
                WENotificationInboxPlugin.readAll(messageListObj);
                messageListObj.forEach(item => {
                    item.status = 'READ'
                });
                populateTableView(messageListObj);
            } else {
                alert('No Notifications available.')
            }
            alert('All Notifications Marked as Read.');
            break;
        case UNREAD:
            if (messageListObj.length) {
                WENotificationInboxPlugin.unReadAll(messageListObj);
                messageListObj.forEach(item => {
                    item.status = 'UNREAD'
                });
                populateTableView(messageListObj);
            } else {
                alert('No Notifications available.')
            }
            alert('All Notifications Marked as UnRead.');
            break;
        case DELETE:
            if (messageListObj.length) {
                WENotificationInboxPlugin.deleteAll(messageListObj);
                clearCustomCells();
            } else {
                alert('No Notifications available.')
            }
            alert('All Notifications Marked as Delete.');
            break;
        default:
            break;
    }
    const floatingMenu = document.getElementById("floatingMenu");
    floatingMenu.classList.remove("active-menu");
}

function fetchNotificationList() {

    showSpinner();
    console.log("getNotificationList called from cordova : ");

    WENotificationInboxPlugin.getNotificationList(null,
        function (response) {
            const notificationResponse = response;
            notificationListSuccess(notificationResponse);
            hideSpinner();
        },
        function (error) {
            hideSpinner();
            console.log("webengage-inbox: Error getting notification list: " + error);
        }
    );
}

function fetchNextList() {
    if (messageListObj.length) {
        showSpinner();
        const offset = messageListObj[messageListObj.length - 1];
        WENotificationInboxPlugin.getNotificationList(offset,
            function (response) {
                const notificationResponse = response;
                notificationListSuccess(notificationResponse);
                hideSpinner();
            },
            function (error) {
                console.error("Error getting notification list: " + error);
                hideSpinner();
            });
    }
}

function showSpinner() {
    document.querySelector('.spinner').style.display = 'block';
    document.getElementById('spinnerOverlay').style.display = 'block';
    spinnerTimeout = setTimeout(() => {
        hideSpinner();
    }, 5000);
}

function hideSpinner() {
    document.querySelector('.spinner').style.display = 'none';
    document.getElementById('spinnerOverlay').style.display = 'none';
    if (!messageListObj.length) {
        showNoNotificationMessage();
    } else {
        hideNoNotificationMessage();
    }
    clearTimeout(spinnerTimeout);

}

const hideNoNotificationMessage = () => {
    noNotificationList.style.display = 'none';
    noNotificationList.innerHTML = '';
}

const showNoNotificationMessage = () => {
    noNotificationList.style.display = 'block';
    noNotificationList.innerHTML = 'No Notification Available to display';
}
function showFetchMoreButton() {
    fetchMoreButton.style.display = "block";
}

function hideFetchMoreButton() {
    fetchMoreButton.style.display = "none";
}

function createCustomCell(item) {
    let richTitle = null;
    let richMessage = null;
    const listItem = document.createElement('li');
    listItem.className = 'custom-cell';
    listItem.id = 'custom-cell-' + item.experimentId;

    // Create labels
    if(item.message !== null && item.message.customizations)
    {
        const customizations = item.message.customizations;
        if(customizations.richTitle && customizations.richMessage)  {
            richTitle = customizations.richTitle 
            richMessage = customizations.richMessage
        }
    }
    console.log("WebEngage: richText - "+richTitle)
    console.log("WebEngage: richMessage - "+richMessage)

    if (richTitle !== null) {
        const richTitleElement = document.createElement('div');
        richTitleElement.innerHTML = richTitle;
        listItem.appendChild(richTitleElement);
    } else {
        // Fallback to titleLabel if richTitle is null
        const titleLabel = createLabel('Title:', item.message.title);
        listItem.appendChild(titleLabel);
    }

    if(richMessage !== null) {
        const richMessageElement = document.createElement('div');
        richMessageElement.innerHTML = richMessage;
        listItem.appendChild(richMessageElement);
    } else {
        // Fallback to descriptionLabel if richMessage is null
        const descriptionLabel = createLabel('Description:', item.message.message);
        listItem.appendChild(descriptionLabel);
    }

    // const titleLabel = createLabel('Title:', item.message.title);
    // const descriptionLabel = createLabel('Description:', item.message.message);
    const expIdLabel = createLabel('Exp Id:', item.experimentId);
    const statusLabel = createLabel('Status:', item.status);
    statusLabel.id = 'status-' + item.experimentId;

    // listItem.appendChild(titleLabel);
    // listItem.appendChild(descriptionLabel);

    listItem.appendChild(expIdLabel);
    listItem.appendChild(statusLabel);

    // Create buttons
    const readButton = createButton('Read', item, onReadClick);
    const unreadButton = createButton('Unread', item, onUnreadClick);
    const clickButton = createButton('Click', item, onClickClick);
    const viewButton = createButton('View', item, onViewClick);
    const deleteButton = createButton('Delete', item, onDeleteClick);

    // Add buttons to the custom cell
    listItem.appendChild(readButton);
    listItem.appendChild(unreadButton);
    listItem.appendChild(clickButton);
    listItem.appendChild(viewButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

// function createCustomCell(item) {
//     let richTitle = null;
//     let richMessage = null;
//     const listItem = document.createElement('li');
//     listItem.className = 'custom-cell';
//     listItem.id = 'custom-cell-' + item.experimentId;

//     // Create labels
//     if(item.message !== null && item.message.customizations)
//     {
//         const customizations = item.message.customizations;
//         if(customizations.richTitle && customizations.richMessage)  {
//             richTitle = customizations.richTitle 
//             richMessage = customizations.richMessage
//         }
//     }

//     const titleLabel = createLabel('Title:', item.message.title);
//     const descriptionLabel = createLabel('Description:', item.message.message);
//     const expIdLabel = createLabel('Exp Id:', item.experimentId);
//     const statusLabel = createLabel('Status:', item.status);
//     statusLabel.id = 'status-' + item.experimentId;

//     // Add labels to the custom cell
//     if(richTitle) {
//         listItem.appendChild(richTitle);
//     } else {
//         listItem.appendChild(titleLabel);
//     }
//     if(richMessage) {
//         listItem.appendChild(richMessage);
//     } else {
//         listItem.appendChild(descriptionLabel);
//     }

//     listItem.appendChild(expIdLabel);
//     listItem.appendChild(statusLabel);

//     // Create buttons
//     const readButton = createButton('Read', item, onReadClick);
//     const unreadButton = createButton('Unread', item, onUnreadClick);
//     const clickButton = createButton('Click', item, onClickClick);
//     const viewButton = createButton('View', item, onViewClick);
//     const deleteButton = createButton('Delete', item, onDeleteClick);

//     // Add buttons to the custom cell
//     listItem.appendChild(readButton);
//     listItem.appendChild(unreadButton);
//     listItem.appendChild(clickButton);
//     listItem.appendChild(viewButton);
//     listItem.appendChild(deleteButton);

//     return listItem;
// }

function createButton(text, item, clickHandler) {
    const button = document.createElement('button');
    button.className = 'button';
    button.textContent = text;
    button.addEventListener('click', function () {
        clickHandler(item);
    });
    return button;
}

function createLabel(labelText, valueText) {
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = labelText + ' ' + valueText;
    return label;
}

function onReadClick(item) {
    if (item.status.toLowerCase() === UNREAD) {
        WENotificationInboxPlugin.markRead(item);
        const labelToUpdate = document.getElementById('status-' + item.experimentId);
        labelToUpdate.textContent = 'Status: READ'
        item.status = READ.toUpperCase();
        alert('Notification marked as read');
    } else {
        alert('Notification already Read.');
    }
}
function onUnreadClick(item) {
    if (item.status.toLowerCase() === READ) {
        WENotificationInboxPlugin.markUnread(item);
        const labelToUpdate = document.getElementById('status-' + item.experimentId);
        labelToUpdate.textContent = 'Status: UNREAD'
        item.status = UNREAD.toUpperCase();
        alert('Notification marked a Unread.');
    } else {
        alert('Notification already UnRead.');
    }
}

function onClickClick(item) {
    WENotificationInboxPlugin.trackClick(item);
    alert('Notification Clicked.');
}

function onViewClick(item) {
    WENotificationInboxPlugin.trackView(item);
    alert('Notification Viewed.');
}

function onDeleteClick(item) {
    WENotificationInboxPlugin.markDelete(item);
    const cellToRemove = document.getElementById('custom-cell-' + item.experimentId);
    cellToRemove.remove();
    alert('Notification Deleted.');
}

function clearCustomCells() {
    const customList = document.getElementById('custom-list');
    customList.innerHTML = '';
}

function notificationListSuccess(notificationResponse) {
    const messageList = notificationResponse['messageList'];
    const hasNext = notificationResponse['hasNext'];
    try {
        hasNext === true ? showFetchMoreButton() : hideFetchMoreButton();
        if (typeof messageListObj === 'undefined') {
            messageListObj = messageList;
        } else {
            messageListObj = messageListObj.concat(messageList);
        }
        populateTableView(messageListObj);
    } catch (error) {
        console.error("Error parsing JSON: " + error);
    }
}

function populateTableView(messageListObj) {
    clearCustomCells();
    const customList = document.getElementById('custom-list');
    messageListObj.forEach(item => {
        const customCell = createCustomCell(item);
        customList.appendChild(customCell);
    });
}