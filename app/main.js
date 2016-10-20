Backbone.Model.prototype.idAttribute = '_id';

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var User = Backbone.Model.extend({
  
});

var Users = Backbone.Collection.extend({
  url: 'http://localhost:8000/api/users'
});

var UserView = Backbone.View.extend({
  tagName: 'tr',
  render: function(){
    this.$el.html(_.map([
      this.model.get("name"),
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
  },
  render: function(){
    this.$el.empty();
    this.$el.append($("<tr></tr>").html(
      _.map(["Name", "Phone", "Email"],
      function(val, key) {
          return "<th>" + val + "</th>";
      })
    ));
    this.$el.append(
      _.map(this.collection.models, function(model, key){
        return new UserView({ model: model}).render().el;
      })
    );
    return this;
  }
});

$(function(){
  var users = new Users;
  users.fetch();
  var usersView = new UsersView({ collection: users });
  $('#main').html(usersView.render().el);
});