approvalApp.HomeView = approvalApp.BaseView.extend({

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        
		if(approvalApp.loggedIn) {
			$("#homeWrapper", this.el).html(new approvalApp.UserDetailView({model: approvalApp.currentUser}).render().el);
		}
		
        return this;
    },
    
    loadData: function() {
    	if(approvalApp.loggedIn && !approvalApp.dataInited) {
	    	var self = this;
	    	this.togglePageLoading();
	    	
	    	console.log("Data initialize...");
	        this.model.loadCurrentUser({success: function() {
	        	console.log("Got current user.");
	        	approvalApp.loadDescribes(approvalApp.modelSObjects, function() {
	        		console.log("Got describes.");
			        self.togglePageLoading(); 
					approvalApp.dataInited = true; 
				}); 
			}});
		}
    }
});


approvalApp.UserDetailView = approvalApp.BaseView.extend({    
});