var approvalApp = {
	
	loggedIn: false,
	dataInited: false,

    views: {},

    models: {},
    
    viewTemplates: ["ShellView", "HomeView", "UserDetailView", "TaskView", "TaskItemView", "TaskDetailView", "TaskEditView"],
    
    modelSObjects: ["Task"],

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (approvalApp[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    approvalApp[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },
    
    loadDescribes: function(sObjects, callback) {

	    var deferreds = [];

        $.each(sObjects, function(index, sObject) {
            if (approvalApp[sObject]) {
                deferreds.push(
	                forcetkClient.describe(approvalApp[sObject].sObjectType, function(data) {
	                	approvalApp[sObject].prototype.sObjectDescribe = data;
	                })
                );
            } else {
                alert(sObject + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

approvalApp.Router = Backbone.Router.extend({
	
	routes: {
		"":                              "home",
		"home":                          "home",
		"task":                          "task",
		"task/detail/:id":               "taskDetail",
		"task/edit/:id":                 "taskEdit"
    },

    initialize: function() {
        approvalApp.shellView = new approvalApp.ShellView();
        $('body').html(approvalApp.shellView.render().el);
        this.$content = $("#content");
    },

    home: function() {
        if(!approvalApp.homeView) {
            approvalApp.homeView = new approvalApp.HomeView({model: approvalApp.currentUser});
        	approvalApp.homeView.render();
			this.$content.html(approvalApp.homeView.el);
			approvalApp.homeView.loadData();
		}
		else {
            console.log('reusing home view');
            this.$content.html(approvalApp.homeView.el);
            approvalApp.homeView.delegateEvents();
			approvalApp.homeView.loadData();
        }
    },
    
    task: function() {
        if (!approvalApp.taskView) {
            approvalApp.taskView = new approvalApp.TaskView({model: approvalApp.currentUser});
            approvalApp.taskView.render();
            this.$content.html(approvalApp.taskView.el);
            approvalApp.taskView.loadData();
        } else {
        	console.log('reusing task view');
        	this.$content.html(approvalApp.taskView.el);
            approvalApp.taskView.delegateEvents();
        }
    },
    
    taskDetail: function(id) {
    	var task = approvalApp.taskView.items.get(id);
    	approvalApp.taskDetailView = new approvalApp.TaskDetailView({model: task});
    	approvalApp.taskDetailView.render();
        this.$content.html(approvalApp.taskDetailView.el);
    },
    
    taskEdit: function(id) {
        var task = approvalApp.taskView.items.get(id);
    	approvalApp.taskEditView = new approvalApp.TaskEditView({model: task});
    	approvalApp.taskEditView.render();
        this.$content.html(approvalApp.taskEditView.el);
    }
});