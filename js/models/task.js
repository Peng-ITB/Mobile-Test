approvalApp.Task = Backbone.Model.extend({
	
	save: function(options) {
		var self = this;
		options = options ? _.clone(options) : {};
		var fields = options.fields ? options.fields : {};
		forcetkClient.update("Task", this.get("Id"), fields, 
			function() {
				self.set(fields);
				if (options.success) {
		            options.success();
		        }
			}, function() {
				if (options.error) {
		            options.error();
		        }
			}
		);
	},
	
	getField: function(fieldName) {
		for (var i = 0; i < this.sObjectDescribe.fields.length; i++) {
			if (fieldName == this.sObjectDescribe.fields[i].name) return this.sObjectDescribe.fields[i];
		}
		return {};
	}
	
}, {
	sObjectType: "Task"
});

approvalApp.TaskCollection = Backbone.Collection.extend({

    model: approvalApp.Task,
    
    fetchByOwner: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var clearCache = options.clearCache ? options.clearCache : false;
        var data = options.data ? options.data : {};
        if (data.ownerId) {
            var soql = "SELECT Id, Subject, ActivityDate, Status, Priority, Description, OwnerId "
                            + "FROM Task where OwnerId = '" + data.ownerId + "' "
                            + "and Status in ('Not Started', 'In Progress') "
                            + "ORDER BY ActivityDate ASC NULLS LAST, CreatedDate ASC";
            if (clearCache || approvalApp.storage == null || approvalApp.storage.get(soql) == null) {
                console.log("fetch tasks (by fetchByOwner)");
                forcetkClient.query(soql, function(tasks) {
                    self.processTasks(tasks, self, options);
                    if (approvalApp.storage) {
                        approvalApp.storage.put(soql, tasks);
                    }
                });
            } else {
                var tasks = approvalApp.storage.get(soql);
                this.processTasks(tasks, self, options);
            }
        }
    },
    
    processTasks: function(tasks, model, options) {
        if (options.reset) {
            model.reset();
        }
        for (var i = 0; i < tasks.records.length; i++) {
            var task = new approvalApp.Task(tasks.records[i]);
            task.set({id: task.get("Id")});
            model.push(task);
        }
        if (options.success) {
            options.success(tasks);
        }
    }

});