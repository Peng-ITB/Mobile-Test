// The version of the REST API you wish to use in your app.
var apiVersion = "v28.0";

// If you want to prevent dragging, uncomment this section
/*
 function preventBehavior(e)
 {
 e.preventDefault();
 };
 document.addEventListener("touchmove", preventBehavior, false);
 */

/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
/*
 function handleOpenURL(url)
 {
 // do something with the url passed in.
 }
 */

var forcetkClient;
var debugMode = true;
var logToConsole = cordova.require("salesforce/util/logger").logToConsole;

jQuery(document).ready(function() {
    //Add event listeners and so forth here
    logToConsole("onLoad: jquery ready");
    document.addEventListener("deviceready", onDeviceReady,false);
});

// When this function is called, Cordova has been initialized and is ready to roll
function onDeviceReady() {
    logToConsole("onDeviceReady: Cordova ready");
    //Call getAuthCredentials to get the initial session credentials
    cordova.require("salesforce/plugin/oauth").getAuthCredentials(salesforceSessionRefreshed, getAuthCredentialsError);
    
    //register to receive notifications when autoRefreshOnForeground refreshes the sfdc session
    document.addEventListener("salesforceSessionRefresh",salesforceSessionRefreshed,false);
    
    //enable buttons
    regLinkClickHandlers();
}

function salesforceSessionRefreshed(creds) {
    logToConsole("salesforceSessionRefreshed");
    
    // Depending on how we come into this method, `creds` may be callback data from the auth
    // plugin, or an event fired from the plugin.  The data is different between the two.
    var credsData = creds;
    if (creds.data)  // Event sets the `data` object with the auth data.
        credsData = creds.data;
    
    forcetkClient = new forcetk.Client(credsData.clientId, credsData.loginUrl, null,
                                       cordova.require("salesforce/plugin/oauth").forcetkRefresh);
    forcetkClient.setSessionToken(credsData.accessToken, apiVersion, credsData.instanceUrl);
    forcetkClient.setRefreshToken(credsData.refreshToken);
    forcetkClient.setUserAgentString(credsData.userAgent);

    approvalApp.currentUser = new approvalApp.User();
    
	approvalApp.loggedIn = true;
	
	
    console.log("start loading page...");
    approvalApp.loadTemplates(approvalApp.viewTemplates, function () {
        approvalApp.router = new approvalApp.Router();
        Backbone.history.start();
    });
    
/*
    approvalApp.loadDescribes(approvalApp.modelSObjects, function() {
    	approvalApp.currentUser.fetch({
	        success: function() {
	            if (approvalApp.currentUser != null && approvalApp.currentUser.id != null) {
	                console.log("start loading page...");
	                approvalApp.loadTemplates(approvalApp.viewTemplates, function () {
	                        console.log("loaded all template htmls");
	                        approvalApp.router = new approvalApp.Router();
	                        Backbone.history.start();
	                });
	            } else {
	                alert("Can't get current user!");
	            }
	        }
	    });
    });
*/
}

function getAuthCredentialsError(error) {
    logToConsole("getAuthCredentialsError: " + error);
}
