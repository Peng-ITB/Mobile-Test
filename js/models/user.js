approvalApp.User = Backbone.Model.extend({

	defaults: {
	},
	initialize: function(){
	},
	
    loadCurrentUser: function(options) {
        var self = this;
        forcetkClient.ajax('/' + apiVersion + '/chatter/users/me', function(user) {
            self.set(user);
            options.success();
        }, function() {
            console.log("Can't get current user");
        });
    }
});


approvalApp.UserCollection = Backbone.Collection.extend({

    model: approvalApp.User,
    
    users: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var data = options.data ? options.data : {};
        
        forcetkClient.ajax('/' + apiVersion + '/chatter/users', function(items) {
	        if (options.reset) {
	            self.reset();
	        }
	        for (var i = 0; i < items.users.length; i++) {
	            var item = new approvalApp.User(items.users[i]);
	            self.push(item);
	        }
	        if (options.success) {
	            options.success(items);
	        }
        });
    }
});