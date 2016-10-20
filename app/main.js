Backbone.Model.prototype.idAttribute = '_id';

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var User = Backbone.Model.extend({
  
});

var Users = Backbone.Collection.extend({
  url: 'http://localhost:8000/api/users',
  comparator: "name"
});

var UserView = Backbone.View.extend({
  tagName: 'tr',
  render: function(){
    this.$el.html(_.map([
      this.model.get("firstName") + " " + this.model.get("lastName"),
      this.model.get("phone"),
      this.model.get("email")
    ], function(val, key){
      return "<td>" + val + "</td>";
    }));
    return this;
  }
});

var UsersView = Backbone.View.extend({
  tagName: 'table',
  className: 'table table-bordered',
  initialize: function(){
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.collection, 'sort', this.render)
  },
  events: {
    'click #name-column': 'sortName',
    'click #phone-column': 'sortPhone',
    'click #email-column': 'sortEmail'
  },
  render: function(){
    this.$el.empty();
    this.$el.append($("<tr></tr>").html(
      _.map(["Name", "Phone", "Email"],
      function(val, key) {
          return "<th id='" + val.toLowerCase() + "-column'>" + val + "</th>";
      })
    ));
    this.$el.append(
      _.map(this.collection.models, function(model, key){
        return new UserView({ model: model}).render().el;
      })
    );
    return this;
  },
  sortName: function(){
    this.collection.comparator = 'lastName'
    this.collection.sort();
  },
  sortEmail: function(){
    this.collection.comparator = 'email'
    this.collection.sort();
  },
  sortPhone: function(){
    this.collection.comparator = "phone"
    this.collection.sort();
  }
});

$(function(){
  var users = new Users;
  users.fetch();
  var usersView = new UsersView({ collection: users });
  $('#main').html(usersView.render().el);
});