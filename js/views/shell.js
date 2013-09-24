approvalApp.ShellView = Backbone.View.extend({

    initialize: function () {
        // this.searchResults = new approvalApp.EmployeeCollection();
        // this.searchresultsView = new approvalApp.EmployeeListView({model: this.searchResults, className: 'dropdown-menu'});
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    }

});