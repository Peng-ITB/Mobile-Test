approvalApp.TaskView = approvalApp.ScorllableListView.extend({

	wrapperId: "taskListWrapper",

    events: {
         "click tr": "showDetail"
    },
    
    initialize: function() {
    	var self = this;
        this.model.on("change", this.render, this);
        this.taskModel = new approvalApp.Task();
        this.items = new approvalApp.TaskCollection();
        this.items.on("reset", this.reset, this);
        this.items.on("add", function(task) {
            $(self.getItemListWrapperBodySelector(task), self.el).append(new approvalApp.TaskItemView({model: task}).render().el);
        });
    },

    render: function() {
    	this.taskModel.set({
    		subjectField: this.taskModel.getField("Subject"), 
    		statusField: this.taskModel.getField("Status"), 
    		activityDateField: this.taskModel.getField("ActivityDate"),
    		priorityField: this.taskModel.getField("Priority"),
    		descriptionField: this.taskModel.getField("Description")
    	});
    	
        this.$el.html(this.template(this.model.attributes, this.taskModel.attributes));
        _.each(this.items.models, function(task) {
            $(this.getItemListWrapperBodySelector(task), this.el).append(new approvalApp.TaskItemView({model: task}).render().el);
        }, this);
        return this;
    },
    
    loadData: function() {
    	var self = this;
    	this.togglePageLoading();
        this.items.fetchByOwner({reset: true, data: {ownerId: this.model.get("id")}, clearCache: true, success: function() {
	        self.togglePageLoading();
			self.loadScroll(self.wrapperId);
        }});
    },
    
    refresh: function() {
    	var self = this;
        this.items.fetchByOwner({reset: true, data: {ownerId: this.model.get("id")}, clearCache: true, success: function() {
			self.loadScroll(self.wrapperId);
        }});
    },
	
	pullDownAction: function() {
		this.refresh();
	},
	
	pullUpAction: function() {
	},
	
	showDetail: function(e) {
		approvalApp.router.navigate("task/detail/" + $(e.currentTarget).data("approvalItemid"), {trigger: true});
	}

});

approvalApp.TaskItemView = approvalApp.ItemView.extend({

	el: function() {
		return "<tr data-approval-itemid='" + this.model.get("Id") + "'></tr>";
	}

});


approvalApp.TaskDetailView = approvalApp.BaseView.extend({    

    render: function() {
    	var data = _.extend(this.model.attributes, {
    		subjectField: this.model.getField("Subject"), 
    		statusField: this.model.getField("Status"), 
    		activityDateField: this.model.getField("ActivityDate"),
    		priorityField: this.model.getField("Priority"),
    		descriptionField: this.model.getField("Description")
    	});
    	
        this.$el.html(this.template(data));
        return this;
    }
});

approvalApp.TaskEditView = approvalApp.BaseView.extend({

	events: {
		"click #saveBtn": "save"
    },

    render: function() {
    	var data = _.extend(this.model.attributes, {
    		subjectField: this.model.getField("Subject"), 
    		statusField: this.model.getField("Status"), 
    		activityDateField: this.model.getField("ActivityDate"),
    		priorityField: this.model.getField("Priority"),
    		descriptionField: this.model.getField("Description")
    	});
        this.$el.html(this.template(data));
        return this;
    },
    
    save: function() {
    	var self = this;
    	this.model.save({
    		fields: {
    			Subject: $("#inputSubject").val(),
    			Status: $("#inputStatus").val(),
    			Description: $("#inputDescription").val(),
    			Priority: $("#inputPriority").val()
    		}, 
    		success: function() {
	    		approvalApp.router.navigate("task/detail/" + self.model.get("Id"), {trigger: true});
	    	}
    	});
    }
    
});