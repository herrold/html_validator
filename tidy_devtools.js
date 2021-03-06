//*************************************************************************
// HTML Validator
//
//  File: tidy_devtools.js
//  Description: WebExtension devtools panel
//  Author : Marc Gueury
//  Licence : see licence.txt
//*************************************************************************

chrome.devtools.panels.create("HTML validator", "skintidy_devtools.png", "common/tidy_view_source_horiz.html", function(extensionPanel) {

  var _window, callbackQueue = [];
  // Connect to the background page
  var port = chrome.runtime.connect({
    name: "devtools"
  });

  extensionPanel.onShown.addListener(function tmp(panelWindow) {
    console.log("tidy: <extensionPanel.onShown>");
    extensionPanel.onShown.removeListener(tmp); // Run once only
    updateWindow(panelWindow);
    console.log("tidy: </extensionPanel.onShown>");
  });

  // For page refresh
  port.onMessage.addListener(
    function(request) {
      updateIcon('skin/disabled.png');
      if (request.tabId == null || request.tabId == chrome.devtools.inspectedWindow.tabId) {
        // The message sent by the background page contains the name of the current URL
        if (typeof request.html == "string") {
          // This is the WA for FF57
          updateHtml(request.html);
        } else {
          updateHtmlReport(request.url, false);
        }
      }
    }
  );

  // Check that the getResources is available or not
  var bFF57 = typeof chrome.devtools.inspectedWindow.getResources == "undefined";
  port.postMessage({
    from: 'tidy_devtools',
    ff57: bFF57,
    tabId: chrome.devtools.inspectedWindow.tabId
  });
});
