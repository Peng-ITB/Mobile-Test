/*
 * This code allows you to use the Force.com REST API sample from your own
 * server, using OAuth to obtain a session id.
 * Note that you will need to run proxy.php, since Javascript loaded from your
 * own server cannot directly call the REST API.
 */

// The version of the REST API you wish to use in your app.
var apiVersion = "v28.0";

// OAuth Configuration
var loginUrl    = 'https://login.salesforce.com/';
var clientId    = '3MVG9A2kN3Bn17hssE9VaO1IbE3UTnEmrPnGnUd2CC2iL0c0_nIK.KRc7fopdIOfzlI7HYKsBM5Ktn27oprVX';
var redirectUri = 'http://localhost:8888/Mobile-Test/oauthcallback.html';
var proxyUrl    = 'http://localhost:8888/Mobile-Test/proxy.php?mode=native';

var forcetkClient = new forcetk.Client(clientId, loginUrl, proxyUrl);

function getAuthorizeUrl(loginUrl, clientId, redirectUri){
    return loginUrl+'services/oauth2/authorize?display=popup'
        +'&response_type=token&client_id='+escape(clientId)
        +'&redirect_uri='+escape(redirectUri);
}

function sessionCallback(oauthResponse) {
	console.log("sessionCallback");
    if (typeof oauthResponse === 'undefined'
        || typeof oauthResponse['access_token'] === 'undefined') {
        alert(('Error - unauthorized!'));
    } else {
        forcetkClient.setSessionToken(oauthResponse.access_token, null,
            oauthResponse.instance_url);
        
		approvalApp.loggedIn = true;
		$("#loginsfdc").hide();
		
		approvalApp.router.navigate("home", {trigger: true, replace: true});
        
      /*
  approvalApp.loadDescribes(approvalApp.modelSObjects, function() {
	        approvalApp.currentUser.fetch({
	            success: function() {
	            	
	                if (approvalApp.currentUser != null && approvalApp.currentUser.id != null) {
	                	console.log("Got User");
						approvalApp.router.navigate("home", {trigger: true});
	                	
	                } else {
	                    alert("Can't get current user!");
	                }
	            }
	        });
        });
*/
    }
}

$(document).on("ready", function() {
	approvalApp.currentUser = new approvalApp.User();
    approvalApp.loadTemplates(approvalApp.viewTemplates, function() {
        approvalApp.router = new approvalApp.Router();
        Backbone.history.start();
        
        $("#loginsfdc").show();
        $("#loginsfdc").popupWindow({ 
            windowURL: getAuthorizeUrl(loginUrl, clientId, redirectUri),
            windowName: 'Connect',
            centerBrowser: 1,
            height:524, 
            width:675
        });
    });
});
